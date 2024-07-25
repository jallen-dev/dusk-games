import clsx from "clsx"

import bK from "@/assets/pieces/bK.svg"
import wK from "@/assets/pieces/wK.svg"
import wbK from "@/assets/pieces/wbK.svg"
import { useGameStore } from "@/store/useGameStore"

export function ColorPicker() {
  const yourPlayerId = useGameStore((state) => state.yourPlayerId) ?? ""
  const preference = useGameStore((state) => state.game.players[yourPlayerId].preference)

  return (
    <div className="flex w-full gap-4">
      <button
        className={clsx("grow basis-0 rounded-lg p-2", {
          "bg-blue-600": preference === "black",
          "bg-slate-600": preference !== "black",
        })}
        onClick={() => Dusk.actions.chooseColor({ color: "black" })}
      >
        <img src={bK} className="w-full" />
      </button>
      <button
        className={clsx("grow basis-0 rounded-lg p-2", {
          "bg-blue-600": preference === "none",
          "bg-slate-600": preference !== "none",
        })}
        onClick={() => Dusk.actions.chooseColor({ color: "none" })}
      >
        <img src={wbK} className="w-full" />
      </button>
      <button
        className={clsx("grow basis-0 rounded-lg p-2", {
          "bg-blue-600": preference === "white",
          "bg-slate-600": preference !== "white",
        })}
        onClick={() => Dusk.actions.chooseColor({ color: "white" })}
      >
        <img src={wK} className="w-full" />
      </button>
    </div>
  )
}
