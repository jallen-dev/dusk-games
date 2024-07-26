import { PlayerStats } from "./types"

export function costForUpgrade(skill: keyof PlayerStats["skills"], level: number) {
  switch (skill) {
    case "tapPower":
      return level + 1
    case "autoTappers":
      return 1
    case "autoTapperPower":
      return level + 1
  }
}
