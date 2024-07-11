<template>
  <ul class="text-slate-300">
    <li v-for="node in treeNodes" class="text-[11px]" :key="node.id">
      <div @click="toggleNode(node)" class="flex items-center px-2 py-1" :style="{ marginLeft: `${level * 20}px` }">
        <span class="cursor-pointer" v-if="node.children && node.children.length">
          <!-- {{ node.expanded ? '[-]' : '[+]' }} -->
          <SquarePlus v-show="!node.expanded" :size="18" :stroke-width="1.75" />
          <SquareMinus v-show="node.expanded" :size="18" :stroke-width="1.75" />
          <!-- <SquarePlus :size="28" :stroke-width="1.75" /> -->
        </span>
        <div class="ml-2 flex items-center">
          <Box class="mr-2" :size="18" :stroke-width="1.75" /> {{ node.label }}
        </div>
      </div>
      <TreeNode v-if="node.expanded" :nodes="node.children" :level="level + 1" />
    </li>
  </ul>
</template>

<script setup lang="ts">
import { defineProps, withDefaults, ref, watch } from 'vue';
import { SquarePlus, SquareMinus, Box } from "lucide-vue-next";
interface TreeNode {
  id: string;
  label: string;
  expanded?: boolean;
  children?: TreeNode[];
}

const props = withDefaults(defineProps<{
  nodes?: TreeNode[];
  level?: number; // 新增 level 属性
}>(), {
  nodes: () => [],
  level: 0, // 默认 level 为 0
});

const treeNodes = ref(props.nodes);

watch(() => props.nodes, (newValue) => {
  treeNodes.value = newValue;
});

function toggleNode(node: TreeNode) {
  node.expanded = !node.expanded;
}
</script>