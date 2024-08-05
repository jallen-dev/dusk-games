import { useGameStore } from "@/store/useGameStore"

export function Clock() {
  const timeRemaining = useGameStore((state) => state.game.timeRemaining)

  const minutes = Math.floor(timeRemaining / 60_000)
  const seconds = Math.floor((timeRemaining % 60_000) / 1000)

  return (
    <div className="flex gap-3">
      <span>Time:</span>
      <span>
        {minutes} : {seconds.toString().padStart(2, "0")}
      </span>
    </div>
  )
}
