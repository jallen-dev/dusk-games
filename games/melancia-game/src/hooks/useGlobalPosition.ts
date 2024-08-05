import { Sprite } from "@pixi/sprite"

export function useGlobalPosition(position: { x: number; y: number }) {
  const dummy = new Sprite()
  dummy.position.set(position.x, position.y)
  const global = dummy.toGlobal({ x: 0, y: 0 })
  return [global.x, global.y]
}
