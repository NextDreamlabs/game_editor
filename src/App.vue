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
import { AmbientLight, PointLight, PointLightHelper, Object3D } from 'three';
import { DirectionalLightNode, PointLightNode, SpotLightNode } from './core/node/lights';
import nodeTreePanelVue from './ui/nodeTreePanel.vue';
import RightPanel from './ui/Panel/RIghtPanel.vue';
import { writeFile, BaseDirectory } from '@tauri-apps/plugin-fs';
import * as fs from "@tauri-apps/api/path";
let encoder = new TextEncoder();
let data = encoder.encode("Hello World");

const eventManager = ref(null) as Ref<EventManager | null>
let __engine__ = null
let __scene__ = null
onMounted(() => {
  const editorPanel = document.getElementById('Editor_Panel');
  console.log(editorPanel?.clientWidth, 'editorPanel')
  if (editorPanel) {
    __engine__ = Engine.getInstance(editorPanel);
    eventManager.value = new EventManager();
    __engine__.registerResizeEvent(eventManager.value);
    __scene__ = new Scene('root')
    const __node__ = new MeshNode('mesh')
    const __node__1 = new MeshNode('mesh1')
    const model = new ModelNode('model')
    model.loadModel("/src/assets/主变压器.FBX")
    __node__1.position.y = 10
    __node__.position.y = 1
    __node__.script = 1
    __node__.toJSON()
    console.log(__node__, 'Node')
    console.log(__node__1, '__node__1')
    console.log(__node__, '__node__')
    __scene__.add_node(__node__)
    __scene__.add_node(__node__1)
    __scene__.add_node(model)
    __engine__.add_scene(__scene__)
    console.log(globalStore.value.values().next().value.children, 'store')
    __node__.script = {
      update: (_this: any) => {
        // console.log('update', __scene__.position)
        // _this.position.x += 0.001
        // _this.position.x += 1
      },
      ready: (_this: any) => {
        // alert('load')
        // console.log(_this, 'this')
      }
    }
    // Add ambient light
    const ambientLight = new AmbientLight(0xffffff, 10.5);
    // const o = new Object3D()
    // const p = new PointLight(0xffffff, 100)
    // const ph = new PointLightHelper(p)
    // o.add(p)
    // o.add(ph)
    // o.position.set(0, 10, 0)
    // ph.position.set(0, 10, 0)
    // __engine__.add_light(o);
    // __engine__.add_light(p);

    // Add point light
    const pointLight = new PointLightNode('ponit1', 0xffffff, 1000, 100, 100);
    const dLight = new DirectionalLightNode('ponit1', 0xffffff, 10, 3);
    pointLight.position.set(0, 10, 0);
    dLight.position.set(0, 10, 0);
    // pointLight.light.position.set(0, 10, 0);
    console.log(pointLight.light, 'pointLight.light')
    __scene__.add_node(pointLight);
    // __engine__.add_light(dLight);
    __engine__.start()
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
  } else {
    console.error('Editor_Panel element not found');
  }
})
onBeforeUnmount(() => {
  __engine__.clearThreeScene()
  // Add any other cleanup logic here
})

const saveScene = async () => {
  // __scene__.toJSON()
  // EditorInfo.value.isSave = false
  console.log(await fs.appDataDir())
  console.log(await fs.basename('piexl-editor'))
  console.log(await fs.dataDir())
  console.log(await fs.dirname('piexl-editor'))
  console.log(BaseDirectory, 'BaseDirectory.AppData')

  await writeFile('file.txt', new TextEncoder().encode("Hello World"), { baseDir: BaseDirectory.AppData });

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
    <ResizablePanel id="handle-demo-panel-1" :default-size="25">

      <nodeTreePanelVue></nodeTreePanelVue>
      <div v-for="i in globalStore" :key="i">
        {{ i.name }}
      </div>
    </ResizablePanel>
    <ResizableHandle id="handle-demo-handle-1" with-handle />
    <ResizablePanel :onResize="onResize" id="handle-demo-panel-2" :default-size="50">
      <div class="flex" @click="saveScene" v-if="EditorInfo.isSave">
        保存
      </div>
      <div id="Editor_Panel" class="h-full ">
      </div>

    </ResizablePanel>
    <ResizableHandle id="handle-demo-handle-3" with-handle />
    <ResizablePanel id="handle-demo-panel-3" class="bg-[#29292e]" :default-size="25">
      <div id="rightCurrentPane" style="height: 100vh;" class="h-100vh p-4  overflow-scroll bg-[#29292e]"></div>
    </ResizablePanel>
  </ResizablePanelGroup>
</template>