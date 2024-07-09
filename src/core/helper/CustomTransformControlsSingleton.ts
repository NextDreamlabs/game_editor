import { CustomTransformControls } from './TransformControls';

class CustomTransformControlsSingleton {
  private static instance: CustomTransformControls;

  private constructor() { }

  public static getInstance(camera, renderer, cameraControls): CustomTransformControls {
    if (!CustomTransformControlsSingleton.instance) {
      CustomTransformControlsSingleton.instance = new CustomTransformControls(camera, renderer, cameraControls);
    }
    return CustomTransformControlsSingleton.instance;
  }
}

export { CustomTransformControlsSingleton };