import { PointLight, PointLightHelper, Color } from 'three';
import { BaseLightNode } from '../BaseLIghtNode';

interface IPointLightInfo {
  intensity: number
  distance: number
  decay: number,
  color: Color | string | number
}
class PointLightNode extends BaseLightNode {
  public lightInfo: IPointLightInfo
  constructor(name: string, color: Color | string | number, intensity: number, distance: number, decay: number) {
    const light = new PointLight(color, intensity);
    const helper = new PointLightHelper(light);
    super(name, light, helper);
    this.$type = 'PointLightNode'
    this.lightInfo = {
      color,
      intensity,
      distance,
      decay
    }
  }
}

export { PointLightNode };