import type { PlayerId, DuskClient } from "dusk-games-sdk/multiplayer"
import { BrickType, Color } from "./types"

type Brick = {
  color: Color
  position: [number, number, number]
  type: BrickType
  controlledBy?: PlayerId
}

export interface GameState {
  playerIds: PlayerId[]
  bricks: Record<string, Brick>
  selectedBrickIds: Record<PlayerId, string[]>
}

type GameActions = {
  setPosition: (args: {
    brickId: string
    position: [number, number, number]
  }) => void
  selectBrick: (args: { brickId: string }) => void
  deselectBrick: (args: { brickId: string }) => void
  addBrick: (args: { brickType: BrickType }) => void
  changeBrickColor: (args: { brickId: string; color: Color }) => void
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
        color: Color.Red,
        type: BrickType.RoundBrick2x2,
      },
      1: {
        position: [1, 0, 0],
        color: Color.Yellow,
        type: BrickType.RoundBrick2x2,
      },
    },
    selectedBrickIds: allPlayerIds.reduce(
      (acc, playerId) => ({ ...acc, [playerId]: [] }),
      {}
    ),
  }),
  actions: {
    setPosition: ({ brickId, position }, { game }) => {
      game.bricks[brickId].position = position
    },
    selectBrick: ({ brickId }, { game, playerId }) => {
      game.bricks[brickId].controlledBy = playerId
      game.selectedBrickIds[playerId].push(brickId)
    },
    deselectBrick: ({ brickId }, { game, playerId }) => {
      if (game.bricks[brickId].controlledBy === playerId) {
        delete game.bricks[brickId].controlledBy
      }
      game.selectedBrickIds[playerId] = game.selectedBrickIds[playerId].filter(
        (id) => id !== brickId
      )
    },
    addBrick: ({ brickType }, { game, playerId }) => {
      const brickId = Object.keys(game.bricks).length
      game.bricks[brickId] = {
        position: [0, 0, 0],
        color: Color.Yellow,
        type: brickType,
        controlledBy: playerId,
      }
    },
    changeBrickColor: ({ brickId, color }, { game }) => {
      game.bricks[brickId].color = color
    },
  },
})
