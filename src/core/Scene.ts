
import { Node } from "./Node";

export class Scene extends Node {
  private rootNode: Node;

  constructor(name: string) {
    super(name)
  }

  add_node(node: Node) {
    this.add_child(node);
    // this.attachToTransformControls(node)
  }

  remove_node(node: Node) {
    this.remove_child(node);
  }

  // update(delta: number) {
  //   this.update(delta);
  // }

  // 可以添加更多的场景管理方法
}