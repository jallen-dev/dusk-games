import { PlayerId } from "dusk-games-sdk"

import { useGameStore } from "@/store/useGameStore"

export function Clock({ playerId }: { playerId?: PlayerId }) {
  const yourPlayerId = useGameStore((state) => state.yourPlayerId)
  const whitePlayerId = useGameStore((state) => state.game.whitePlayerId)
  const blackPlayerId = useGameStore((state) => state.game.blackPlayerId)
  const turn = useGameStore((state) => state.game.turn)

  const youArePlaying = yourPlayerId === whitePlayerId || yourPlayerId === blackPlayerId
  const thisPlayersTurn = playerId === (turn === "white" ? whitePlayerId : blackPlayerId)

  if (!youArePlaying || !thisPlayersTurn) {
    return null
  }

  const isOpponent = playerId !== yourPlayerId

  return (
    <div className="flex h-20 items-center bg-zinc-700 p-2">{isOpponent ? "Waiting for opponent" : "Your turn"}</div>
  )
}
