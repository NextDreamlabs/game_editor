import { DirectionalLight, DirectionalLightHelper, Color } from 'three';
import { BaseLightNode } from '../BaseLIghtNode';

class DirectionalLightNode extends BaseLightNode {
  constructor(name: string, color: Color | string | number, intensity: number, size: number) {
    const light = new DirectionalLight(color, intensity);
    const helper = new DirectionalLightHelper(light, size);
    super(name, light, helper);
  }
}

export { DirectionalLightNode };