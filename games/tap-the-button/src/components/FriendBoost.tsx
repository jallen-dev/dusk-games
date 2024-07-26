import { useGameStore } from "@/useGameStore"
import clsx from "clsx"

import { Reveal } from "./Reveal"

export function FriendBoost() {
  const playerIds = useGameStore((state) => state.game.playerIds)
  const yourPlayerId = useGameStore((state) => state.yourPlayerId)
  const { level } = useGameStore((state) => state.game.persisted[yourPlayerId])

  const numFriends = playerIds.length - 1
  return (
    <Reveal show={level > 3}>
      Friend Boost:{" "}
      <span className={clsx({ "text-red-600": numFriends === 0, "text-green-600": numFriends > 0 })}>
        +{numFriends * 100}%
      </span>
    </Reveal>
  )
}
