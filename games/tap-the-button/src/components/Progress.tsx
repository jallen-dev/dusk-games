import { Progress as ShadCNProgress } from "@/components/ui/progress"
import { LEVEL_THRESHOLDS } from "@/constants"
import { playSound } from "@/playSound"
import { useGameStore } from "@/useGameStore"
import { useRef } from "react"

import { Reveal } from "./Reveal"

export function Progress() {
  const yourPlayerId = useGameStore((state) => state.yourPlayerId)
  const { taps, level, skillPoints } = useGameStore((state) => state.game.persisted[yourPlayerId])
  const prevLevel = useRef<number>()

  if (prevLevel.current && level > prevLevel.current) {
    playSound(3)
  }
  prevLevel.current = level

  const start = LEVEL_THRESHOLDS[level - 1]
  const end = LEVEL_THRESHOLDS[level]
  const value = Math.min(100, ((taps - start) / (end - start)) * 100)

  return (
    <div className="flex w-full flex-col p-2">
      <div className="flex justify-between">
        <div className="text-xl">
          Level {level} {end === Infinity && <span className="text-sm">(max)</span>}
        </div>
        <div>next at: {end.toLocaleString()}</div>
      </div>
      <ShadCNProgress value={value} />
      <Reveal show={level > 1}>Skill points: {skillPoints}</Reveal>
    </div>
  )
}
