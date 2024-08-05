import { Container, Graphics, Sprite, useTick } from "@pixi/react"
import { useEffect, useRef } from "react"

import { CONTAINER_HEIGHT, CONTAINER_WIDTH, FRUIT_IMAGES } from "@/constants"
import { useGameStore } from "@/store/useGameStore"
import { IContainer, ISprite } from "@/types"

export function DropMarker() {
  const dropReady = useGameStore((state) => state.game.players[state.yourPlayerId ?? ""].dropReady)
  const containerRef = useRef<IContainer>(null)
  const spriteRef = useRef<ISprite>(null)
  const lastPosition = useRef(Infinity)

  useTick(() => {
    if (!containerRef.current || !spriteRef.current) {
      return
    }

    const position = useGameStore.getState().dropPosition
    if (position !== lastPosition.current) {
      containerRef.current.position.x = position
      lastPosition.current = position
    }

    const y = Math.sin(performance.now() * 0.0025) * 6
    spriteRef.current.position.y = y
  })

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.position.x = CONTAINER_WIDTH / 2
    }
  }, [])

  return (
    <Container ref={containerRef}>
      <Graphics
        draw={(g) => {
          g.clear()
          g.lineStyle(14, 0x000000, 0.15)
          g.moveTo(0, 0)
          g.lineTo(0, CONTAINER_HEIGHT)
        }}
      />
      <FruitPreview active={dropReady} />
      <Sprite ref={spriteRef} image="arrow_down" anchor={{ x: 0.5, y: 0 }} scale={0.1} visible={dropReady} />
    </Container>
  )
}

function FruitPreview({ active }: { active: boolean }) {
  const nextFruit = useGameStore((state) => state.nextFruit)

  return (
    <Sprite
      image={FRUIT_IMAGES[nextFruit]}
      scale={0.15}
      anchor={0.5}
      position={{ x: 0, y: -15 }}
      alpha={active ? 1 : 0.4}
    />
  )
}
