export type PlayerStats = {
  version: 1
  taps: number
  superTaps: number
  level: number
  skillPoints: number
  skills: {
    tapPower: number
    autoTappers: number
    autoTapperPower: number
  }
  lastPlayedAt: number
  dismissedFriendBoostPrompt: boolean
  dismissedSaveProgressPrompt: boolean
}
