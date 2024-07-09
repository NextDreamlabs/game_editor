
import { Node } from "./Node";

export class Scene extends Node {
  private rootNode: Node;

  constructor(name: string) {
    super(name)
    this.$type = 'Scene'
  }

  add_node(node: Node) {
    this.add_child(node);
    // this.attachToTransformControls(node)
  }

  /**
  * 将此节点序列化为 JSON
  * @returns JSON 对象
  */
  toJSON() {
    const obj: any = {};

    //@ts-ignore
    obj.children = this.children.map((child: Node) => {
      const Item = {
        name: child.name,
        //@ts-ignore
        position: child.position,
        //@ts-ignore
        rotation: child.rotation,
        //@ts-ignore
        scale: child.scale,
        //@ts-ignore
        type: child.$type,
        //@ts-ignore
        modelPath: child?.modelPath
      }
      if (child.$type.includes('Mesh')) {
        console.log(`rgb(${parseInt(child?.material?.color?.r)},${parseInt(child?.material?.color?.g)},${parseInt(child?.material?.color?.b)})`, 'child')
        console.log(child, 'child')
        Item.material = {
          map: child?.mesh?.material.map,
          color: `rgb(${child?.material?.color?.r},${child?.material?.color?.g},${child?.material?.color?.b})`
        }
      }

      return Item
    });
    return obj
  }
  remove_node(node: Node) {
    this.remove_child(node);
  }

  // update(delta: number) {
  //   this.update(delta);
  // }

  // 可以添加更多的场景管理方法
}