
import { Scene as ThreeScene, PerspectiveCamera, WebGLRenderer, GridHelper } from 'three';
import { EventManager } from './Event';
import { Scene, Scene as _Scene } from './Scene';
import { MeshNode, ModelNode } from './index';
// import { Node } from './Node';
import * as THREE from 'three';

import { PostProcessingSetup } from './pass/MoebiusPass';
import { EffectComposerWrapper } from './pass/effectComposerWrapper';

import { PencilLinesPass } from './pass/PencilLinesPass/index'
import { MoebiusPass } from './pass/MoebiusPass/index'
import { PixelatePass } from './pass/pixelPass/pixelMaterial'
import { CustomRenderer } from './renderer/passRenderer'
import { RenderPixelatedPass } from 'three/addons/postprocessing/RenderPixelatedPass.js';


import AnimationPlayerManager from './manager/AnimationPlayerManager'
// 导入Ammo.js库
import Ammo from 'ammo.js';
import physics from './physics';

export class Engine {
  private static instance: Engine;
  private scenes: Scene[] = [];
  private running: boolean = false;
  public renderer: WebGLRenderer;
  private pass: any;
  public camera: PerspectiveCamera;
  private threeScene: ThreeScene;
  private container: HTMLElement;
  private gridHelper: GridHelper;
  private clock: THREE.Clock = new THREE.Clock();

  private renderStatus: 'start' | 'preview' = 'start';
  private postProcessing: PostProcessingSetup;
  // 添加用于物理世界的属性
  public Ammo: any
  public physicsWorld: any;
  public rigidBodies: any[] = []
  public constructor(container: HTMLElement) {

    // 初始化物理世界
    // this.initPhysicsWorld();

    this.renderer = new WebGLRenderer();
    this.renderer.setSize(container.clientWidth, container.clientHeight); // 设置渲染器大小
    this.renderer.shadowMap.enabled = true
    this.renderer.physicallyCorrectLights = true
    this.renderer.outputEncoding = THREE.sRGBEncoding
    this.renderer.toneMapping = THREE.CineonToneMapping
    this.renderer.toneMappingExposure = 1.75
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.camera = new PerspectiveCamera(65, container.clientWidth / container.clientHeight, 0.1, 200);
    this.threeScene = new ThreeScene();
    container.appendChild(this.renderer.domElement);
    this.camera.position.z = 5;
    this.camera.position.y = 10;
    this.threeScene.background = new THREE.Color('#1B43BA');
    window.addEventListener('resize', () => this.onWindowResize(container)); // 监听窗口大小变化
    this.container = container;

    this.initMeshWithReflectiveFloor()
    // Initialize PostProcessingSetup

    this.postProcessing = new PostProcessingSetup(this.renderer, this.threeScene, this.camera);

    const depthTexture = new THREE.DepthTexture(
      window.innerWidth,
      window.innerHeight
    )

    const depthRenderTarget = new THREE.WebGLRenderTarget(
      window.innerWidth,
      window.innerHeight,
      {
        depthTexture,
        depthBuffer: true,
      }
    )

    const normalRenderTarget = new THREE.WebGLRenderTarget()
    this.pass = new EffectComposerWrapper(this.renderer, this.threeScene, this.camera, MoebiusPass, {
      depthRenderTarget,
      normalRenderTarget,
    });
    this.customRenderer = new CustomRenderer(this.renderer, this.threeScene, this.camera, container.clientWidth, container.clientHeight, {
      depthRenderTarget,
      normalRenderTarget
    });
  }

  private async initPhysicsWorld() {
    // this.Ammo = physics
    const collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
    //-- dispatcher为碰撞检测算法分配器引用
    const dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);

    //-- 为碰撞粗测算法接口
    const broadphase = new Ammo.btDbvtBroadphase();

    //-- 配置约束解决器 - (序列脉冲约束解决器)
    //-- 使物体正确地交互，考虑重力、力、碰撞等
    const solver = new Ammo.btSequentialImpulseConstraintSolver();
    //-- 配置约束解决器 - (软体约束解决器)
    // const softBodySolver = new Ammo.btDefaultSoftBodySolver();

