import * as THREE from 'three'
import fragmentShader from './fragment'
import vertexShader from './vertex'

export class PencilLinesMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        tDiffuse: { value: null },
        uNormals: { value: null },
        uTexture: { value: null },
        uResolution: {
          value: new THREE.Vector2(1, 1)
        }
      },
      fragmentShader,
      vertexShader
    })
  }
}
