import { Board } from "@/components/Board"
import { GameOverPopup } from "@/components/GameOverPopup"
import { PlayerDisplay } from "@/components/PlayerDisplay"
import { useGameStore } from "@/store/useGameStore"

export function Play() {
  const whitePlayerId = useGameStore((state) => state.game.whitePlayerId)
  const blackPlayerId = useGameStore((state) => state.game.blackPlayerId)
  const yourPlayerId = useGameStore((state) => state.yourPlayerId)
  const game = useGameStore((state) => state.game)

  if (!game.playerIds.length) {
    return null
  }

  const [top, bottom] = yourPlayerId === blackPlayerId ? [whitePlayerId, blackPlayerId] : [blackPlayerId, whitePlayerId]

  return (
    <div>
      <PlayerDisplay playerId={top} />
      <Board />
      <PlayerDisplay playerId={bottom} />
      <GameOverPopup />
    </div>
  )
}
