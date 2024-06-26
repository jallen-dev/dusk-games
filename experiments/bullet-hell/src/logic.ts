import type { DuskClient, PlayerId } from "dusk-games-sdk/multiplayer"

import { BULLET_SPEED, PLAYER_HALF_WIDTH, PLAYER_MOVE_SPEED } from "./constants"
import { Bullet, Player, Vector } from "./types"

export type Cells = (PlayerId | null)[]
export interface GameState {
  players: Record<PlayerId, Player>
  enemyBullets: Record<string, Bullet>
  bulletId: number
  lastSpawnedBulletsAt: number
}

type GameActions = {
  setVelocity: ({ x, y }: Partial<Vector>) => void
}

declare global {
  const Dusk: DuskClient<GameState, GameActions>
}

const COLORS = ["red", "blue", "green", "yellow"] as const

Dusk.initLogic({
  minPlayers: 1,
  maxPlayers: 4,
  updatesPerSecond: 15,
  landscape: true,
  setup: (allPlayerIds) => {
    const game = {
      bulletId: 0,
      lastSpawnedBulletsAt: 0,
      enemyBullets: {},
      players: allPlayerIds.reduce(
        (acc, playerId, i) => {
          acc[playerId] = {
            position: {
              x: 100 + (i % 2) * 500,
              y: 100 + Math.floor(i / 2) * 200,
            },
            velocity: { x: 0, y: 0 },
            hitCount: 0,
            color: COLORS[i],
          }
          return acc
        },
        {} as GameState["players"],
      ),
    }

    createBullets(game)
    return game
  },
  actions: {
    setVelocity: (velocity: Partial<Vector>, { game, playerId }) => {
      game.players[playerId].velocity = {
        ...game.players[playerId].velocity,
        ...velocity,
      }
    },
  },
  events: {
    playerJoined: (playerId, { game }) => {
      game.players[playerId] = {
        position: {
          x: 100 + (Object.keys(game.players).length % 2) * 500,
          y: 100 + (Object.keys(game.players).length % 2) * 200,
        },
        velocity: { x: 0, y: 0 },
        hitCount: 0,
        color: COLORS[Object.keys(game.players).length],
      }
    },
  },
  update: ({ game }) => {
    for (const playerId in game.players) {
      const player = game.players[playerId]
      player.position.x += player.velocity.x * PLAYER_MOVE_SPEED
      player.position.y += player.velocity.y * PLAYER_MOVE_SPEED
    }

    for (const bullet in game.enemyBullets) {
      checkBulletCollision(game, bullet)
    }

    if (Dusk.gameTime() - game.lastSpawnedBulletsAt > 1000) {
      createBullets(game)
      game.lastSpawnedBulletsAt = Dusk.gameTime()
    }
  },
})

function createBullets(game: GameState) {
  const numBullets = 20
  const position = { x: Math.random() * 800, y: Math.random() * 400 }
  for (let i = 0; i < numBullets; i++) {
    game.enemyBullets[game.bulletId++] = {
      position: { ...position },
      velocity: {
        x: Math.cos((i / numBullets) * Math.PI * 2),
        y: Math.sin((i / numBullets) * Math.PI * 2),
      },
    }
  }
}

function checkBulletCollision(game: GameState, bulletId: string) {
  game.enemyBullets[bulletId].position.x += game.enemyBullets[bulletId].velocity.x * BULLET_SPEED
  game.enemyBullets[bulletId].position.y += game.enemyBullets[bulletId].velocity.y * BULLET_SPEED

  // collision detection with players
  for (const playerId in game.players) {
    const player = game.players[playerId]
    if (
      Math.abs(player.position.x - game.enemyBullets[bulletId].position.x) < PLAYER_HALF_WIDTH &&
      Math.abs(player.position.y - game.enemyBullets[bulletId].position.y) < PLAYER_HALF_WIDTH
    ) {
      player.hitCount++
      delete game.enemyBullets[bulletId]
      return
    }
  }

  // remove bullets that are out of bounds
  if (
    game.enemyBullets[bulletId].position.y < 0 ||
    game.enemyBullets[bulletId].position.y > 400 ||
    game.enemyBullets[bulletId].position.x < 0 ||
    game.enemyBullets[bulletId].position.x > 800
  ) {
    delete game.enemyBullets[bulletId]
  }
}
