import { PlayerId } from "dusk-games-sdk"
import { create } from "zustand"
import { subscribeWithSelector } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"

import { GameState } from "@/logic"

type State = {
  yourPlayerId?: PlayerId
  game: GameState
}

export const useGameStore = create<State>()(
  immer(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    subscribeWithSelector((set, get) => ({
      game: {
        playerIds: [],
        bricks: {},
      },
    }))
  )
)
