<template>
  <div class="flex justify-start pr-3 bg-[#29292e] text-[11px]">
    <div :class="active == index ? 'editor-button text-[#ffffff]' : 'bg-white text-[#333333]'" :key="index"
      v-for="(Item, index ) in EngineInfo.Scenes" class="px-3 py-2 mr-2 ">
      {{ Item.name }} <span class="text-[#999999] font-sm"> * 未保存</span>
    </div>
  </div>
  <div class="flex items-center justify-start bg-[#29292e]">
    <div class="flex items-center justify-start ">
      <div class="editor-button mx-2 my-3 p-1" :class="{ 'editor-active': EngineInfo.tranformMode == 'rotate' }">
        <Rotate3D @click="EngineFunctions.setTranformMode('rotate')" :size="16" :stroke-width="1.75" color="#ffffff" />
      </div>
      <div class="editor-button mx-2 p-1" :class="{ 'editor-active': EngineInfo.tranformMode == 'translate' }">
        <Move3D @click="EngineFunctions.setTranformMode('translate')" :size="16" :stroke-width="1.75" color="#ffffff" />
      </div>
      <div class="editor-button mx-2 p-1" :class="{ 'editor-active': EngineInfo.tranformMode == 'scale' }">
        <Scale3D @click="EngineFunctions.setTranformMode('scale')" :size="16" :stroke-width="1.75" color="#ffffff" />
      </div>
    </div>
    <div class="editor-button mx-2 p-1">
      <Gamepad :size="16" :stroke-width="1.75" color="#ffffff" />
    </div>
    <div class="editor-button mx-2 p-1">
      <Pause :size="16" :stroke-width="1.75" color="#ffffff" />
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Move3D, Scale3D, Rotate3D, Box, Gamepad, Pause } from "lucide-vue-next";

import { EngineInfo, EngineFunctions } from '../../core/store/sceneGraphMap'

console.log(EngineInfo.value.Scenes, 'EngineInfo.value.Scenes')
const _scene = computed(() => {

  return EngineInfo.value.Scenes
})
const active = ref(0)

</script>