import { useGameStore } from "@/useGameStore"
import { Cross1Icon, InfoCircledIcon } from "@radix-ui/react-icons"
import { useState } from "react"

export function WelcomeMessage() {
  const [hidden, hide] = useState(false)
  const welcomeMessage = useGameStore((state) => state.game.welcomeMessage[state.yourPlayerId])

  if (!welcomeMessage || hidden) {
    return null
  }

  return (
    <div className="m-2 flex items-center rounded-lg bg-blue-100 p-2 pr-0 text-blue-900">
      <InfoCircledIcon className="mr-2 h-8 w-8" />

      <div>{welcomeMessage}</div>

      <button className="p-2 px-3" onClick={() => hide(true)}>
        <Cross1Icon />
      </button>
    </div>
  )
}
