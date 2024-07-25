import { CheckIcon, EyeOpenIcon } from "@radix-ui/react-icons"
import clsx from "clsx"

import { ColorPicker } from "@/components/ColorPicker"
import { useGameStore } from "@/store/useGameStore"

export function Lobby() {
  const yourPlayerId = useGameStore((state) => state.yourPlayerId) ?? ""
  const players = useGameStore((state) => state.game.players)
  const playing = players[yourPlayerId]?.playing
  const ready = players[yourPlayerId]?.ready

  const otherPlayerId = Object.keys(players).filter((playerId) => playerId !== yourPlayerId)

  if (!yourPlayerId) {
    return <div className="flex flex-col items-center gap-8 p-4">Waiting for players to ready up...</div>
  }

  return (
    <div className="flex flex-col items-center gap-8 p-4">
      {playing ? (
        <>
          <p>
            You're playing against{" "}
            {otherPlayerId.length ? Dusk.getPlayerInfo(otherPlayerId[0]).displayName : "the computer"}
          </p>
          <ColorPicker />
        </>
      ) : (
        <button className="rounded-lg bg-blue-600 p-4" onClick={() => Dusk.actions.joinGame()}>
          Join game
        </button>
      )}
      {playing && (
        <>
          <button
            className={clsx("flex items-center justify-center gap-2 rounded-lg p-4", {
              "bg-green-600": ready,
              "bg-red-600": !ready,
            })}
            onClick={() => Dusk.actions.toggleReady()}
          >
            <CheckIcon />
            Ready
          </button>
          <button className="flex items-center justify-center gap-2" onClick={() => Dusk.actions.specateGame()}>
            <EyeOpenIcon />
            Just watch
          </button>
        </>
      )}
    </div>
  )
}
