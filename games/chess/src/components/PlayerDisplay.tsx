import { PlayerId } from "dusk-games-sdk"

import { useGameStore } from "@/store/useGameStore"

import { Avatar } from "./Avatar"
import { Clock } from "./Clock"

export function PlayerDisplay({ playerId }: { playerId?: PlayerId }) {
  const yourPlayerId = useGameStore((state) => state.yourPlayerId)

  return (
    <div className="flex items-center justify-between bg-zinc-800">
      <div className="flex items-center gap-2">
        <div className="w-20 p-2">
          <Avatar playerId={playerId} />
        </div>
        <div>
          {!playerId ? "Computer" : playerId === yourPlayerId ? "You" : Dusk.getPlayerInfo(playerId).displayName}
        </div>
      </div>
      <Clock playerId={playerId} />
    </div>
  )
}
