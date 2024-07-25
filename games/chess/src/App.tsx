import { Key } from "chessground/types"
import { aiMove, status } from "js-chess-engine"
import { useEffect } from "react"

import { chess } from "./chess"
import { COMPUTER_DELAY } from "./constants"
import { playSound } from "./playSound"
import { Lobby } from "./screens/Lobby"
import { Play } from "./screens/Play"
import { useGameStore } from "./store/useGameStore"
import { GameScreen } from "./types"

// prevent accidentally moving twice in the same turn due to multiple onChange events (player join/leave, etc.)
let takingTurn = false

function App() {
  const currentScreen = useGameStore((state) => state.game.currentScreen)

  useEffect(() => {
    Dusk.initClient({
      onChange: ({ game, yourPlayerId, action }) => {
        useGameStore.setState({ game, yourPlayerId })

        if (game.currentScreen !== "play") {
          return
        }

        if (action?.name === "move") {
          if (action.params.capturedPiece) {
            playSound("capture")
          } else {
            playSound("move")
          }
        }

        if (
          (!game.blackPlayerId && game.turn === "black" && game.whitePlayerId === yourPlayerId) ||
          (!game.whitePlayerId && game.turn === "white" && game.blackPlayerId === yourPlayerId)
        ) {
          if (takingTurn || game.gameOverReason) {
            return
          }
          takingTurn = true
          // this setTimeout is to break out of the current call stack because Dusk prevents calling actions from within onChange
          setTimeout(() => {
            performAiMove(game.fen)
          }, 0)
        }
      },
    })
  }, [])

  const Screen = SCREEN[currentScreen]

  return <Screen />
}

const SCREEN: Record<GameScreen, () => React.JSX.Element | null> = {
  play: Play,
  lobby: Lobby,
}

export default App

function performAiMove(fen: string) {
  const start = Date.now()
  const ai = aiMove(status(fen), 2)
  const [from, to] = Object.entries<Key>(ai)[0]
  const end = Date.now()
  const duration = end - start

  // simulate the computer player taking time to think
  setTimeout(() => {
    const move = chess.move({ from: from.toLowerCase(), to: to.toLowerCase() })
    const gameOverReason = chess.isCheckmate()
      ? "checkmate"
      : chess.isStalemate()
        ? "stalemate"
        : chess.isInsufficientMaterial()
          ? "insufficient material"
          : chess.isThreefoldRepetition()
            ? "threefold repetition"
            : undefined
    Dusk.actions.move({
      orig: move.from,
      dest: move.to,
      capturedPiece: move.captured,
      fen: chess.fen(),
      gameOverReason,
    })
    takingTurn = false
  }, COMPUTER_DELAY - duration)
}
