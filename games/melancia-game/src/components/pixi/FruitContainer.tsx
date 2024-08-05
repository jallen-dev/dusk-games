import RAPIER from "@dimforge/rapier2d-compat"
import { LINE_JOIN } from "@pixi/graphics"
import { Graphics } from "@pixi/react"
import { PlayerId } from "dusk-games-sdk"
import { useEffect } from "react"

import { CONTAINER_HEIGHT, CONTAINER_WIDTH } from "@/constants"
import { useGameStore } from "@/store/useGameStore"

export function FruitContainer({ playerId }: { playerId: PlayerId }) {
  const world = useGameStore((state) => state.worlds[playerId])

  useEffect(() => {
    if (!world) {
      return
    }

    const wallsColliderDesc = RAPIER.ColliderDesc.polyline(
      new Float32Array([
        PADDING,
        -CONTAINER_HEIGHT,
        PADDING,
        CONTAINER_HEIGHT - PADDING,
        CONTAINER_WIDTH - PADDING,
        CONTAINER_HEIGHT - PADDING,
        CONTAINER_WIDTH - PADDING,
        -CONTAINER_HEIGHT,
        PADDING,
        -CONTAINER_HEIGHT,
      ]),
    )
    world.createCollider(wallsColliderDesc)
  }, [world])
  return (
    <Graphics
      position={{ x: 3, y: 0 }}
      draw={(g) => {
        g.clear()
        g.lineStyle({ width: 6, join: LINE_JOIN.ROUND, color: 0xdbb37c })
        g.moveTo(LEFT, TOP)
        g.lineTo(LEFT, BOTTOM)
        g.lineTo(RIGHT, BOTTOM)
        g.lineTo(RIGHT, TOP)
        g.lineTo(LEFT, TOP)
        g.lineTo(LEFT_BACK, TOP_BACK)
        g.lineTo(RIGHT_BACK, TOP_BACK)
        g.lineTo(RIGHT, TOP)
        g.lineStyle({ width: 3, join: LINE_JOIN.ROUND, color: 0xdbb37c })
        g.moveTo(LEFT_BACK, TOP_BACK)
        g.lineTo(LEFT_BACK, BOTTOM_BACK)
        g.lineTo(RIGHT_BACK, BOTTOM_BACK)
        g.lineTo(RIGHT_BACK, TOP_BACK)
        g.moveTo(LEFT_BACK, BOTTOM_BACK)
        g.lineTo(LEFT, BOTTOM)
        g.moveTo(RIGHT_BACK, BOTTOM_BACK)
        g.lineTo(RIGHT, BOTTOM)
      }}
    />
  )
}

const PADDING = 5
const LEFT = 0
const RIGHT = CONTAINER_WIDTH
const TOP = 0
const BOTTOM = CONTAINER_HEIGHT
const LEFT_BACK = 20
const RIGHT_BACK = CONTAINER_WIDTH - 20
const TOP_BACK = -20
const BOTTOM_BACK = CONTAINER_HEIGHT - 20
