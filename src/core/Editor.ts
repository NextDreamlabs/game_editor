import CameraControls from 'ly-camera-controls';
import * as THREE from 'three';
import TweakpaneManager from './manager/TweakpaneManager';
import { CustomTransformControls } from './helper/TransformControls';
import { SelectionSystem } from './system/SelectionSystem';
import { CustomTransformControlsSingleton } from './helper/CustomTransformControlsSingleton';
import { EngineInfo } from '../core/store/sceneGraphMap'
import { watch } from 'vue';


export class Editor {
  private tweakpaneManager: TweakpaneManager;
  public cameraControls: CameraControls;
  public customTransformControls: CustomTransformControls;
  private selectionSystem: SelectionSystem;
  public gridHelper: any;
  public camera: any;
  public renderer: any
  public threeScene: THREE.Scene;
  public container: any
  constructor(camera: THREE.Camera, renderer: any, threeScene: any, container) {
    this.camera = camera;
    this.renderer = renderer;
    this.threeScene = threeScene;
    this.container = container
    // Add grid helper
    this.gridHelper = new THREE.GridHelper(1000, 1000);
    // this.threeScene.add(this.gridHelper);

    CameraControls.install({ THREE: THREE });
    this.cameraControls = new CameraControls(this.camera, this.renderer.domElement);
    // this.cameraControls.mouseButtons.left = CameraControls.ACTION.OFFSET;
    // this.cameraControls.mouseButtons.right = CameraControls.ACTION.ROTATE;
    this.camera.position.set(0, 10, 10);
    this.tweakpaneManager = new TweakpaneManager();

    this.customTransformControls = CustomTransformControlsSingleton.getInstance(this.camera, this.renderer, this.cameraControls);
    this.threeScene.add(this.customTransformControls.getControls());
    // Initialize SelectionSystem
    this.selectionSystem = new SelectionSystem(this.camera, this.threeScene);
    this.selectionSystem.addEventListener('select', (event) => {
      this.customTransformControls.attach(event.object.parent);

      // this.cameraControls.setOrbitPoint(event.object.parent.position.x, event.object.parent.position.y, event.object.parent.position.z)
      this.tweakpaneManager.addInput(event.object.parent); // Add this line
    });
    this.cameraControls.addEventListener('update', () => {
      this.selectionSystem.updateCamera(this.camera)
    })
    this.selectionSystem.container = this.container

    watch(EngineInfo.value, () => {
      this.customTransformControls.setMode(EngineInfo.value.tranformMode)
    })
  }
}