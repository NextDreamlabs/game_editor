import { Object3D, Mesh, BufferGeometry, Material, Vector3, Euler } from 'three';
import { ObservableProperty, applyObservableProperties } from './decorators/ObservableProperty';
import { CustomTransformControlsSingleton } from './helper/CustomTransformControlsSingleton';
import { Engine } from './Engine';
import { EditorInfo } from './store/sceneGraphMap'

import { SelectionSystem } from './system/SelectionSystem'
import { globalStore, testDemo } from './store/sceneGraphMap';

import Ammo from 'ammo.js'
import { RigidBody } from './physics/RigidBody';

abstract class AbstractNode {
  // 子节点数组
  protected children: Node[] = [];
  // 父节点
  protected parent: Node | null = null;
  // 脚本对象
  protected script: any = null;
  // 信号字典
  protected signals: { [key: string]: Signal } = {};

  // 抽象方法：添加子节点
  // abstract add_child(child: Node): void;
  // 抽象方法：移除子节点
  abstract remove_child(child: Node): void;
  // 抽象方法：获取父节点
  abstract get_parent(): Node | null;
  // 抽象方法：加载脚本
  abstract load_script(script: any): void;
  // 抽象方法：更新节点
  abstract update(delta: number): void;
  // 抽象方法：添加信号
  abstract add_signal(name: string): void;
  // 抽象方法：连接信号
  abstract connect_signal(name: string, listener: Function): void;
  // 抽象方法：发射信号
  abstract emit_signal(name: string, ...args: any[]): void;
}

class Signal extends Object3D {
  // 监听器数组
  private listeners: Function[] = [];

  /**
   * 连接一个监听器函数到此信号
   * @param listener - 当信号发射时调用的函数
   */
  connect(listener: Function) {
    this.listeners.push(listener);
  }

  /**
   * 发射信号，调用所有连接的监听器函数并传递参数
   * @param args - 传递给监听器函数的参数
   */
  emit(...args: any[]) {
    for (const listener of this.listeners) {
      listener(...args);
    }
  }
}


export class Node extends Signal {
  public $type: string = 'Node'
  public $parent: Node;
  //@ts-ignore
  public $rigidBody: RigidBody;

  // 脚本对象
  public script: any = null;
  // 节点名称
  public name: string = '';
  // 节点的网格对象
  public mesh: Mesh = new Mesh();
  // 子节点数组
  public node_children: Node[] = [];
  // 父节点
  protected parent: Node | null = null;
  // 信号字典
  protected signals: { [key: string]: Signal } = {};

  public phybody: Ammo.btRigidBody; // 添加刚体属性
  public transformAux = new Ammo.btTransform();

  constructor(name: string, parent?: Node) {
    super();
    this.name = name;
    this.$parent = parent;
    console.log(this, 'this')
    SelectionSystem.selectStore.set(this!.uuid, this)

  }

  /**
   * 设置节点网格的几何体
   * @param geometry - 要设置的 BufferGeometry 对象
   */
  setGeometry(geometry: BufferGeometry) {
    this.mesh.geometry = geometry;
  }
  copyFrom(obj: any) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        (this as any)[key] = obj[key];
      }
    }
  }

  /**
   * 设置节点网格的材质
   * @param material - 要设置的 Material 对象
   */
  setMaterial(material: Material) {
    alert(1);
    // this.mesh.material = material;
  }

  /**
   * 添加一个子节点到此节点
   * @param child - 要添加的子节点
   */
  add_child(child: Node) {
    child.$parent = this
    this.add(child);
    this.node_children.push(child);

    console.log(child, 'childchildchildchild')
    globalStore.value.push(child)
    console.log(globalStore.value, 'globalStore.value')
    EditorInfo.value.isSave = true
    console.log(this, 'this');
  }

  /**
   * 从此节点移除一个子节点
   * @param child - 要移除的子节点
   */
  remove_child(child: Node) {
    this.remove(child); // 从父节点中移除 Object3D
    this.node_children.splice(this.node_children.indexOf(child), 1);
  }

  /**
   * 获取此节点的父节点
   * @returns 父节点或 null（如果没有父节点）
   */
  get_parent(): Node | null {
    return this.$parent;
  }

  /**
  * 加载一个脚本到此节点，并调用其 ready 函数（如果存在）
  * @param script - 要加载的脚本
  */
  load_script(script: any) {
    this.script = script;
    if (this.script && typeof this.script.ready === 'function') {
      this.script.ready(this);
    }
  }

  /**
   * 更新此节点及其子节点
   * @param delta - 更新的时间增量
   */
  update(delta: number, isStart: boolean) {
    if (this.script && typeof this.script.update === 'function' && isStart) {
      this.script.update(this);
    }
    for (const child of this.node_children) {
      // applyObservableProperties(this)
      child.update(delta, isStart);
    }
  }

  /**
   * 添加一个信号到此节点
   * @param name - 要添加的信号名称
   */
  add_signal(name: string) {
    this.signals[name] = new Signal();
  }

  /**
   * 连接一个监听器函数到信号
   * @param name - 信号的名称
   * @param listener - 要连接到信号的函数
   */
  connect_signal(name: string, listener: Function) {
    if (this.signals[name]) {
      this.signals[name].connect(listener);
    }
  }

  /**
   * 发射信号，调用所有连接的监听器函数并传递参数
   * @param name - 信号的名称
   * @param args - 传递给监听器函数的参数
   */
  emit_signal(name: string, ...args: any[]) {
    if (this.signals[name]) {
      this.signals[name].emit(...args);
    }
  }

  /**
   * 更新 UI 属性值
   * @param propertyKey - 要更新的属性键
   * @param newValue - 属性的新值
   */
  updateUI(propertyKey: string, newValue: any) {
    console.log(`Property ${propertyKey} updated to ${newValue}`);
    console.log(this.script, '123');
    // 在这里添加更新 UI 的逻辑
  }

  /**
   * 将此节点或指定节点附加到变换控件
   * @param node - 要附加的节点
   */
  attachToTransformControls(node?: Node) {
    const { camera, renderer, cameraControls } = Engine.getInstance();
    const customTransformControls = CustomTransformControlsSingleton.getInstance(camera, renderer, cameraControls);
    customTransformControls.attach(node ?? this);
  }

  /**
   * 卸载此节点及其资源
   */
  unload() {
    // 卸载子节点
    for (const child of this.node_children) {
      child.unload();
    }
    this.node_children = [];

    // 卸载几何体
    if (this.mesh.geometry) {
      this.mesh.geometry.dispose();
    }

    // 卸载材质
    if (this.mesh.material) {
      if (Array.isArray(this.mesh.material)) {
        this.mesh.material.forEach(material => material.dispose());
      } else {
        this.mesh.material.dispose();
      }
    }

    // 从父节点中移除
    if (this.parent) {
      this.parent.remove_child(this);
    }

    // 清理信号
    for (const signal in this.signals) {
      delete this.signals[signal];
    }

    // 清理脚本
    this.script = null;

    // 清理网格
    this.mesh = null;

    // 从选择系统中移除
    SelectionSystem.selectStore.delete(this.uuid);

    console.log(`Node ${this.name} unloaded`);
  }


  /**
   * 从 JSON 数据反序列化并重建节点
   * @param json - JSON 数据
   * @returns Node 实例
   */
  static fromJSON(json: any): Node {
    const loader = new ObjectLoader();
    const object = loader.parse(json);
    return object as Node;
  }
}