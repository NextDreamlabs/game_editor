import { WebGLRenderer, ShaderMaterial, Vector3, Scene, Camera, WebGLRenderTarget, DepthTexture } from 'three';
import * as THREE from "three";

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { PencilLinesPass } from '../pass/PencilLinesPass';
// import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
// import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';


const vertexShader = `
varying vec3 vNormal;
varying vec3 eyeVector;

void main() {
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vec4 mvPosition = viewMatrix * worldPos;

  gl_Position = projectionMatrix * mvPosition;

  vec3 transformedNormal = normalMatrix * normal;
  vNormal = normalize(transformedNormal);
  eyeVector = normalize(worldPos.xyz - cameraPosition);
}
`

const fragmentShader = `
varying vec3 vNormal;
varying vec3 eyeVector;
uniform vec3 lightPosition;

const float shininess = 600.0;
const float diffuseness = 0.5;

vec2 phong() {
  vec3 normal = normalize(vNormal);
  vec3 lightDirection = normalize(lightPosition);
  vec3 halfVector = normalize(eyeVector - lightDirection);

  float NdotL = dot(normal, lightDirection);
  float NdotH =  dot(normal, halfVector);
  float NdotH2 = NdotH * NdotH;

  float kDiffuse = max(0.0, NdotL) * diffuseness;
  float kSpecular = pow(NdotH2, shininess);

  return vec2(kSpecular, kDiffuse);
}

void main() {
  vec3 color = vec3(vNormal);
  vec2 phongLighting = phong();

  float specularLight = phongLighting.x;
  float diffuseLight = phongLighting.y;

  if(specularLight >= 0.25) {
    color = vec3(1.0, 1.0, 1.0);
  }

  gl_FragColor = vec4(color, diffuseLight);
}
`

const normalShader = {
  uniforms: {
    lightPosition: { value: new Vector3(10, 10, 10) },
  },
  vertexShader,
  fragmentShader
}

const CustomNormalMaterial = new ShaderMaterial(normalShader);

// export default CustomNormalMaterial;
export class EffectComposerWrapper {
  private composer: EffectComposer;

  constructor(renderer: WebGLRenderer, scene: Scene, camera: Camera, _class: any, args: any) {
    this.composer = new EffectComposer(renderer);

    const renderPass = new RenderPass(scene, camera);

    // const fxaaPass = new ShaderPass(FXAAShader);


    // this.composer.addPass(fxaaPass);
    const pencilLinePass = new _class({
      width: renderer.domElement.clientWidth,
      height: renderer.domElement.clientHeight,
      scene,
      camera,
      depthRenderTarget: args?.depthRenderTarget,
      normalRenderTarget: args?.normalRenderTarget,
    });
    this.composer.addPass(renderPass);
    this.composer.addPass(pencilLinePass);


  }

  render() {
    this.composer.render();
  }
}