import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import { PerspectiveCamera, WebGLRenderer, Object3D } from 'three';
import CameraControls from 'ly-camera-controls';
import { SelectedObjectSingleton } from '../store/SelectedObjectSingletonSelectedObjectSingleton';

export class CustomTransformControls {
  private transformControls: TransformControls;
  private cameraControls: CameraControls;
  private attachedObject: Object3D | null = null;

  constructor(camera: PerspectiveCamera, renderer: WebGLRenderer, cameraControls: CameraControls) {
    this.transformControls = new TransformControls(camera, renderer.domElement);
    this.cameraControls = cameraControls;

    this.transformControls.addEventListener('mouseDown', () => this.onTransformStart());
    this.transformControls.addEventListener('mouseUp', () => this.onTransformEnd());
    this.transformControls.addEventListener('change', () => this.onTransformChange());
  }

  attach(object: Object3D) {
    this.attachedObject = object;
    this.transformControls.attach(object);
    SelectedObjectSingleton.getInstance().setSelectedObject(object);
  }

  detach() {
    this.attachedObject = null;
    this.transformControls.detach();
  }

  getControls() {
    return this.transformControls;
  }

  private onTransformStart() {
    this.cameraControls.enabled = false;
    // Register global event here
    console.log('Transform started');
  }

  private onTransformEnd() {

    this.cameraControls.enabled = true;
    // Unregister global event here
    this.detach()
    console.log('Transform ended');
  }

  private onTransformChange() {
    if (this.attachedObject) {
      // this.attachedObject.updateMatrixWorld(true);
      console.log('Updated position:', this.attachedObject.position);
    }
  }
}