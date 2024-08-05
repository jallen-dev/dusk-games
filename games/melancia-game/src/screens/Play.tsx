import { Container, useApp } from "@pixi/react"
import { PlayerId } from "dusk-games-sdk"
import { useEffect, useRef } from "react"

import { Clock } from "@/components/dom/Clock"
import { Controls } from "@/components/dom/Controls"
import { Background } from "@/components/pixi/Background"
import { DropMarker } from "@/components/pixi/DropMarker"
import { FruitContainer } from "@/components/pixi/FruitContainer"
import { Fruits } from "@/components/pixi/Fruits"
import { Physics } from "@/components/pixi/Physics"
import { Html } from "@/helpers/Html"
import { Pixi } from "@/helpers/Pixi"
import { useGlobalPosition } from "@/hooks/useGlobalPosition"
import { useGameStore } from "@/store/useGameStore"
import { IContainer } from "@/types"

import { Spectate } from "./Spectate"

export function Play() {
  console.log("render")
  const yourPlayerId = useGameStore((state) => state.yourPlayerId) ?? ""
  const activePlayerIds = useGameStore((state) => state.game.activePlayerIds)

  const spectating = !activePlayerIds.includes(yourPlayerId)

  if (!yourPlayerId || spectating) {
    return <Spectate />
  }

  return (
    <div>
      <div className="fixed top-28 flex flex-col gap-2 p-2 text-2xl">
        <div className="w-fit rounded-lg bg-slate-800 px-2">
          <Clock />
        </div>
        <div className="w-fit rounded-lg bg-slate-800 px-2">
          <Points />
        </div>
      </div>
      <Controls />
      <Pixi.In>
        <Background />
        <Rivals />
        <PlayersContainer playerId={yourPlayerId} />
        <Physics />
      </Pixi.In>
    </div>
  )
}

function Rivals() {
  const yourPlayerId = useGameStore((state) => state.yourPlayerId) ?? ""
  const activePlayerIds = useGameStore((state) => state.game.activePlayerIds)

  const otherPlayerIds = activePlayerIds.filter((id) => id !== yourPlayerId)

  const app = useApp()
  const width = app.screen.width
  const xSpace = width - 75 * otherPlayerIds.length
  const offset = xSpace / 4

  return (
    <>
      {otherPlayerIds.map((playerId, index) => (
        <Rival key={playerId} playerId={playerId} position={{ x: offset + (75 + offset) * index, y: 35 }} />
      ))}
    </>
  )
}

function PlayersContainer({ playerId }: { playerId: PlayerId }) {
  const containerRef = useRef<IContainer>(null)
  const app = useApp()
  const width = app.screen.width
  const height = app.screen.height
  const scale = (width - 80) / 186

  return (
    <Container
      scale={scale}
      position={{ x: 40, y: height - 100 - 186 * scale }}
      ref={containerRef}
      anchor={{ x: 0, y: 0 }}
    >
      <FruitContainer playerId={playerId} />
      <Fruits playerId={playerId} />
      <DropMarker />
    </Container>
  )
}

function Points() {
  const spanRef = useRef<HTMLSpanElement>(null)
  const pointsRef = useRef(0)
  const lastPointsRef = useRef(0)

  useEffect(() => {
    const unsubscribe = useGameStore.subscribe(
      (state) => state.points,
      (points) => {
        lastPointsRef.current = pointsRef.current
        pointsRef.current = points
        if (spanRef.current) {
          spanRef.current.innerText = points.toString()
        }
      },
    )
    const interval = setInterval(() => {
      if (lastPointsRef.current !== pointsRef.current) {
        Dusk.actions.updatePoints({ points: pointsRef.current })
      }
    }, 1000)

    return () => {
      unsubscribe()
      clearInterval(interval)
    }
  }, [])
  return (
    <div className="">
      Score: <span ref={spanRef}>0</span>
    </div>
  )
}

function Rival({ playerId, position }: { playerId: string; position: { x: number; y: number } }) {
  const details = useGameStore((state) => state.playerDetails[playerId])
  const [x, y] = useGlobalPosition(position)
  const transform = `translate(${x}px, ${y}px)`

  // for some reason, when game restarts this is undefined
  // I'm guessing playerId is from old game
  // not sure why this is re-rendering though with the old playerId if that's the case
  if (!details) {
    return null
  }

  return (
    <Container scale={0.4} position={position}>
      <FruitContainer playerId={playerId} />
      <Fruits playerId={playerId} />
      <Html.In>
        <div className="fixed -left-10 -top-8" style={{ transform }}>
          <div className="flex max-w-[33vw] items-center">
            <img src={details.avatarUrl} alt={details.displayName} className="h-8 w-8" />
            <span className="w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-center text-black">
              {details.displayName}
            </span>
          </div>
        </div>
      </Html.In>
    </Container>
  )
}
