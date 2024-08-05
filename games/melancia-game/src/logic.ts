import type { DuskClient, PlayerId } from "dusk-games-sdk/multiplayer"

import { GAME_DURATION } from "./constants"
import { FruitData, GameScreen, Player } from "./types"

export type GameState = {
  players: Record<PlayerId, Player>
  activePlayerIds: Array<PlayerId>
  currentScreen: GameScreen
  seed: string
  gameStartedAt: number
  timeRemaining: number
  gameOver: boolean
}

type GameActions = {
  ready: () => void
  updateFruits: ({ fruits }: { fruits: Array<FruitData> }) => void
  updatePoints: ({ points }: { points: number }) => void
}

declare global {
  const Dusk: DuskClient<GameState, GameActions>
}

Dusk.initLogic({
  minPlayers: 1,
  maxPlayers: 4,
  reactive: true,
  setup: (allPlayerIds): GameState => {
    return {
      players: allPlayerIds.reduce(
        (acc, id) => ({
          ...acc,
          [id]: {
            active: true,
            fruits: [],
            ready: false,
            points: 0,
            timeLastDropped: -1000,
            dropReady: true,
          },
        }),
        {} as Record<PlayerId, Player>,
      ),
      currentScreen: "lobby",
      activePlayerIds: allPlayerIds,
      seed: "" + Math.random(),
      gameStartedAt: Infinity,
      timeRemaining: GAME_DURATION,
      gameOver: false,
    }
  },
  actions: {
    ready: (_, { game, playerId }) => {
      const player = game.players[playerId]
      if (!player.active) {
        return
      }

      player.ready = true

      if (Object.values(game.players).every((player) => player.active === false || player.ready)) {
        startGame(game)
      }
    },
    updateFruits: ({ fruits }, { game, playerId }) => {
      const player = game.players[playerId]
      if (!player.active) {
        return
      }

      player.fruits = fruits
      player.dropReady = false
      player.timeLastDropped = Dusk.gameTime()
    },
    updatePoints: ({ points }, { game, playerId }) => {
      const player = game.players[playerId]
      if (!player.active) {
        return
      }

      player.points = points
    },
  },
  events: {
    playerJoined: (playerId, { game }) => {
      if (game.currentScreen === "lobby") {
        game.players[playerId] = {
          active: true,
          fruits: [],
          ready: false,
          points: 0,
          timeLastDropped: 0,
          dropReady: true,
        }
        game.activePlayerIds.push(playerId)
      }

      if (game.currentScreen === "play") {
        // spectating
        game.players[playerId] = {
          active: false,
          fruits: [],
          ready: false,
          points: 0,
          timeLastDropped: 0,
          dropReady: false,
        }
      }
    },
    playerLeft: (playerId, { game }) => {
      delete game.players[playerId]
      game.activePlayerIds = game.activePlayerIds.filter((id) => id !== playerId)

      // if they were active and there is only 1 rival left, that player wins
      if (game.currentScreen === "play" && game.activePlayerIds.length === 1) {
        return endGame(game)
      }

      // if we're in the lobby and they were the last one to not be ready, start the game
      if (
        game.currentScreen === "lobby" &&
        Object.values(game.players).every((player) => player.active === false || player.ready)
      ) {
        startGame(game)
      }
    },
  },
  update: ({ game }) => {
    if (game.currentScreen === "play") {
      const now = Dusk.gameTime()
      for (const player of Object.values(game.players)) {
        if (player.active) {
          player.dropReady = now - player.timeLastDropped > 1000
        }
      }
      game.timeRemaining = GAME_DURATION - (now - game.gameStartedAt)
      if (game.timeRemaining <= 0) {
        endGame(game)
      }
    }
  },
  updatesPerSecond: 10,
})

function startGame(game: GameState) {
  game.currentScreen = "play"
  game.gameStartedAt = Dusk.gameTime()
}

function endGame(game: GameState) {
  game.gameOver = true
  const players = Object.keys(game.players).reduce(
    (acc, playerId) => {
      acc[playerId] = game.players[playerId].points
      return acc
    },
    {} as Record<PlayerId, number>,
  )

  Dusk.gameOver({
    players,
  })
}
