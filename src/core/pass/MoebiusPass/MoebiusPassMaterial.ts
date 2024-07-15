import * as THREE from 'three'
import fragmentShader from './fragment'
import vertexShader from './vertex'

export class MoebiusPassMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        tDiffuse: { value: null },
        tDepth: { value: null },
        tNormal: { value: null },
        cameraNear: { value: null },
        cameraFar: { value: null },
        resolution: {
          value: new THREE.Vector2(),
        },
        shadowType: { value: 2.0 },
      },
      fragmentShader,
      vertexShader
    })
  }
}
