import * as THREE from 'three';

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
    lightPosition: { value: new THREE.Vector3(0, 10, 0) },
  },
  vertexShader,
  fragmentShader
}

const CustomNormalMaterial = new THREE.ShaderMaterial(normalShader);
export class CustomRenderer {
  private depthRenderTarget: THREE.WebGLRenderTarget;
  private normalRenderTarget: THREE.WebGLRenderTarget;
  private customNormalMaterial: THREE.Material;

  constructor(private renderer: THREE.WebGLRenderer, private scene: THREE.Scene, private camera: THREE.PerspectiveCamera, width: number, height: number, args: any) {
    this.renderer = renderer
    this.scene = scene
    this.camera = camera
    const depthTexture = new THREE.DepthTexture(
      window.innerWidth,
      window.innerHeight
    );

    const depthRenderTarget = new THREE.WebGLRenderTarget(
      window.innerWidth,
      window.innerHeight,
      {
        depthTexture,
        depthBuffer: true
      }
    );

    const normalRenderTarget = new THREE.WebGLRenderTarget(
      window.innerWidth,
      window.innerHeight
    );

    this.depthRenderTarget = args.depthRenderTarget
    this.normalRenderTarget = args.normalRenderTarget
    this.customNormalMaterial = CustomNormalMaterial // Customize as needed
  }

  render() {

    this.renderer.setRenderTarget(this.depthRenderTarget);
    this.renderer.render(this.scene, this.camera);

    const originalSceneMaterial = this.scene.overrideMaterial;

    this.renderer.setRenderTarget(this.normalRenderTarget);

    this.scene.matrixWorldNeedsUpdate = true;
    this.scene.overrideMaterial = CustomNormalMaterial;

    this.renderer.render(this.scene, this.camera);

    this.scene.overrideMaterial = originalSceneMaterial;

    this.renderer.setRenderTarget(null);
  }
}