import { Container, useApp } from "@pixi/react"
import { useRef } from "react"

import { Clock } from "@/components/dom/Clock"
import { Background } from "@/components/pixi/Background"
import { FruitContainer } from "@/components/pixi/FruitContainer"
import { Fruits } from "@/components/pixi/Fruits"
import { Physics } from "@/components/pixi/Physics"
import { Html } from "@/helpers/Html"
import { Pixi } from "@/helpers/Pixi"
import { useGlobalPosition } from "@/hooks/useGlobalPosition"
import { useGameStore } from "@/store/useGameStore"
import { IContainer } from "@/types"

export function Spectate() {
  const activePlayerIds = useGameStore((state) => state.game.activePlayerIds)
  return (
    <div>
      <div className="fixed left-2 top-2 w-fit rounded-lg bg-slate-800 px-2">
        <Clock />
      </div>
      <Pixi.In>
        <Background />
        {activePlayerIds.length > 2 ? <TwoWide /> : <OneWide />}
        <Physics />
      </Pixi.In>
    </div>
  )
}

function OneWide() {
  const activePlayerIds = useGameStore((state) => state.game.activePlayerIds)

  const app = useApp()
  const width = app.screen.width
  const height = app.screen.height
  console.log({ height })
  const xScale = (width - 80) / 186
  const yScale = (height - 200 * activePlayerIds.length) / (186 * activePlayerIds.length)
  const scale = Math.min(xScale, yScale)
  console.log({ xScale })
  console.log({ yScale })

  const xSpace = width - 186 * scale
  console.log({ xSpace })
  const ySpace = height - 186 * scale * (activePlayerIds.length > 1 ? 2 : 1)
  console.log({ ySpace })

  const ySpaceDiv = ySpace / activePlayerIds.length
  const yOffset = 186 * scale + ySpace / activePlayerIds.length
  return (
    <>
      {activePlayerIds.map((playerId, index) => (
        <Player
          key={playerId}
          playerId={playerId}
          scale={scale}
          position={{ x: xSpace / 2, y: 40 + ySpaceDiv / 2 + index * yOffset }}
        />
      ))}
    </>
  )
}

function TwoWide() {
  const activePlayerIds = useGameStore((state) => state.game.activePlayerIds)

  const app = useApp()
  const width = app.screen.width
  const height = app.screen.height
  console.log({ height })
  const xScale = (width - 80) / (186 * 2)
  const yScale = (height - 200 * 2) / (186 * 2)
  const scale = Math.min(xScale, yScale)
  console.log({ xScale })
  console.log({ yScale })

  const xSpace = width - 186 * scale * 2
  console.log({ xSpace })
  const ySpace = height - 186 * scale * 2
  console.log({ ySpace })

  const ySpaceDiv = ySpace / 2
  const yOffset = 186 * scale + ySpace / 2
  const xOffset = 186 * scale + xSpace / 3
  return (
    <>
      {activePlayerIds.map((playerId, index) => (
        <Player
          key={playerId}
          playerId={playerId}
          scale={scale}
          position={{ x: xSpace / 3 + (index > 1 ? xOffset : 0), y: 40 + ySpaceDiv / 2 + (index % 2) * yOffset }}
        />
      ))}
    </>
  )
}

function Player({
  playerId,
  position,
  ...rest
}: {
  playerId: string
  scale: number
  position: { x: number; y: number }
}) {
  const details = useGameStore((state) => state.playerDetails[playerId])
  const containerRef = useRef<IContainer>(null)
  const htmlRef = useRef<HTMLDivElement>(null)

  const [x, y] = useGlobalPosition(position)
  const transform = `translate(${x}px, ${y}px)`

  return (
    <Container ref={containerRef} position={position} {...rest}>
      <FruitContainer playerId={playerId} />
      <Fruits playerId={playerId} />
      <Html.In>
        <div ref={htmlRef} className="fixed -top-28" style={{ transform }}>
          <div className="flex w-20 items-center">
            <img src={details.avatarUrl} alt={details.displayName} />
            <div className="flex flex-col text-center">
              <span className="w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-black">
                {details.displayName}
              </span>
              <Points playerId={playerId} />
            </div>
          </div>
        </div>
      </Html.In>
    </Container>
  )
}

function Points({ playerId }: { playerId: string }) {
  const points = useGameStore((state) => state.game.players[playerId]?.points)

  return <span className="text-black">Score: {points}</span>
}
