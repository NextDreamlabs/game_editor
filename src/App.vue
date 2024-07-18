<script setup lang="ts">
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '../src/components/ui/resizable'
import { globalStore, EditorInfo } from './core/store/sceneGraphMap'
import { ref } from 'vue';
import { onMounted, Ref, watch, onBeforeUnmount } from 'vue';
import { Engine, Node, Scene, MeshNode, ModelNode } from './core';
import { EventManager } from './core/Event';
import { AmbientLight, Color, DirectionalLight, Vector3, SphereGeometry, PlaneGeometry, PointLight, PointLightHelper, Object3D, TorusKnotGeometry } from 'three';
import { DirectionalLightNode, PointLightNode, SpotLightNode } from './core/node/lights';
// import { writeFile, BaseDirectory } from '@tauri-apps/plugin-fs';
import * as fs from "@tauri-apps/api/path";
import secneJson from '../src/scene.json'
import ScriptLoadPane from "../src/ui/Panel/ScriptLoadPane/index.vue"
import sceneNodePane from "../src/ui/sceneNodePanel/index.vue"
import SceneHeaderTab from './ui/Panel/SceneHeaderTab.vue'
import AnimationPlayer from './core/animation/AnimationPlayer';
import { InitPhysics } from './core/physics';
import { RigidBody } from './core/physics/RigidBody';
let encoder = new TextEncoder();
let data = encoder.encode("Hello World");

const testLoader = false
const eventManager = ref(null) as Ref<EventManager | null>
let __engine__: any = null
let __scene__: any = null
onMounted(async () => {
  await InitPhysics()
  const editorPanel = document.getElementById('Editor_Panel');
  console.log(editorPanel?.clientWidth, 'editorPanel')
  if (editorPanel) {
    __engine__ = await Engine.getInstance(editorPanel);
    eventManager.value = new EventManager();
    __engine__.registerResizeEvent(eventManager.value);
    // __engine__.loadScene(secneJson)
    // const _scene = new Scene('root2')

    if (testLoader) {
      secneJson.children.forEach((node: any) => {
        console.log(node, 'node');
        switch (node.type) {
          case 'MeshNode':
            const meshNode = new MeshNode(node.name);
            meshNode.position.set(node.position.x, node.position.y, node.position.z);
            _scene.add_node(meshNode);
            break;
          case 'ModelNode':
            const modelNode = new ModelNode(node.name);
            modelNode.loadModel(node?.modelPath);
            _scene.add_node(modelNode);
            break;
          case 'PointLightNode':
            const lightNode = new PointLightNode(node.name, 0xffffff, 1000, 100, 100);
            lightNode.position.set(node.position.x, node.position.y, node.position.z);
            _scene.add_node(lightNode);
            break;
          default:
            break;
        }
      })
    }

    // console.log(secneJson, 'secneJson')
    __scene__ = new Scene('root')
    const tg = new TorusKnotGeometry(1, 0.3, 200, 32)
    const sp = new SphereGeometry(1, 32, 32)
    const __node__ = new MeshNode('mesh', tg)
    const rbBox = new RigidBody(__node__);
    rbBox.createSphere(1, new Vector3(0, 10, 0), 1);
    rbBox.setRestitution(0.5);
    rbBox.setFriction(1);
    rbBox.setRollingFriction(1);
    rbBox.setBody()
    __node__.add_child(rbBox)

    //地板
    const floorGeometry = new PlaneGeometry(10, 10);
    const __node__2 = new MeshNode('mesh2', floorGeometry)
    __node__2.mesh.rotation.x = -Math.PI / 2; // Rotate to lie flat
    // __node__2.mesh.position.y = -10

    const nr = new RigidBody(__node__2, 'static')
    nr.createBox(0, __node__2.position, __node__2.quaternion, new Vector3(100, 1, 100));
    nr.setRestitution(0.99);
    nr.setBody()
    __node__2.add_child(nr)
    __scene__.add_node(__node__2);


    const __node__1 = new MeshNode('mesh1', sp)
    // __node__1.add_child(new RigidBody(__node__1, 'dynamic'))
    const model = new ModelNode('player')
    await model.loadModel("/src/assets/Xbot.glb")
    model.add_child(new AnimationPlayer(model))
    const spawn_ = () => {
      const n = new MeshNode(new Date().getTime().toString(), undefined, null, false, {
        x: Math.random() * 2 - 1, y: 200.0, z: Math.random() * 2 - 1
      })
      const rb = new RigidBody(n);
      rb.createBox(1, new Vector3(Math.random() * 2 - 1, 50, Math.random() * 2 - 1), n.quaternion, new Vector3(1, 1, 1));
      rb.setRestitution(0.125);
      rb.setFriction(1);
      rb.setRollingFriction(5);
      rb.setBody()
      n.add_child(rb)
      __scene__.add_child(n)
    }
    model.script = {
      update: (_this: any) => {
        console.log('update', __scene__.position)
        spawn_()
        // _this.position.x += 0.001
        // _this.position.x += 1
      },
      ready: (_this: any) => {
        _this.AnimationPlay.play('walk')
        _this.AnimationPlay?.addCallbackAtFrame('walk', 30, 60, () => {
          _this.AnimationPlay.play('run')
        })
        // console.log(_this, 'this')
      }
    }

    __node__1.position.x = 3
    __node__1.position.y = 1
    __node__1.position.z = 1
    model.position.y = 1
    model.position.z = -5

    __node__1.rotation.y = Math.PI / 4
    __node__.position.y = 3
    __node__.position.z = 3
    __node__.script = 1
    __node__.toJSON()
    console.log(__node__, 'Node')
    console.log(__node__1, '__node__1')
    console.log(__node__, '__node__')
    __scene__.add_node(__node__)
    __scene__.add_node(__node__1)
    __scene__.add_node(model)
    __engine__.add_scene(__scene__)
    const Al = new AmbientLight(new Color('#ffffff'));
    Al.intensity = 1.2
    __engine__.add_light(Al);
    const directionalLight = new DirectionalLight(new Color('#ffffff'));
    directionalLight.position.set(10, 10, 10);
    directionalLight.intensity = 3.5
    directionalLight.target = __node__; // Targeting __node__
    directionalLight.castShadow = true; // Enable casting shadows
    __engine__.add_light(directionalLight);
    console.log(globalStore.value.values().next().value.children, 'store')
    __node__.script = {
      update: (_this: any) => {
        console.log('update', __scene__.position)
        // _this.position.x += 0.001
        // _this.position.x += 1
      },
      ready: (_this: any) => {
        // alert('load')
        // console.log(_this, 'this')
      }
    }
    // Add ambient light

    const pointLight = new PointLightNode('ponit1', 0xffffff, 1000, 100, 100);
    const dLight = new DirectionalLightNode('ponit1', 0xffffff, 10, 3);
    pointLight.position.set(0, 10, 0);
    dLight.position.set(0, 10, 0);
    // pointLight.light.position.set(0, 10, 0);
    console.log(pointLight.light, 'pointLight.light')
    // __scene__.add_node(pointLight);
    // __engine__.add_light(dLight);
    // __engine__.start()
    store.value = globalStore.value.values().next().value.children
    console.log(__engine__.get_scene())
    setTimeout(() => {
      let n = new MeshNode('mesh2')
      n.position.set(0, 13, 0)
      __scene__.add_node(n)
      let json = __scene__.toJSON()
      console.log(JSON.stringify(json), 'json')
      // __scene__.children.forEach(element => {

      // });
    }, 3000)
    // __engine__.preview()
    __engine__.start()
  } else {
    console.error('Editor_Panel element not found');
  }
})
onBeforeUnmount(() => {
  __engine__.clearThreeScene()
  // Add any other cleanup logic here
})

