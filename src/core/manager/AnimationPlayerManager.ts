import * as THREE from 'three';
import AnimationPlayer from '../animation/AnimationPlayer'; // 假设 AnimationPlayer 类已经按前面的描述实现并导出
import { Ref, ref } from 'vue';

class AnimationPlayerManager {
  private static animations: Ref<Map<string, THREE.AnimationClip>> = ref(new Map());

  static addPlayer(player: AnimationPlayer) {
    AnimationPlayerManager.animations.value.set(player?.uuid, player);
  }


  static update(delta: number) {
    AnimationPlayerManager.animations.value.forEach(player => player.update(delta));
  }
}

export default AnimationPlayerManager;