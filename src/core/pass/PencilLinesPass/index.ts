import { Pass, FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass'
import { PencilLinesMaterial } from './PencilLinesMaterial'
import * as THREE from 'three'

export class PencilLinesPass extends Pass {
  fsQuad: FullScreenQuad
  material: PencilLinesMaterial
  normalBuffer: THREE.WebGLRenderTarget
  normalMaterial: THREE.MeshNormalMaterial

  scene: THREE.Scene
  camera: THREE.Camera

  constructor({
    width,
    height,
    scene,
    camera
  }: {
    width: number
    height: number
    scene: THREE.Scene
    camera: THREE.Camera
  }) {
    super()

    this.scene = scene
    this.camera = camera

    this.material = new PencilLinesMaterial()
    this.fsQuad = new FullScreenQuad(this.material)

    const normalBuffer = new THREE.WebGLRenderTarget(width, height)

    normalBuffer.texture.format = THREE.RGBAFormat
    normalBuffer.texture.type = THREE.HalfFloatType
    normalBuffer.texture.minFilter = THREE.NearestFilter
    normalBuffer.texture.magFilter = THREE.NearestFilter
    normalBuffer.texture.generateMipmaps = false
    normalBuffer.stencilBuffer = false
    this.normalBuffer = normalBuffer

    this.normalMaterial = new THREE.MeshNormalMaterial()

    this.material.uniforms.uResolution.value = new THREE.Vector2(width, height)

    const loader = new THREE.TextureLoader()
    loader.load('./cloud-noise.png', (texture) => {
      this.material.uniforms.uTexture.value = texture
    })
  }

  dispose() {
    this.material.dispose()
    this.fsQuad.dispose()
  }

  render(
    renderer: THREE.WebGLRenderer,
    writeBuffer: THREE.WebGLRenderTarget,
    readBuffer: THREE.WebGLRenderTarget
  ) {
    renderer.setRenderTarget(this.normalBuffer)
    const overrideMaterialValue = this.scene.overrideMaterial

    this.scene.overrideMaterial = this.normalMaterial
    renderer.render(this.scene, this.camera)
    this.scene.overrideMaterial = overrideMaterialValue

    this.material.uniforms.uNormals.value = this.normalBuffer.texture
    this.material.uniforms.tDiffuse.value = readBuffer.texture

    if (this.renderToScreen) {
      renderer.setRenderTarget(null)
      this.fsQuad.render(renderer)
    } else {
      renderer.setRenderTarget(writeBuffer)
      if (this.clear) renderer.clear()
      this.fsQuad.render(renderer)
    }
  }
}
