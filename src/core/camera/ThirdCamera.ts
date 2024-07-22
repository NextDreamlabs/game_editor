import {
  MathUtils,
  Vector2,
  Vector3,
  Vector4,
  Quaternion,
  Matrix4,
  Sphere,
  Box3,
  Spherical,
  Raycaster,

  Ray,
  Object3D,
} from 'three';
import * as THREE from 'three';
import CameraControls from 'ly-camera-controls';

import { Engine } from '../Engine';
// import { World } from 'core/World';

const subsetOfTHREE = {
  Vector2: Vector2,
  Vector3: Vector3,
  Vector4: Vector4,
  Quaternion: Quaternion,
  Matrix4: Matrix4,
  Spherical: Spherical,
  Box3: Box3,
  Sphere: Sphere,
  Raycaster: Raycaster,
};

CameraControls.install({ THREE: subsetOfTHREE });



export class ThirdCamera extends CameraControls {
  public minDistance: Object3D[];
  world: World;

  constructor(trackObject: THREE.Object3D) {

    super(Engine.getInstance().camera, Engine.getInstance().renderer.domElement);
    Engine.getInstance().setQue(this)
    this.minDistance = 1;
    this.maxDistance = 30;
    this.azimuthRotateSpeed = 0.3; // negative value to invert rotation direction
    this.polarRotateSpeed = - 0.2; // negative value to invert rotation direction
    this.minPolarAngle = 30 * MathUtils.DEG2RAD;
    this.maxPolarAngle = 120 * MathUtils.DEG2RAD;
    this.draggingSmoothTime = 1e-10;

    this.mouseButtons.right = CameraControls.ACTION.NONE;
    this.mouseButtons.middle = CameraControls.ACTION.NONE;
    this.touches.two = CameraControls.ACTION.TOUCH_DOLLY;
    this.touches.three = CameraControls.ACTION.TOUCH_DOLLY;


    this._trackObject = trackObject;
    // this.offset = new Vector3( 0, 1, 0 );
    const offset = new Vector3(0, 2, 0);

    this.update = (delta) => {

      const x = trackObject.position.x + offset.x;
      const y = trackObject.position.y + offset.y;
      const z = trackObject.position.z + offset.z;
      setTimeout(() => {
        this.moveTo(x, y, z, false);
      }, 400)
      return super.update(delta);

    };

  }

  get frontAngle() {

    return this.azimuthAngle;

  }


}