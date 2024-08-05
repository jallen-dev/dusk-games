import { useEffect } from "react"

export function GameOver() {
  useEffect(() => {
    const timeout = setTimeout(() => {
      Dusk.showGameOverPopUp()
    }, 1000)
    return () => clearTimeout(timeout)
  }, [])

  return <div>Game Over</div>
}
