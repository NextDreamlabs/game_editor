import { Pass } from "postprocessing";
import * as THREE from "three";
import { FullScreenQuad } from "three-stdlib";

import vertexShader from "./vertex";
import fragmentShader from "./fragment";

const moebiusShader = {
  uniforms: {
    tDiffuse: { value: null },
    tDepth: { value: null },
    tNormal: { value: null },
    cameraNear: { value: null },
    cameraFar: { value: null },
    resolution: {
      value: new THREE.Vector2()
    },
    shadowType: { value: 2.0 }
  },
  vertexShader,
  fragmentShader
};

export class MoebiusPass extends Pass {
  constructor(args) {
    super();

    this.material = new THREE.ShaderMaterial(moebiusShader);
    this.fsQuad = new FullScreenQuad(this.material);



    this.depthRenderTarget = args.depthRenderTarget;
    this.normalRenderTarget = args.normalRenderTarget;
    this.camera = args.camera;
    this.shadowType = '3.0';

    this.resolution = new THREE.Vector2(
      window.innerWidth * Math.min(window.devicePixelRatio, 1),
      window.innerHeight * Math.min(window.devicePixelRatio, 1)
    );
  }

  dispose() {
    this.material.dispose();
    this.fsQuad.dispose();
  }

  render(renderer, writeBuffer, readBuffer) {
    this.material.uniforms.tDiffuse.value = readBuffer.texture;
    this.material.uniforms.tDepth.value = this.depthRenderTarget.depthTexture;
    this.material.uniforms.tNormal.value = this.normalRenderTarget.texture;
    this.material.uniforms.cameraNear.value = this.camera.near;
    this.material.uniforms.cameraFar.value = this.camera.far;
    this.material.uniforms.shadowType.value = this.shadowType;

    this.material.uniforms.resolution.value = new THREE.Vector2(
      window.innerWidth * Math.min(window.devicePixelRatio, 2),
      window.innerHeight * Math.min(window.devicePixelRatio, 2)
    );

    if (this.renderToScreen) {
      renderer.setRenderTarget(null);
      this.fsQuad.render(renderer);
    } else {
      renderer.setRenderTarget(writeBuffer);
      if (this.clear) renderer.clear();
      this.fsQuad.render(renderer);
    }
  }
}

export default MoebiusPass;
