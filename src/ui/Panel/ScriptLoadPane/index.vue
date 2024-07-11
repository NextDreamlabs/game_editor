<template>
  <div>
    <div class="flex justify-center">
      <div class="flex items-center editor-ui-text editor-button p-2 m-2  text-white text-[11px]" @click="addScript()">
        <SquarePlus class="mr-2" :size="18" :stroke-width="1.75" /> Add Script
      </div>
      <div class="flex items-center editor-ui-text editor-button p-2 m-2 text-white text-[11px]" @click="loadScript()">
        <SquarePlus class="mr-2" :size="18" :stroke-width="1.75" /> Load Script
      </div>
    </div>
    <ul>
      <li v-for="(script, index) in scripts" :key="index">
        {{ script.name }}
        <button @click="removeScript(index)">Delete</button>
      </li>
    </ul>
    <input type="file" @change="handleFileSelect" style="display: none" ref="fileInput" />
  </div>
</template>

<script setup>
import { SquarePlus, SquareMinus, Box } from "lucide-vue-next";


</script>