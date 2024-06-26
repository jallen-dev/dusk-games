import { Graphics, PixiRef } from "@pixi/react"

export type Vector = {
  x: number
  y: number
}

export type Bullet = {
  position: Vector
  velocity: Vector
}

export type Player = {
  position: Vector
  velocity: Vector
  hitCount: number
  color: "red" | "blue" | "green" | "yellow"
}

export type IGraphics = PixiRef<typeof Graphics>
