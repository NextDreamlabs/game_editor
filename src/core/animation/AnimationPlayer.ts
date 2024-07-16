import * as THREE from 'three';
import AnimationPlayerManager from '../manager/AnimationPlayerManager';
import { Node } from '../Node';

class AnimationPlayer extends Node {
  private mixer: THREE.AnimationMixer;
  private animations: Map<string, THREE.AnimationClip>;
  private currentAction: THREE.AnimationAction | null = null;
  private queuedActions: string[] = [];
  private autoplay: string = '';
  private callbacks: { [key: number]: () => void } = {};

  constructor(object: THREE.Object3D) {
    super('AnimationPlayer')
    this.mixer = new THREE.AnimationMixer(object);
    this.animations = new Map();
    AnimationPlayerManager.addPlayer(this);

  }

  addAnimation(name: string, clip: THREE.AnimationClip) {
    this.animations.set(name, clip);
  }

  play(name: string = '', customBlend: number = 0.2, customSpeed: number = 1.0) {
    if (name === '' && this.autoplay !== '') {
      name = this.autoplay;
    }

    const clip = this.animations.get(name);
    if (clip) {
      const action = this.mixer.clipAction(clip);
      if (this.currentAction && this.currentAction !== action) {
        this.currentAction.crossFadeTo(action, customBlend);
      }
      action.setEffectiveTimeScale(customSpeed);
      action.play();
      this.currentAction = action;
    }
  }
  addCallbackAtFrame(animationName: string, frameNumber: number, fps: number, callback: () => void) {
    const clip = this.animations.get(animationName);
    if (clip) {
      const frameTime = frameNumber / fps;
      this.callbacks[frameTime] = callback;
    }
  }
  addCallbackAtTime(timeInSeconds: number, callback: () => void) {
    this.callbacks[timeInSeconds] = callback;
  }
  pause() {
    if (this.currentAction) {
      this.currentAction.paused = true;
    }
  }

  stop(keepState: boolean = false) {
    if (this.currentAction) {
      this.currentAction.stop();
      if (!keepState) {
        this.currentAction.reset();
      }
      this.currentAction = null;
    }
  }

  queue(name: string) {
    this.queuedActions.push(name);
  }

  update(delta: number) {
    this.mixer.update(delta);
    if (this.currentAction) {
      const time = this.currentAction.time;
      // Check for callbacks at the current time and execute them
      Object.keys(this.callbacks).forEach(key => {
        const callbackTime = parseFloat(key);
        if (time >= callbackTime && time < callbackTime + delta) {
          this.callbacks[key]();
        }
      });
    }
    if (this.currentAction && !this.currentAction.isRunning() && this.queuedActions.length > 0) {
      const nextAnimation = this.queuedActions.shift();
      if (nextAnimation) {
        this.play(nextAnimation);
      }
    }
  }

  setAutoplay(name: string) {
    this.autoplay = name;
  }

  getCurrentAnimationName(): string | undefined {
    return this.currentAction?.getClip().name;
  }
}

export default AnimationPlayer;