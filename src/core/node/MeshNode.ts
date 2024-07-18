import { Node } from '../Node';
import { Mesh, BufferGeometry, TorusKnotGeometry, MeshStandardMaterial, MeshBasicMaterial, SphereGeometry, BoxGeometry, Material, Object3D, Color } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { Engine } from '../Engine';
import { ObservableProperty, applyObservableProperties } from '../decorators/ObservableProperty';
// import { AmmoPhysics } from 'three-stdlib';
import physics from '../physics';
import Ammo from 'ammo.js'
export class MeshNode extends Node {
  public material: Material;
  public geometry: BufferGeometry;
  public mesh: Mesh;

  constructor(name: string, geometry?: string, material?: Material, IsCopy?: Boolean, position?: any) {
    super(name, 0, 0); // 默认位置为 (0, 0)
    this.$type = 'MeshNode'
    if (!IsCopy) {
      this.material = material || new MeshStandardMaterial({ color: new Color(`#${Math.floor(Math.random() * 16777215).toString(16)}`) });
      this.geometry = geometry || new BoxGeometry(1, 1, 1);
      this.mesh = new Mesh(this.geometry, this.material);
      this.mesh.castShadow = true
      this.castShadow = true
      this.add(this.mesh);
    }

    // console.log(Engine.getInstance().physicsWorld, 'Engine.getInstance().physicsWorld')
    // Apply proxy to this instance
    // return applyObservableProperties(this);
    console.log(this.position, 'this');
  }

  // // 更新位置时同步更新刚体的位置
  // updatePosition(x: number, y: number, z: number) {
  //   this.position.set(x, y, z);
  //   const transform = new Ammo.btTransform();
  //   this.phybody.getMotionState().getWorldTransform(transform);
  //   transform.setOrigin(new Ammo.btVector3(x, y, z));
  //   this.phybody.getMotionState().setWorldTransform(transform);
  //   this.phybody.activate(); // 激活刚体，以确保它响应位置变化
  // }

  updateUI(property: string, value: any) {
    console.log(`Property ${property} updated to`, value);
  }

  setGeometry(type: 'box' | 'sphere' | 'custom', customGeometry?: BufferGeometry) {
    switch (type) {
      case 'box':
        this.geometry = new BoxGeometry(1, 1, 1);
        break;
      case 'sphere':
        this.geometry = new SphereGeometry(1, 32, 32);
        break;
      case 'custom':
        if (customGeometry) {
          this.geometry = customGeometry;
        } else {
          console.error('Custom geometry must be provided for type "custom".');
          return;
        }
        break;
      default:
        console.error('Invalid geometry type.');
        return;
    }
    this.mesh.geometry = this.geometry;
  }

  setMaterial(material: Material) {
    this.material = material;
    this.mesh.material = this.material;
  }

  resetToPrimitive(type: 'box' | 'sphere') {
    this.remove(this.mesh);
    this.setGeometry(type);
    this.mesh = new Mesh(this.geometry, this.material);
    this.add(this.mesh);
  }
}