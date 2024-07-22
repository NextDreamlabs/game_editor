import Ammo from 'ammo.js'
export let physics: any = null
export async function InitPhysics() {
  // console.log(Ammo, 'Ammo')
  physics = await new Ammo()
}