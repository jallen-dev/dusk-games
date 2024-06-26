import { Graphics, Stage, useTick } from "@pixi/react"
import { PlayerId } from "dusk-games-sdk"
import { useEffect, useRef } from "react"

import { Controls } from "./components/Controls"
import { PLAYER_HALF_WIDTH, PLAYER_MOVE_SPEED } from "./constants"
import { PLAYER_INTERPOLATORS, updateInterpolators } from "./interpolators"
import { useGameStore } from "./store/useGameStore"
import { IGraphics } from "./types"

function App() {
  const allPlayerIds = useGameStore((state) => state.allPlayerIds)

  useEffect(() => {
    Dusk.initClient({
      onChange: ({ game, futureGame, yourPlayerId, allPlayerIds, event }) => {
        useGameStore.setState({ game, yourPlayerId, allPlayerIds })

        if (event?.name === "stateSync") {
          for (const interpolator in PLAYER_INTERPOLATORS) {
            delete PLAYER_INTERPOLATORS[interpolator]
          }
          for (const playerId of allPlayerIds) {
            if (playerId === yourPlayerId) {
              PLAYER_INTERPOLATORS[playerId] = Dusk.interpolator()
            } else {
              PLAYER_INTERPOLATORS[playerId] = Dusk.interpolatorLatency({
                maxSpeed: PLAYER_MOVE_SPEED - 5,
                timeToMaxSpeed: 1,
              })
            }
          }
        }

        if (futureGame) {
          updateInterpolators(game, futureGame)
        }
      },
    })
  }, [])

  if (!allPlayerIds.length) return null

  return (
    <>
      <Stage options={{ backgroundAlpha: 0 }}>
        <Players />
        <Bullets />
      </Stage>
      <Controls />
      <DebugInfo />
    </>
  )
}

export default App

function Players() {
  const allPlayerIds = useGameStore((state) => state.allPlayerIds)

  return (
    <>
      {allPlayerIds.map((playerId) => (
        <Player key={playerId} playerId={playerId} />
      ))}
    </>
  )
}

function Player({ playerId }: { playerId: PlayerId }) {
  const color = useGameStore((state) => state.game.players[playerId].color)
  const graphicsRef = useRef<IGraphics>(null)

  useTick(() => {
    if (!graphicsRef.current || !PLAYER_INTERPOLATORS[playerId]) {
      return
    }

    const [x, y] = PLAYER_INTERPOLATORS[playerId].getPosition()
    graphicsRef.current.position.set(x, y)
  })

  return (
    <Graphics
      ref={graphicsRef}
      draw={(g) => {
        g.beginFill(color)
        g.drawRect(-PLAYER_HALF_WIDTH, -PLAYER_HALF_WIDTH, PLAYER_HALF_WIDTH * 2, PLAYER_HALF_WIDTH * 2)
        g.endFill()
      }}
    />
  )
}

function Bullets() {
  const enemyBullets = useGameStore((state) => state.game.enemyBullets)

  return (
    <>
      {Object.entries(enemyBullets).map(([bulletId, bullet]) => (
        <Bullet key={bulletId} x={bullet.position.x} y={bullet.position.y} />
      ))}
    </>
  )
}

function Bullet({ x, y }: { x: number; y: number }) {
  return (
    <Graphics
      x={x}
      y={y}
      draw={(g) => {
        g.beginFill(0xffffff)
        g.drawCircle(0, 0, 5)
        g.endFill()
      }}
    />
  )
}

function DebugInfo() {
  const enemyBullets = useGameStore((state) => state.game.enemyBullets)
  const allPlayerIds = useGameStore((state) => state.allPlayerIds)

  return (
    <div className="fixed right-1/2 top-4 translate-x-1/2 text-white">
      Bullets: {Object.keys(enemyBullets).length}
      {allPlayerIds.map((playerId) => (
        <PlayerHitCount key={playerId} playerId={playerId} />
      ))}
    </div>
  )
}

function PlayerHitCount({ playerId }: { playerId: PlayerId }) {
  const color = useGameStore((state) => state.game.players[playerId].color)
  const hitCount = useGameStore((state) => state.game.players[playerId].hitCount)

  return (
    <div style={{ color }}>
      {color} hit: {hitCount}
    </div>
  )
}
