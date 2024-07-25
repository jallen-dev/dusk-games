import { Move, PieceSymbol } from "chess.js"
import { Chessground } from "chessground"
import { Api } from "chessground/api"
import { Key, Piece } from "chessground/types"
import { useEffect, useRef } from "react"

import { chess } from "@/chess"
import { useGameStore } from "@/store/useGameStore"

export function Board() {
  const ref = useRef<HTMLDivElement>(null)
  const chessground = useRef<Api>(null!)

  const lastMove = useGameStore((state) => state.game.lastMove)
  const yourPlayerId = useGameStore((state) => state.yourPlayerId)
  const whitePlayerId = useGameStore((state) => state.game.whitePlayerId)
  const blackPlayerId = useGameStore((state) => state.game.blackPlayerId)
  const fen = useGameStore((state) => state.game.fen)

  const color = yourPlayerId === whitePlayerId ? "w" : yourPlayerId === blackPlayerId ? "b" : null

  useEffect(() => {
    if (!ref.current) {
      return
    }

    if (!chessground.current) {
      chessground.current = Chessground(ref.current, {
        movable: {
          free: false,
        },
        orientation: color === "b" ? "black" : "white",
        viewOnly: color === null,
        events: {
          move: (orig, dest, capturedPiece) => {
            // TODO: check if this is a promotion and display a popup
            // const promotion =
            //   chess.moves({ verbose: true }).filter((move) => move.from === orig && move.to === dest)[0].promotion !==
            //   undefined
            chess.move({ from: orig, to: dest, promotion: "q" })
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
              orig,
              dest,
              capturedPiece: translatePieceSymbol(capturedPiece),
              fen: chess.fen(),
              gameOverReason,
            })
          },
        },
      })
    }
  }, [color])

  useEffect(() => {
    chess.load(fen)
    const dests = chess.turn() === color ? movesToDests(chess.moves({ verbose: true })) : undefined

    if (chessground.current) {
      chessground.current.set({
        movable: { dests },
        check: chess.isCheck() ? (chess.turn() === "w" ? "white" : "black") : undefined,
        fen: chess.fen(),
        lastMove,
      })
    }
  }, [lastMove, color, fen])

  return <div ref={ref} className="aspect-square w-full" />
}

function movesToDests(moves: Move[]) {
  return moves.reduce((acc, move) => {
    const { from, to } = move
    acc.set(from, acc.get(from) || [])
    acc.get(from)!.push(to)
    return acc
  }, new Map<Key, Key[]>())
}

function translatePieceSymbol(piece?: Piece): PieceSymbol | undefined {
  if (!piece) {
    return
  }

  switch (piece.role) {
    case "pawn":
      return "p"
    case "knight":
      return "n"
    case "bishop":
      return "b"
    case "rook":
      return "r"
    case "queen":
      return "q"
    case "king":
      return "k"
  }
}
