import { Node } from './index';

export class RigidBodyNode extends Node {
  constructor(name: string) {
    super(name);
  }

  public convertToPhysicsNode() {
    // 将父节点转换为物理节点的逻辑
    // 例如，将父节点添加到物理世界中
    // 或者将父节点的属性设置为物理属性
    console.log(`Converting parent node to physics node: ${this.parent.name}`);
  }
}