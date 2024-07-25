import { useState } from "react"

import { useGameStore } from "@/store/useGameStore"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog"

export function GameOverPopup() {
  const gameOverReason = useGameStore((state) => state.game.gameOverReason)
  const turn = useGameStore((state) => state.game.turn)
  const [open, setOpen] = useState(true)

  return (
    <AlertDialog open={!!gameOverReason && open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Game Over</AlertDialogTitle>
          <div className="flex flex-col items-center gap-4">
            {gameOverReason === "checkmate" && `${turn} wins!`}
            {gameOverReason !== "checkmate" && gameOverReason}
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Show board</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
