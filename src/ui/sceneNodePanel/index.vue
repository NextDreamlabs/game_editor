<template>
  <div class=" bg-[#121416] h-full">
    <TreeNode :nodes="treeData" />
  </div>
</template>

<script setup lang="ts">
import TreeNode from './TreeNode.vue';

const treeData = [
  {
    id: '1',
    label: 'Node 1',
    children: [
      {
        id: '1-1',
        label: 'Node 1-1',
        children: [
          { id: '1-1-1', label: 'Node 1-1-1' },
          { id: '1-1-2', label: 'Node 1-1-2' },
        ],
      },
      { id: '1-2', label: 'Node 1-2' },
    ],
  },
  {
    id: '2',
    label: 'Node 2',
    children: [
      { id: '2-1', label: 'Node 2-1' },
      { id: '2-2', label: 'Node 2-2' },
    ],
  },
];
</script>