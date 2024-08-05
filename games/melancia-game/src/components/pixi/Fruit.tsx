import * as RAPIER from "@dimforge/rapier2d-compat"
import { Container, Sprite, useTick } from "@pixi/react"
import { PlayerId } from "dusk-games-sdk"
import { memo, useEffect, useRef } from "react"
import { Lifetime } from "timeline-composer"

import { FRUIT_IMAGES, FRUIT_IMAGE_OFFSETS, FRUIT_SCALES } from "@/constants"
import { playSound } from "@/playSound"
import { useGameStore } from "@/store/useGameStore"
import { FruitType, IContainer, ISprite } from "@/types"

import { Explosion } from "./Explosion"

const MERGE_SOUNDS = ["tap0", "tap1", "tap2", "tap3", "tap4"] as const

export const Fruit = memo(function Fruit({
  type,
  rigidBodyHandle,
  world,
  playerId,
  merged = false,
}: {
  type: FruitType
  rigidBodyHandle: number
  world: RAPIER.World
  playerId: PlayerId
  merged?: boolean
}) {
  const yourPlayerId = useGameStore((state) => state.yourPlayerId)
  const spriteRef = useRef<ISprite>(null)
  const containerRef = useRef<IContainer>(null)

  useEffect(() => {
    if (merged && playerId === yourPlayerId) {
      playSound(MERGE_SOUNDS[Math.floor(Math.random() * MERGE_SOUNDS.length)])
    }
  }, [merged, playerId, yourPlayerId])

  useTick(() => {
    if (!spriteRef.current || !containerRef.current) {
      return
    }

    try {
      const rigidBody = world.getRigidBody(rigidBodyHandle)
      if (!rigidBody) {
        return
      }
      const position = rigidBody.translation()
      const rotation = rigidBody.rotation()
      containerRef.current.position.set(position.x, position.y)
      spriteRef.current.rotation = rotation
      spriteRef.current.visible = true
    } catch (e) {
      console.error(e)
    }
  })

  return (
    <Container ref={containerRef}>
      <Sprite
        ref={spriteRef}
        image={FRUIT_IMAGES[type]}
        scale={FRUIT_SCALES[type]}
        anchor={0.5}
        visible={false}
        position={FRUIT_IMAGE_OFFSETS[type]}
      />
      {merged && (
        <Lifetime seconds={1}>
          <Explosion />
        </Lifetime>
      )}
    </Container>
  )
})
