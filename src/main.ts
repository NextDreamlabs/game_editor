// import { createApp } from 'vue'
// import './assets/index.css'
// import App from './App.vue'

// createApp(App).mount('#app')
import { Engine, Scene, } from './core';
import { MeshNode } from './core/node/MeshNode'
import { ModelNode } from './core/node/ModelNode'
import { AmbientLight, Color, DirectionalLight, Vector3, SphereGeometry, PlaneGeometry, PointLight, PointLightHelper, Object3D, TorusKnotGeometry } from 'three';
import { DirectionalLightNode, PointLightNode, SpotLightNode } from './core/node/lights';
import { RigidBody } from './core/physics/RigidBody';
import { Input } from './core/input';
import AnimationPlayer from './core/animation/AnimationPlayer';

class setup {
  async init() {
    let __engine__: any = null
    let __scene__: any = null
    // const editorPanel = document.getElementById('Editor_Panel');
    // console.log(editorPanel?.clientWidth, 'editorPanel')
    __engine__ = Engine.getInstance();
    // __engine__.loadScene(secneJson)
    // const _scene = new Scene('root2')

    // console.log(secneJson, 'secneJson')
    __scene__ = new Scene('root')
    const tg = new TorusKnotGeometry(1, 0.3, 200, 32)
    const sp = new SphereGeometry(1, 32, 32)
    const __node__ = new MeshNode('mesh', tg)
    const rbBox = new RigidBody(__node__);
    rbBox.createSphere(Math.random() + 10, new Vector3(0, 10, 0), 1);
    rbBox.setRestitution(0.5);
    rbBox.setFriction(1);
    rbBox.setRollingFriction(1);
    rbBox.setBody()
    __node__.add_child(rbBox)

    //地板
    const floorGeometry = new PlaneGeometry(10, 10);
    const __node__2 = new MeshNode('mesh2', floorGeometry)
    __node__2.mesh.rotation.x = -Math.PI / 2; // Rotate to lie flat
    // __node__2.mesh.position.y = -10

    const nr = new RigidBody(__node__2, 'static')
    nr.createBox(0, __node__2.position, __node__2.quaternion, new Vector3(100, 0, 100));
    nr.setRestitution(0.99);
    nr.setBody()
    __node__2.add_child(nr)
    __scene__.add_node(__node__2);
    const spawn_ = () => {
      const n = new MeshNode(new Date().getTime().toString(), undefined, null, false, {
        x: Math.random() * 2 - 1, y: 200.0, z: Math.random() * 2 - 1
      })
      const rb = new RigidBody(n);
      rb.createBox(1, new Vector3(Math.random() * 2 - 1, 50, Math.random() * 2 - 1), n.quaternion, new Vector3(1, 1, 1));
      rb.setRestitution(0.125);
      rb.setFriction(1);
      rb.setRollingFriction(5);
      rb.setAngularFactor(new Vector3(0, 0, 0)); // Prevent rotation
      rb.setBody()
      n.add_child(rb)
      __scene__.add_child(n)
    }

    const __node__1 = new MeshNode('mesh1', sp)
    // __node__1.add_child(new RigidBody(__node__1, 'dynamic'))
    const model = new ModelNode('player')
    await model.loadModel("/src/assets/Xbot.glb")
    model.add_child(new AnimationPlayer(model))
    const rb = new RigidBody(model);
    rb.createBox(10, new Vector3(Math.random() * 2 - 1, 3, Math.random() * 2 - 1), model.quaternion, new Vector3(0.5, 0.5, 0.5));
    rb.setRestitution(0.125);
    rb.setFriction(1);
    rb.setRollingFriction(5);
    rb.setBody()
    model.add_child(rb)
    let index = 0
    // model.script = {

    //   update: (_this: any) => {
    //     index++
    //     if (index < 10) {
    //       // spawn_()
    //     }
    //     // console.log('update', Input.isKeyDown('w'))
    //     if (Input.isKeyDown('w')) {
    //       _this.$rigidBody.setVelocity(new Vector3(0, 0, 1))
    //       _this.AnimationPlay.play('run')
    //     } else if (Input.isKeyDown('s')) {
    //       _this.$rigidBody.setVelocity(new Vector3(0, 0, -1))
    //       _this.AnimationPlay.play('run')
    //     } else if (Input.isKeyDown('a')) {
    //       _this.$rigidBody.setVelocity(new Vector3(1, 0, 0))
    //       _this.AnimationPlay.play('run')
    //     } else if (Input.isKeyDown('d')) {
    //       _this.$rigidBody.setVelocity(new Vector3(-1, 0, 0))
    //       _this.AnimationPlay.play('run')
    //     } else if (Input.isKeyDown('c')) {
    //       _this.$rigidBody.addForce(new Vector3(0, 10, 0))
    //       _this.AnimationPlay.play('run')
    //     } else {
    //       _this.AnimationPlay.play('idle')
    //     }

    //     // rb.setAngularFactor(new Vector3(0, 0, 0));
    //     // _this.$rigidBody.setVelocity(
    //     //   new Vector3(
    //     //     0,
    //     //     0,
    //     const radius = 1;
    //     const speed = 0.01;
    //     // rb.setAngularFactor(new Vector3(0, 0, 0));
    //     // _this.$rigidBody.setVelocity(
    //     //   new Vector3(
    //     //     0,
    //     //     0,
    //     //     1));// Set velocity to zero
    //   },
    //   ready: (_this: any) => {
    //     Input.listenForKeys()
    //     // _this.AnimationPlay.play('idle')

    //     _this.AnimationPlay?.addCallbackAtFrame('walk', 30, 60, () => {

    //       // _this.$rigidBody.applyCentralImpulse(new Vector3(0, 10, 0))

    //     })
    //     // console.log(_this, 'this')
    //   }
    // }

    __node__1.position.x = 3
    __node__1.position.y = 1
    __node__1.position.z = 1
    // model.position.y = 1
    model.position.z = -5

    __node__1.rotation.y = Math.PI / 4
    __node__.position.y = 3
    __node__.position.z = 3
    __node__.script = 1
    __node__.toJSON()
    console.log(__node__, 'Node')
    console.log(__node__1, '__node__1')
    console.log(__node__, '__node__')
    __scene__.add_node(__node__)
    __scene__.add_node(__node__1)
    __scene__.add_node(model)
    __engine__.add_scene(__scene__)
    const Al = new AmbientLight(new Color('#ffffff'));
    Al.intensity = 1.2
    __engine__.add_light(Al);
    const directionalLight = new DirectionalLight(new Color('#ffffff'));
    directionalLight.position.set(10, 10, 10);
    directionalLight.intensity = 3.5
    directionalLight.target = __node__; // Targeting __node__
    directionalLight.castShadow = true; // Enable casting shadows
    __engine__.add_light(directionalLight);
    __engine__.start()
  }
}

new setup().init()