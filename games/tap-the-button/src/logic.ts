import type { DuskClient, GameStateWithPersisted, PlayerId } from "dusk-games-sdk"

import { LEVEL_THRESHOLDS } from "./constants"
import { PlayerStats } from "./types"
import { costForUpgrade } from "./utils"

export interface GameState {
  playerIds: PlayerId[]
  gameStartedAt?: number
  welcomeMessage: Record<PlayerId, string>
}

type GameActions = {
  tap: () => void
  upgrade: (skill: keyof PlayerStats["skills"]) => void
  setGameStartedAt: (now: number) => void
  dismissFriendBoostPrompt: () => void
  dismissSaveProgressPrompt: () => void
  claimSuperTaps: () => void
}

export type Persisted = PlayerStats

declare global {
  const Dusk: DuskClient<GameState, GameActions, Persisted>
}

Dusk.initLogic({
  persistPlayerData: true,
  minPlayers: 1,
  maxPlayers: 6,
  setup: (allPlayerIds, { game }) => {
    for (const playerId of allPlayerIds) {
      migratePlayerData(playerId, game)
    }

    return {
      playerIds: allPlayerIds,
      welcomeMessage: {},
    }
  },
  actions: {
    tap: (_, { game, playerId }) => {
      const friendBoost = game.persisted[playerId].level > 3 ? game.playerIds.length : 1
      const superTapBoost = game.persisted[playerId].superTaps / 10
      const tapPower = 2 ** game.persisted[playerId].skills.tapPower * (friendBoost + superTapBoost)
      game.persisted[playerId].taps += tapPower
    },
    upgrade: (skill: keyof PlayerStats["skills"], { game, playerId }) => {
      const cost = costForUpgrade(skill, game.persisted[playerId].skills[skill])
      if (game.persisted[playerId].skillPoints >= cost) {
        game.persisted[playerId].skills[skill]++
        game.persisted[playerId].skillPoints -= cost
      }
    },
    setGameStartedAt: (now, { game }) => {
      if (!game.gameStartedAt) {
        game.gameStartedAt = now
      }
    },
    dismissFriendBoostPrompt: (_, { game, playerId }) => {
      game.persisted[playerId].dismissedFriendBoostPrompt = true
    },
    dismissSaveProgressPrompt: (_, { game, playerId }) => {
      game.persisted[playerId].dismissedSaveProgressPrompt = true
    },
    claimSuperTaps: (_, { game, playerId }) => {
      const taps = game.persisted[playerId].taps
      const totalSuperTaps = Math.floor(Math.cbrt(taps / 1_000))
      game.persisted[playerId].superTaps = totalSuperTaps
      game.persisted[playerId].taps = 0
      game.persisted[playerId].level = 1
      game.persisted[playerId].skillPoints = 0
      game.persisted[playerId].skills = {
        tapPower: 0,
        autoTappers: 0,
        autoTapperPower: 0,
      }
    },
  },
  update: ({ game }) => {
    if (!game.gameStartedAt) {
      return
    }
    const now = game.gameStartedAt + Dusk.gameTime()
    const friendBoost = game.playerIds.length

    for (const playerId of game.playerIds) {
      const delta = now - game.persisted[playerId].lastPlayedAt
      // do not give friend boost if player was away
      const thisPlayersFriendBoost = game.persisted[playerId].level > 3 && delta < 60_000 ? friendBoost : 1
      const thisPlayersSuperTapBoost = game.persisted[playerId].superTaps / 10
      const autoTapPower =
        2 ** game.persisted[playerId].skills.autoTapperPower * (thisPlayersFriendBoost + thisPlayersSuperTapBoost)
      const autoTaps = game.persisted[playerId].skills.autoTappers * autoTapPower * (delta / 1000)

      if (delta > 60_000 && autoTaps > 0) {
        // TODO: change this to something like {type: "gainedTaps", amount: autoTaps} and translate it client-side
        game.welcomeMessage[playerId] =
          `You gained ${Math.floor(autoTaps).toLocaleString("en-US")} taps while you were away!`
      }

      game.persisted[playerId].taps += autoTaps

      if (game.persisted[playerId].taps >= LEVEL_THRESHOLDS[game.persisted[playerId].level]) {
        const newLevel = LEVEL_THRESHOLDS.findIndex((threshold) => game.persisted[playerId].taps < threshold)
        if (newLevel !== -1) {
          const levelsGained = newLevel - game.persisted[playerId].level
          game.persisted[playerId].skillPoints += 3 * levelsGained
          game.persisted[playerId].level = newLevel
        }
      }

      game.persisted[playerId].lastPlayedAt = game.gameStartedAt + Dusk.gameTime()
    }
  },
  events: {
    playerJoined: (playerId, { game }) => {
      migratePlayerData(playerId, game)
      game.playerIds.push(playerId)
    },
    playerLeft: (playerId, { game }) => {
      game.playerIds = game.playerIds.filter((id) => id !== playerId)
    },
  },
})

function migratePlayerData(playerId: PlayerId, game: Pick<GameStateWithPersisted<GameState, Persisted>, "persisted">) {
  if (!game.persisted[playerId].version) {
    game.persisted[playerId] = {
      version: 1,
      taps: 0,
      superTaps: 0,
      level: 1,
      skillPoints: 0,
      skills: {
        tapPower: 0,
        autoTappers: 0,
        autoTapperPower: 0,
      },
      lastPlayedAt: 0,
      dismissedFriendBoostPrompt: false,
      dismissedSaveProgressPrompt: false,
    }
  }
}
