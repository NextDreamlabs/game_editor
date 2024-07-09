<template>
  <n-tree block-line checkable draggable :data="data" :checked-keys="checkedKeys" :expanded-keys="expandedKeys"
    @drop="handleDrop" @update:checked-keys="handleCheckedKeysChange" @update:expanded-keys="handleExpandedKeysChange" />
</template>

<script lang="ts" setup>
</script>