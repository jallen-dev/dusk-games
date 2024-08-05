import RAPIER from "@dimforge/rapier2d-compat"
import { AnimatedSprite, Container, Graphics, PixiRef, Sprite, TilingSprite } from "@pixi/react"

export type IContainer = PixiRef<typeof Container>
export type IGraphics = PixiRef<typeof Graphics>
export type ISprite = PixiRef<typeof Sprite>
export type IAnimatedSprite = PixiRef<typeof AnimatedSprite>
export type ITilingSprite = PixiRef<typeof TilingSprite>

export type Vector = {
  x: number
  y: number
}

export type FruitData = {
  type: FruitType
  position: Vector
  rotation: number
  linvel: Vector
  angvel: number
}

export type Player = {
  active: boolean
  fruits: Array<FruitData>
  ready: boolean
  points: number
  timeLastDropped: number
  dropReady: boolean
}

export type GameScreen = "lobby" | "play" | "gameOver"

export type Fruit = {
  type: FruitType
  rigidBody: RAPIER.RigidBody
  merged?: boolean
}

export enum FruitType {
  Cherry,
  Strawberry,
  Grapes,
  Lemon,
  Orange,
  Apple,
  Pear,
  Banana,
  Pineapple,
  Watermelon,
}
