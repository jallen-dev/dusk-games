import type { PieceSymbol } from "chess.js"
import type { FEN, Key } from "chessground/types"
import type { DuskClient, GameOverResult, PlayerId } from "dusk-games-sdk/multiplayer"

import { GameOverReason, GameScreen } from "./types"

export interface GameState {
  currentScreen: GameScreen
  playerIds: PlayerId[]
  whitePlayerId?: PlayerId
  blackPlayerId?: PlayerId
  fen: string
  lastMove?: [Key, Key]
  turn: "white" | "black"
  gameOverReason?: GameOverReason
  players: Record<
    PlayerId,
    {
      preference: "white" | "black" | "none"
      playing: boolean
      ready: boolean
    }
  >
}

type MoveProps = {
  orig: Key
  dest: Key
  capturedPiece?: PieceSymbol
  gameOverReason?: GameOverReason
  fen: FEN
}

type GameActions = {
  move: (args: MoveProps) => void
  chooseColor: (args: { color: "white" | "black" | "none" }) => void
  joinGame: () => void
  specateGame: () => void
  toggleReady: () => void
}

declare global {
  const Dusk: DuskClient<GameState, GameActions>
}

Dusk.initLogic({
  minPlayers: 1,
  maxPlayers: 2,
  setup: (allPlayerIds) => ({
    playerIds: allPlayerIds,
    currentScreen: "lobby",
    turn: "white",
    fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
    players: allPlayerIds.reduce(
      (acc, playerId) => {
        acc[playerId] = {
          preference: "none",
          playing: true,
          ready: false,
        }
        return acc
      },
      {} as GameState["players"],
    ),
  }),
  actions: {
    move: ({ orig, dest, fen, gameOverReason }, { game }) => {
      game.lastMove = [orig, dest]
      game.fen = fen
      game.gameOverReason = gameOverReason
      if (gameOverReason) {
        return Dusk.gameOver({
          minimizePopUp: true,
          players: getGameOverResults(game),
        })
      }

      game.turn = game.turn === "white" ? "black" : "white"
    },
    joinGame: (_, { game, playerId }) => {
      game.players[playerId].playing = true
      game.players[playerId].ready = false
      game.players[playerId].preference = "none"
    },
    specateGame: (_, { game, playerId }) => {
      game.players[playerId].playing = false
      checkStartGame(game)
    },
    chooseColor: ({ color }, { game, playerId }) => {
      game.players[playerId].preference = color
    },
    toggleReady: (_, { game, playerId }) => {
      game.players[playerId].ready = !game.players[playerId].ready
      checkStartGame(game)
    },
  },
  events: {
    playerJoined(playerId, { game }) {
      game.playerIds.push(playerId)
      game.players[playerId] = {
        preference: "none",
        playing: game.currentScreen === "lobby" ? true : false,
        ready: false,
      }
    },
    playerLeft(playerId, { game }) {
      game.playerIds = game.playerIds.filter((id) => id !== playerId)
      delete game.players[playerId]
      if (game.currentScreen === "lobby") {
        checkStartGame(game)
      } else {
        game.gameOverReason = "opponent left"
        Dusk.gameOver({ minimizePopUp: true, players: { [game.playerIds[0]]: "WON" } })
      }
    },
  },
})

function checkStartGame(game: GameState) {
  if (Object.values(game.players).some((player) => player.playing && !player.ready)) {
    return
  }

  const playingPlayers = game.playerIds.filter((playerId) => game.players[playerId].playing)

  if (playingPlayers.length < 1) {
    return
  }

  game.currentScreen = "play"

  if (playingPlayers.length === 1) {
    const preference = game.players[playingPlayers[0]].preference

    if (preference === "white") {
      game.whitePlayerId = playingPlayers[0]
    } else if (preference === "black") {
      game.blackPlayerId = playingPlayers[0]
    } else {
      if (Math.random() < 0.5) {
        game.whitePlayerId = playingPlayers[0]
      } else {
        game.blackPlayerId = playingPlayers[0]
      }
    }

    return
  }

  if (playingPlayers[0] === playingPlayers[1]) {
    if (Math.random() < 0.5) {
      game.whitePlayerId = playingPlayers[0]
      game.blackPlayerId = playingPlayers[1]
    } else {
      game.whitePlayerId = playingPlayers[1]
      game.blackPlayerId = playingPlayers[0]
    }
  } else if (
    game.players[playingPlayers[0]].preference === "white" ||
    game.players[playingPlayers[1]].preference === "black"
  ) {
    game.whitePlayerId = playingPlayers[0]
    game.blackPlayerId = playingPlayers[1]
  } else {
    game.whitePlayerId = playingPlayers[1]
    game.blackPlayerId = playingPlayers[0]
  }
}

function getGameOverResults(game: GameState) {
  if (game.gameOverReason === "checkmate") {
    const playingPlayers = game.playerIds.filter((playerId) => game.players[playerId].playing)
    if (playingPlayers.length === 1) {
      const isWhite = game.whitePlayerId === playingPlayers[0]
      const won = (isWhite && game.turn === "white") || (!isWhite && game.turn === "black")
      const result = won ? "WON" : "LOST"
      return game.playerIds.reduce(
        (acc, playerId) => {
          acc[playerId] = result
          return acc
        },
        {} as Record<PlayerId, GameOverResult>,
      )
    } else {
      const winnerId = game.turn === "white" ? game.whitePlayerId : game.blackPlayerId
      return {
        [game.playerIds[0]]: game.playerIds[0] === winnerId ? "WON" : "LOST",
        [game.playerIds[1]]: game.playerIds[1] === winnerId ? "WON" : "LOST",
      } as Record<PlayerId, GameOverResult>
    }
  } else {
    return game.playerIds.reduce(
      (acc, playerId) => {
        acc[playerId] = "TIE"
        return acc
      },
      {} as Record<PlayerId, GameOverResult>,
    )
  }
}
