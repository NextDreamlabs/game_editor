<script setup lang="ts">
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '../src/components/ui/resizable'
import { globalStore, EditorInfo } from './core/store/sceneGraphMap'
import { ref } from 'vue';
import { onMounted, Ref, watch, onBeforeUnmount } from 'vue';
import { Engine, Scene, } from './core';
// import { MeshNode } from './core/node/MeshNode'
// import { ModelNode } from './core/node/ModelNode'
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
import { Input } from './core/input';
let encoder = new TextEncoder();
let data = encoder.encode("Hello World");

const testLoader = false
const eventManager = ref(null) as Ref<EventManager | null>

onMounted(async () => {

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