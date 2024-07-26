import { useEffect } from "react"

import { Button } from "./components/Button.tsx"
import { FriendBoostPrompt } from "./components/FriendBoostPrompt.tsx"
import { Progress } from "./components/Progress.tsx"
import { SaveProgressPrompt } from "./components/SaveProgressPrompt.tsx"
import { Skills } from "./components/Skills.tsx"
import { TapCounter } from "./components/TapCounter.tsx"
import { WelcomeMessage } from "./components/WelcomeMessage.tsx"
import { taps } from "./components/interpolators.ts"
import { playSound } from "./playSound.ts"
import { useGameStore } from "./useGameStore.ts"

function App() {
  const game = useGameStore((state) => state.game)
  const yourPlayerId = useGameStore((state) => state.yourPlayerId)

  useEffect(() => {
    Dusk.initClient({
      onChange: ({ game, futureGame, yourPlayerId }) => {
        useGameStore.setState({ game, yourPlayerId })

        if (yourPlayerId && futureGame) {
          taps.update({ game: game.persisted[yourPlayerId].taps, futureGame: futureGame.persisted[yourPlayerId].taps })
        }
      },
    })
  }, [])

  useEffect(() => {
    if (!game.gameStartedAt) {
      Dusk.actions.setGameStartedAt(Date.now())
    }
  }, [game])

  if (!yourPlayerId) {
    return
  }

  return (
    <div className="flex h-screen w-screen flex-col items-center overflow-hidden bg-white pt-10">
      <WelcomeMessage />
      <TapCounter />
      <Progress />
      <Skills />
      <Button
        onClick={() => {
          playSound(Math.floor(Math.random() * 3))
          Dusk.actions.tap()
        }}
      >
        Tap
      </Button>
      <FriendBoostPrompt />
      <SaveProgressPrompt />
    </div>
  )
}
export default App