    //-- 创建一个支持软体、刚体的物理世界
    this.physicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, broadphase, solver, collisionConfiguration);
    // 设置重力
    this.physicsWorld.setGravity(new Ammo.btVector3(0, -9.8, 0));
  }

  // 添加方法来处理物理交互
  public applyForce(object: any, force: Ammo.btVector3) {
    // 在物理世界中对对象施加力
  }

  public handleCollisions() {
    // 处理物理世界中对象之间的碰撞
  }

  // 在渲染循环中更新物理模拟
  private updatePhysics(delta: number) {
    // 推进物理模拟
    this.physicsWorld.stepSimulation(delta, 10);
    this.rigidBodies.forEach((body: any) => {
      // 更新对象的变换
      const ms = body?.phybody.getMotionState();

      if (ms) {
        //-- 获取物理世界中的运动姿态
        ms.getWorldTransform(body.transformAux);
        const p = body.transformAux.getOrigin();
        const q = body.transformAux.getRotation();
        body.position.set(p.x(), p.y(), p.z());
        body.quaternion.set(q.x(), q.y(), q.z(), q.w());
        // console.log(p.x(), p.y(), p.z(), 'body')
      }
    })
  }

  initMeshWithReflectiveFloor() {
    // const floorGeometry = new THREE.PlaneGeometry(10, 10);
    // const floorMaterial = new THREE.MeshPhongMaterial({
    //   color: 0xFFFFFF, // White color
    //   specular: 0x050505,
    //   shininess: 100,
    //   reflectivity: 0.5,
    // });
    // const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    // floor.rotation.x = -Math.PI / 2; // Rotate to lie flat
    // floor.receiveShadow = true; // Enable receiving shadows
    // this.threeScene.add(floor);
  }
  private onWindowResize(container: HTMLElement) {
    //测试提交策略
    this.camera.aspect = container.clientWidth / container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(container.clientWidth, container.clientHeight);

    this.container = container
    // this.selectionSystem.container = this.container
  }
  public loadScene(scene: any) {
    // for (const [key, value] of scene.children) {
    //   console.log(key, value, 'key value');
    // }
    // const _scene = new _Scene('root2')

    // scene.children.forEach((node: any) => {
    //   console.log(node, 'node');

    //   switch (node.type) {
    //     case 'MeshNode':
    //       const meshNode = new MeshNode(node.name);
    //       meshNode.position.set(node.position.x, node.position.y, node.position.z);
    //       this.add_scene(meshNode);
    //       break;
    //     case 'ModelNode':
    //       const modelNode = new ModelNode(node.name);
    //       modelNode.loadModel(node?.modelPath);
    //       this.add_scene(modelNode);
    //       break;
    //     // case 'LightNode':
    //     //   const lightNode = new LightNode(node.name);
    //     //   lightNode.position.set(node.position.x, node.position.y, node.position.z);
    //     //   this.add_scene(lightNode);
    //     //   break;
    //     default:
    //       break;
    //   }
    // })
    // this.add_scene(_scene);
  }

  saveScene() {
    console.log(this.threeScene.children, 'this.threeScene.children')
    const data = {
      objects: this.threeScene.children.map(obj => obj.$type == 'Scene' && obj.toJSON())
    }
    return data
  }


  add_scene(scene: Scene) {

    this.scenes.push(scene);
    this.threeScene.add(scene); // Add the root node's Object3D to the three.js scene
    // this.customTransformControls.attach(scene); // Attach custom transform controls to the root node
    // EngineInfo.value.Scenes.push(scene)

    // EngineInfo.value.Scenes = this.threeScene
  }

  add_light(light: any) {
    this.threeScene.add(light);
    // this.threeScene.add(light.light);
  }
  get_scene() {
    return this.threeScene;
  }

  start() {
    this.renderStatus = 'start';
    this.running = true;
    this.loadScripts();
    this.loop();
  }
  preview() {
    this.renderStatus = 'preview'
    this.running = true;
    this.loop();
  }

  stop() {
    this.running = false;
  }

  private loadScripts() {
    console.log(this.scenes, 'this.scenes');
    for (const scene of this.scenes) {
      this.loadSceneScripts(scene);
    }
  }
  private clearThreeScene() {
    while (this.threeScene.children.length > 0) {
      const object = this.threeScene.children[0];
      this.threeScene.remove(object);

      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();
        if (object.material instanceof THREE.Material) {
          object.material.dispose();
        } else if (Array.isArray(object.material)) {
          object.material.forEach((material) => material.dispose());
        }
      }
    }
  }
  public checkSceneStatus(type: 'start' | 'preview') {
    this.renderStatus = type
  }
  private loadSceneScripts(scene: Scene) {
    const loadNodeScripts = (node: any) => {
      console.log(node, 'node');
      node.load_script(node.script);
      for (const child of node.node_children) {
        loadNodeScripts(child);
      }
    };

    for (const node of scene.node_children) {
      loadNodeScripts(node);
    }
  }

  private loop() {
    if (!this.running) return;
    const mixerUpdateDelta = this.clock.getDelta();
    for (const scene of this.scenes) {
      scene.update(mixerUpdateDelta, this.renderStatus === 'start');
    }


    AnimationPlayerManager.update(mixerUpdateDelta)
    this.customRenderer.render();
    // 使用 PostProcessingSetup 的 render 方法替代直接渲染
    this.pass.render();
    // this.renderer.render(this.threeScene, this.camera);
    // this.cameraControls.update(mixerUpdateDelta);
    this.updatePhysics(mixerUpdateDelta);
    requestAnimationFrame(() => this.loop());
  }


  // Add this method to register an event for resizing
  registerResizeEvent(eventManager: EventManager) {
    eventManager.on('resize', () => {
      this.onWindowResize(this.container);

    });
  }
  public static getInstance(container?: HTMLElement): Engine {
    if (!Engine.instance) {
      const ele = document.createElement('div')
      ele.style.width = '100vw'
      ele.style.height = '100vh'
      document.body.appendChild(ele)
      Engine.instance = new Engine(ele) as any;
      Engine.instance.initPhysicsWorld()
    }
    return Engine.instance;
  }

  // Add this method to get customTransformControls
  getCustomTransformControls(): CustomTransformControls {
    // return this.customTransformControls;
  }

  async init(scene: Scene, jsonFilePath: string) {
    try {
      const response = await fetch(jsonFilePath);
      const data = await response.json();

      data.objects.forEach((obj: any) => {
        let node: any;
        if (obj.type === 'MeshNode') {
          node = new MeshNode(obj.name);
        } else if (obj.type === 'ModelNode') {
          node = new ModelNode(obj.name);
          node.loadModel(obj.modelPath);
        } else {
          return;
        }
        node.copyFrom(obj); // Copy
        node.position.set(obj.position.x, obj.position.y, obj.position.z);
        scene.add_node(node);
      });

      this.add_scene(scene);
    } catch (error) {
    }
  }
}