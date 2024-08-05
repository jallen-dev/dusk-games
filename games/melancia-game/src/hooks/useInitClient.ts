import * as RAPIER from "@dimforge/rapier2d-compat"
import { PlayerId } from "dusk-games-sdk"
import { useEffect } from "react"
import seed from "seed-random"

import { useGameStore } from "@/store/useGameStore"

export function useInitClient(assetsLoaded: boolean) {
  useEffect(() => {
    if (!assetsLoaded) {
      return
    }

    Dusk.initClient({
      onChange: ({ game, futureGame, players, yourPlayerId, event, allPlayerIds }) => {
        if (event?.name === "stateSync") {
          const worlds = allPlayerIds.reduce(
            (acc, id) => {
              acc[id] = new RAPIER.World({ x: 0.0, y: 9.81 * 25 })
              return acc
            },
            {} as Record<PlayerId, RAPIER.World>,
          )
          useGameStore.setState({ worlds, random: seed(game.seed) })
          if (yourPlayerId) {
            useGameStore.setState({ fruits: { [yourPlayerId]: {} } })
          }
        }
        if (event?.name === "playerJoined") {
          const worlds = { ...useGameStore.getState().worlds }
          worlds[event.params.playerId] = new RAPIER.World({ x: 0.0, y: 9.81 * 25 })
          useGameStore.setState({ worlds })
          //
        }
        if (event?.name === "playerLeft") {
          //
        }
        if (futureGame) {
          // update interpolators
        }

        // check if fruits have changed and update worlds
        const oldPlayers = useGameStore.getState().game.players
        useGameStore.setState({ game, playerDetails: players, yourPlayerId })

        for (const [playerId, oldPlayer] of Object.entries(oldPlayers)) {
          const nextPlayer = game.players[playerId]
          if (!nextPlayer) {
            continue
          }
          if (playerId === yourPlayerId || !oldPlayer.active || !nextPlayer.active) {
            continue
          }
          if (oldPlayer.fruits !== nextPlayer.fruits) {
            useGameStore.getState().updateWorldforPlayer(playerId)
          }
        }
      },
    })
  }, [assetsLoaded])
}
