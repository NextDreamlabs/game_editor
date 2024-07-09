<template></template>

<script setup>
import { defineEmits, ref, watch } from 'vue';
// 定义 emit 事件
const emit = defineEmits(['update:object']);

// 使用自定义 hook
const { localObject, updateObject } = useEmitObject(emit);

</script>

<style></style>