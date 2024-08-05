import { PlayerId } from "dusk-games-sdk"
import { useShallow } from "zustand/react/shallow"

import placeholder from "@/assets/avatar_placeholder.svg"
import { Background } from "@/components/pixi/Background"
import { Pixi } from "@/helpers/Pixi"
import { useGameStore } from "@/store/useGameStore"

export function Lobby() {
  return (
    <div>
      <PlayersReady />
      <Pixi.In>
        <Background />
      </Pixi.In>
    </div>
  )
}

function PlayersReady() {
  const playerIds = useGameStore(useShallow((state) => Object.keys(state.game.players)))
  const yourPlayerId = useGameStore((state) => state.yourPlayerId) ?? ""
  const ready = useGameStore((state) => state.game.players[yourPlayerId]?.ready)

  return (
    <div>
      <div className="flex w-screen flex-wrap justify-around gap-2 p-4">
        {playerIds.map((playerId) => (
          <Player key={playerId} playerId={playerId} />
        ))}
      </div>
      <div>
        {yourPlayerId && !ready && (
          <button
            className="fixed bottom-16 left-1/2 -translate-x-1/2 rounded-lg bg-green-600 p-4"
            onClick={() => Dusk.actions.ready()}
          >
            Ready!
          </button>
        )}
      </div>
    </div>
  )
}

function Player({ playerId }: { playerId: PlayerId }) {
  const details = useGameStore((state) => state.playerDetails[playerId])
  const ready = useGameStore((state) => state.game.players[playerId].ready)

  return (
    <div className="w-1/3 overflow-hidden">
      <div className="flex flex-col items-center gap-2 ">
        <div className="relative aspect-square w-full">
          <img className="absolute h-full w-full" src={placeholder} alt={details.displayName} />
          <img className="absolute h-full w-full" src={details.avatarUrl} alt={details.displayName} />
        </div>
        <div className="rounded-lg bg-slate-800 px-4 py-2">
          <h2 className="w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-center">
            {details.displayName}
          </h2>
          {ready ? <span className="text-green-600">Ready</span> : <span className="text-red-600">Not Ready</span>}
        </div>
      </div>
    </div>
  )
}
