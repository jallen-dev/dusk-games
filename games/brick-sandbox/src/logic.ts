import type { PlayerId, DuskClient } from "dusk-games-sdk/multiplayer"

export type Cells = (PlayerId | null)[]
export interface GameState {
  playerIds: PlayerId[]
  position: [number, number, number]
}

type GameActions = {
  setPosition: (position: [number, number, number]) => void
}

declare global {
  const Dusk: DuskClient<GameState, GameActions>
}

Dusk.initLogic({
  minPlayers: 2,
  maxPlayers: 2,
  setup: (allPlayerIds) => ({
    playerIds: allPlayerIds,
    position: [0, 0, 0],
  }),
  actions: {
    setPosition: (position, { game }) => {
      game.position = position
    },
  },
})
