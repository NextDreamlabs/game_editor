import { reactive, ref } from 'vue';
export const globalStore = ref([])
export const testDemo = ref([])

export const EditorInfo = ref({
  selectedObject: null,
  selectedObjectId: null,
  selectedObjectType: null,
  selectedObjectParent: null,
  selectedObjectParentId: null,
  selectedObjectParentType: null,

  isSave: false,


})

export const EngineInfo = ref({
  Scenes: []
})
