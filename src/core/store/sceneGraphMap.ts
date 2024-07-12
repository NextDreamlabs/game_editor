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


type tranformModeType = 'translate' | 'rotate' | 'scale'

export const EngineInfo = ref({
  Scenes: [],
  tranformMode: 'translate' as tranformModeType
})

export const EngineFunctions = {
  setTranformMode: (mode: tranformModeType) => {
    EngineInfo.value.tranformMode = mode

  },
  resetTranformMode: () => {
    EngineInfo.value.tranformMode = 'translate'
  }
}