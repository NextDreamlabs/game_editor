import { Object3D } from 'three';
import { ref, Ref } from 'vue';
import mitt from 'mitt';

type Events = {
  'selectedObjectChanged': Object3D | null;
};

class SelectedObjectSingleton {
  private static instance: SelectedObjectSingleton;
  private selectedObject: Ref<Object3D | null> = ref(null);
  private emitter = mitt<Events>();

  private constructor() { }

  public static getInstance(): SelectedObjectSingleton {
    if (!SelectedObjectSingleton.instance) {
      SelectedObjectSingleton.instance = new SelectedObjectSingleton();
    }
    return SelectedObjectSingleton.instance;
  }

  public getSelectedObject(): Ref<Object3D | null> {
    return this.selectedObject;
  }

  public setSelectedObject(object: Object3D | null): void {
    this.selectedObject.value = object;
    this.emitter.emit('selectedObjectChanged', object);
  }

  public onSelectedObjectChanged(callback: (object: Object3D | null) => void): void {
    this.emitter.on('selectedObjectChanged', callback);
  }

  public offSelectedObjectChanged(callback: (object: Object3D | null) => void): void {
    this.emitter.off('selectedObjectChanged', callback);
  }
}

export { SelectedObjectSingleton };