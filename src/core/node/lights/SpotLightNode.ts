import { SpotLight, SpotLightHelper, Color } from 'three';
import { BaseLightNode } from '../BaseLIghtNode';

class SpotLightNode extends BaseLightNode {
  constructor(name: string, color: Color | string | number, intensity: number, distance: number, angle: number, penumbra: number, decay: number) {
    const light = new SpotLight(color, intensity, distance, angle, penumbra, decay);
    const helper = new SpotLightHelper(light);
    super(name, light, helper);
  }
}

export { SpotLightNode };