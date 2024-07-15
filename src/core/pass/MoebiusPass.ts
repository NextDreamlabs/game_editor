import { PerspectiveCamera, WebGLRenderer, Scene } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

export class PostProcessingSetup {
  composer: EffectComposer;

  constructor(private renderer: WebGLRenderer, private scene: Scene, private camera: PerspectiveCamera) {
    this.initComposer();
  }


  private initComposer() {
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));

    const customShader = {
      uniforms: {
        tDiffuse: { value: null },
        amount: { value: 0.5 }
      },
      vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
      fragmentShader: `
                uniform float amount;
                uniform sampler2D tDiffuse;
                varying vec2 vUv;
                void main() {
                    vec4 color = texture2D(tDiffuse, vUv);
                    gl_FragColor = vec4(color.rgb * amount, color.a);
                }
            `
    };

    const customPass = new ShaderPass(customShader);
    this.composer.addPass(customPass);
  }

  public render(delta: number) {
    this.composer.render(delta);
  }
}