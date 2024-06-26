import { Interpolator, PlayerId } from "dusk-games-sdk"

import { GameState } from "./logic"

export const PLAYER_INTERPOLATORS: Record<PlayerId, Interpolator<number[]>> = {}

export function updateInterpolators(game: GameState, futureGame: GameState) {
  for (const playerId in PLAYER_INTERPOLATORS) {
    if (!game.players[playerId]) {
      continue
    }

    PLAYER_INTERPOLATORS[playerId].update({
      game: [game.players[playerId].position.x, game.players[playerId].position.y],
      futureGame: [futureGame.players[playerId].position.x, futureGame.players[playerId].position.y],
    })
  }
}
