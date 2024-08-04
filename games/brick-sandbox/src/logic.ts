import type { PlayerId, DuskClient } from "dusk-games-sdk/multiplayer"
import { BrickType } from "./types"

type Brick = {
  color: string
  position: [number, number, number]
  type: BrickType
  controlledBy?: PlayerId
}

export interface GameState {
  playerIds: PlayerId[]
  bricks: Record<string, Brick>
}

type GameActions = {
  setPosition: (args: {
    brickId: string
    position: [number, number, number]
  }) => void
  selectBrick: (args: { brickId: string }) => void
  deselectBrick: (args: { brickId: string }) => void
  addBrick: (args: { brickType: BrickType }) => void
}

declare global {
  const Dusk: DuskClient<GameState, GameActions>
}

Dusk.initLogic({
  minPlayers: 2,
  maxPlayers: 2,
  setup: (allPlayerIds) => ({
    playerIds: allPlayerIds,
    bricks: {
      0: {
        position: [-2, 0, 0],
        color: "red",
        type: BrickType.RoundBrick2x2,
      },
      1: {
        position: [1, 0, 0],
        color: "yellow",
        type: BrickType.RoundBrick2x2,
      },
    },
  }),
  actions: {
    setPosition: ({ brickId, position }, { game }) => {
      game.bricks[brickId].position = position
    },
    selectBrick: ({ brickId }, { game, playerId }) => {
      game.bricks[brickId].controlledBy = playerId
    },
    deselectBrick: ({ brickId }, { game, playerId }) => {
      if (game.bricks[brickId].controlledBy === playerId) {
        delete game.bricks[brickId].controlledBy
      }
    },
    addBrick: ({ brickType }, { game, playerId }) => {
      const brickId = Object.keys(game.bricks).length
      game.bricks[brickId] = {
        position: [0, 0, 0],
        color: "yellow",
        type: brickType,
        controlledBy: playerId,
      }
    },
  },
})
