import Ammo from 'ammo.js'
import { Node } from '../Node';
import { Engine } from '../Engine';
import * as THREE from 'three'
import { physics } from '../physics'
export class RigidBody extends Node {
  private position: { x: number, y: number, z: number };
  private rotation: { x: number, y: number, z: number };
  private mass: number;
  private type: 'static' | 'dynamic';
  private isCollidable: boolean;
  public transform_: any
  private body: Ammo.btRigidBody;

  constructor(object: Node, type: 'static' | 'dynamic' = 'dynamic') {
    super('RigidBody');
    this.position = { x: 0, y: 10, z: 0 };
    this.rotation = { x: 0, y: 0, z: 0 };
    this.mass = type === 'static' ? 0 : 1;
    this.type = type;
    this.$parent = object
    object.$rigidBody = this


  }

  setBody() {
    this.$parent.phybody = this.body_;
    Engine.getInstance().physicsWorld.addRigidBody(this.$parent.phybody);
    Engine.getInstance().rigidBodies.push(this.$parent);
  }
  setRestitution(val) {
    this.body_.setRestitution(val);
  }
  setAngularFactor(val) {
    this.body_.setAngularFactor(val);
  }
  setFriction(val) {
    this.body_.setFriction(val);
  }

  setRollingFriction(val) {
    this.body_.setRollingFriction(val);
  }

  createBox(mass: any, pos: any, quat: any, size: any) {
    this.transform_ = physics.btTransform();
    this.transform_.setIdentity();
    this.transform_.setOrigin(physics.btVector3(pos.x, pos.y, pos.z));
    this.transform_.setRotation(physics.btQuaternion(quat.x, quat.y, quat.z, quat.w));
    this.motionState_ = physics.btDefaultMotionState(this.transform_);

    const btSize = physics.btVector3(size.x * 0.5, size.y * 0.5, size.z * 0.5);
    this.shape_ = physics.btBoxShape(btSize);
    this.shape_.setMargin(0.05);

    this.inertia_ = physics.btVector3(0, 0, 0);
    if (mass > 0) {
      this.shape_.calculateLocalInertia(mass, this.inertia_);
    }

    this.info_ = physics.btRigidBodyConstructionInfo(
      mass, this.motionState_, this.shape_, this.inertia_);
    this.body_ = physics.btRigidBody(this.info_);

    Ammo.destroy(btSize);
  }

  setVelocity(velocity: THREE.Vector3) {
    const btVelocity = physics.btVector3(velocity.x, velocity.y, velocity.z);
    if (this.$parent.phybody) {
      this.$parent.phybody.setLinearVelocity(btVelocity);
    }
    // this.body.setLinearVelocity(btVelocity);
    Ammo.destroy(btVelocity);
  }
  addForce(velocity: THREE.Vector3) {
    const btVelocity = physics.btVector3(velocity.x, velocity.y, velocity.z);
    if (this.$parent.phybody) {
      this.$parent.phybody.applyCentralImpulse(btVelocity);
    }
    // this.body.setLinearVelocity(btVelocity);
    Ammo.destroy(btVelocity);
  }

  createSphere(mass: any, pos: any, size: any) {
    this.transform_ = physics.btTransform();
    this.transform_.setIdentity();
    this.transform_.setOrigin(physics.btVector3(pos.x, pos.y, pos.z));
    this.transform_.setRotation(physics.btQuaternion(0, 0, 0, 1));
    this.motionState_ = physics.btDefaultMotionState(this.transform_);

    this.shape_ = physics.btSphereShape(size);
    this.shape_.setMargin(0.05);

    this.inertia_ = physics.btVector3(0, 0, 0);
    if (mass > 0) {
      this.shape_.calculateLocalInertia(mass, this.inertia_);
    }

    this.info_ = physics.btRigidBodyConstructionInfo(mass, this.motionState_, this.shape_, this.inertia_);
    this.body_ = physics.btRigidBody(this.info_);
  }

  setPosition(x: number, y: number, z: number) {
    this.position = { x, y, z };
    const transform = physics.btTransform();
    this.body.getMotionState().getWorldTransform(transform);
    transform.setOrigin(physics.btVector3(x, y, z));
    this.body.getMotionState().setWorldTransform(transform);
    this.body.activate();
  }

  setRotation(x: number, y: number, z: number) {
    this.rotation = { x, y, z };
    const transform = physics.btTransform();
    this.body.getMotionState().getWorldTransform(transform);
    transform.setRotation(physics.btQuaternion(x, y, z));
    this.body.getMotionState().setWorldTransform(transform);
    this.body.activate();
  }

  setMass(newMass: number) {
    this.mass = newMass;
    const localInertia = physics.btVector3(0, 0, 0);
    this.body.getCollisionShape().calculateLocalInertia(newMass, localInertia);
    this.body.setMassProps(newMass, localInertia);
    this.body.updateInertiaTensor();
    this.body.activate();
  }

  // Other methods for collision properties, etc.
}