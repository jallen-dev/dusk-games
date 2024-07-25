import { PlayerId } from "dusk-games-sdk"

import placeholder from "@/assets/avatar-placeholder.png"

export function Avatar({ playerId }: { playerId?: PlayerId }) {
  if (!playerId) {
    return <img className="aspect-square w-full" src={placeholder} alt="a friend" />
  }
  const playerInfo = Dusk.getPlayerInfo(playerId)
  return (
    <div className="relative aspect-square w-full">
      <img className="absolute h-full w-full" src={placeholder} alt={playerInfo.displayName} />
      <img className="absolute h-full w-full" src={playerInfo.avatarUrl} alt={playerInfo.displayName} />
    </div>
  )
}
