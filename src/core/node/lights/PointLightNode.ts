import { PointLight, PointLightHelper, Color } from 'three';
import { BaseLightNode } from '../BaseLIghtNode';

class PointLightNode extends BaseLightNode {
  constructor(name: string, color: Color | string | number, intensity: number, distance: number, decay: number) {
    const light = new PointLight(color, intensity);
    const helper = new PointLightHelper(light);
    super(name, light, helper);
  }
}

export { PointLightNode };