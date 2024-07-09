import { Node } from '../Node';
import { Object3D, Light, Color } from 'three';

class BaseLightNode extends Node {
  public light: Light;
  public helper: Object3D;

  constructor(name: string, light: Light, helper: Object3D) {
    super(name);
    this.light = light;
    this.helper = helper;

    this.add(this.light);
    this.add(this.helper);

  }

  // 更新光源和 helper 的位置
  setPosition(x: number, y: number, z: number) {
    this.position.set(x, y, z);
    this.light.position.set(x, y, z);
    this.helper.position.set(x, y, z);
  }

  // 更新光源和 helper 的目标位置
  setTargetPosition(x: number, y: number, z: number) {
    if ('target' in this.light) {
      this.light.target.position.set(x, y, z);
      this.helper.position.set(x, y, z);
      this.light.target.updateMatrixWorld();
      this.helper.updateMatrixWorld();
    }
  }
}

export { BaseLightNode };