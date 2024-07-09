import { ref, watch } from 'vue';

export function useEmitObject(emit) {
  const localObject = ref({});

  watch(localObject, (newValue) => {
    emit('update:object', newValue);
  });

  function updateObject(event) {
    localObject.value = event.target.value;
  }

  return {
    localObject,
    updateObject,
  };
}