import { Raycaster, Vector2, Camera, Scene as ThreeScene, Object3D, EventDispatcher } from 'three';
import { Node } from '../Node'
import { MeshNode } from '../node/MeshNode';
import { Scene } from '../Scene';
export class SelectionSystem extends EventDispatcher {
  private raycaster: Raycaster;
  private mouse: Vector2;
  private camera: Camera;
  private scene: ThreeScene;
  public container: HTMLElement
  static selectStore: Map<string, Node> = new Map();

  constructor(camera: Camera, scene: ThreeScene, container: HTMLElement) {
    super();
    this.raycaster = new Raycaster();
    this.mouse = new Vector2();
    this.camera = camera;
    this.scene = scene;
    this.container = container

    window.addEventListener('click', this.onClick.bind(this));
  }

  public updateCamera(camera: Camera) {
    this.camera = camera
    this.raycaster.setFromCamera(this.mouse, this.camera); // 更新 raycaster
  }
  private onClick(event: MouseEvent) {
    const rect = this.container.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    console.log(this.camera.position, 'this.camera')

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const sceneNodes = this.scene.children.filter((item: any) => item instanceof Scene);
    const meshNodes = sceneNodes.flatMap((scene: ThreeScene) =>
      scene.children.filter((item: any) => {
        let parent = item.parent;
        while (parent) {
          if (parent instanceof Node) {
            return true;
          }
          parent = parent.parent;
        }
        return false;
      })
    );
    console.log(sceneNodes, 'sceneNodes')
    const intersects = this.raycaster.intersectObjects(meshNodes, true);
    console.log(intersects, 'intersects')

    if (intersects.length > 0) {
      // console.log(intersects)
      // console.log(SelectionSystem.selectStore)
      const selectedObject = intersects[0].object;
      console.log(selectedObject, 'selectedObject')
      if (selectedObject.parent instanceof MeshNode) {
        this.dispatchEvent({ type: 'select', object: selectedObject })
      }
    }
  }
}