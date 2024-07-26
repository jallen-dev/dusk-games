import { GameStateWithPersisted, PlayerId } from "dusk-games-sdk"
import { create } from "zustand"
import { subscribeWithSelector } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"

import { GameState } from "./logic"
import { PlayerStats } from "./types"

type State = {
  yourPlayerId: PlayerId
  game: GameStateWithPersisted<GameState, PlayerStats>
}

// type Actions = {
// }

export const useGameStore = create<State>()(
  immer(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    subscribeWithSelector((_set, _get) => ({
      yourPlayerId: "",
      game: {
        welcomeMessage: {},
        playerIds: [],
        persisted: {},
        // this is a dummy value so the client doesn't send a `setNow` action immediately
        // only if it gets a `game` from `onChange` without a `now` value will it call `setNow`
        gameStartedAt: 69_420,
      },
    })),
  ),
)