const saveScene = async () => {
  console.log(JSON.stringify(__engine__.saveScene()), 'json')
  // EditorInfo.value.isSave = false
  // console.log(await fs.appDataDir())
  // console.log(await fs.basename('piexl-editor'))
  // console.log(await fs.dataDir())
  // console.log(await fs.dirname('piexl-editor'))
  // console.log(BaseDirectory, 'BaseDirectory.AppData')

  // await writeFile('file.txt', new TextEncoder().encode("Hello World"), { baseDir: BaseDirectory.AppData });

}

const store = ref()
const onResize = (e: any) => {
  console.log(e)
  eventManager.value!.emit('resize');
}
console.log(globalStore.value, 'globalStore')
</script>

<template>

  <ResizablePanelGroup id="handle-demo-group-1" direction="horizontal"
    class="min-h-screen min-w-screen rounded-lg border">
    <ResizablePanel id="handle-demo-panel-1" :default-size="10">
      <!-- 左侧菜单 -->
      <sceneNodePane></sceneNodePane>
    </ResizablePanel>
    <ResizableHandle id="handle-demo-handle-1" with-handle />
    <ResizablePanel :onResize="onResize" id="handle-demo-panel-2" :default-size="75">
      <!-- <div class="flex" @click="saveScene" v-if="EditorInfo.isSave">
        保存
      </div> -->
      <!-- 中间场景区域 -->
      <SceneHeaderTab></SceneHeaderTab>
      <div id="Editor_Panel" class="h-full ">
      </div>

    </ResizablePanel>
    <ResizableHandle id="handle-demo-handle-3" with-handle />
    <ResizablePanel id="handle-demo-panel-3" class="bg-[#121416]" :default-size="15">
      <!-- 右侧信息面板 -->
      <ScriptLoadPane></ScriptLoadPane>
      <div id="rightCurrentPane" style="height: 100vh;" class="h-100vh p-4  overflow-scroll bg-[#29292e]"></div>
    </ResizablePanel>
  </ResizablePanelGroup>
</template>

<style>
.editor-button {
  min-width: 28px;
  opacity: 1;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.25);
  transition: all 100ms ease 0s;
  cursor: pointer;

}

.editor-active {
  background: rgba(226, 220, 220, 0.857);
}

.editor-ui-text {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.75),

}
</style>