<template>
  <div class="flex flex-col p-6 ">

  </div>
</template>

<script setup lang="ts">


import { SelectedObjectSingleton } from '../../core/store/SelectedObjectSingletonSelectedObjectSingleton';

import { onMounted, watch, onUnmounted, ref } from 'vue';

import { Object3D } from 'three';

// const pane = new Pane()

// const PARAMS = {
//   speed: 0.5,
// };
// console.log(selectedObject, 'selectedObject')
// Object.keys(selectedObject).forEach((Item) => {
//   console.log(Item, 'Item')
// })
// pane.addBinding(PARAMS, 'speed');

const selectedObjectSingleton = SelectedObjectSingleton.getInstance();
const selectedObject = {}



const updateSelectedObject = (object: Object3D | null) => {
  console.log(object, 'object')
};

onMounted(() => {
  selectedObjectSingleton.onSelectedObjectChanged(updateSelectedObject);
});

onUnmounted(() => {
  selectedObjectSingleton.offSelectedObjectChanged(updateSelectedObject);
});




</script>

<style></style>