import { useGameStore } from "@/useGameStore"
import { ClockIcon, ReloadIcon } from "@radix-ui/react-icons"

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog"
import { Button } from "./ui/button"

export function SaveProgressPrompt() {
  const yourPlayerId = useGameStore((state) => state.yourPlayerId)
  const level = useGameStore((state) => state.game.persisted[yourPlayerId].level)
  const dismissedSaveProgressPrompt = useGameStore(
    (state) => state.game.persisted[yourPlayerId].dismissedSaveProgressPrompt,
  )

  if (level < 5) {
    return null
  }

  return (
    <AlertDialog open={!dismissedSaveProgressPrompt}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>You can come back later</AlertDialogTitle>
          <AlertDialogDescription>
            <div className="flex flex-col items-center gap-4">
              <div className="flex max-w-52 items-center gap-4">
                <ReloadIcon className="h-8 w-8" /> <div>Your progress is automatically saved</div>
              </div>
              <div className="flex max-w-52 items-center gap-4">
                <ClockIcon className="h-12 w-12" /> <div>Auto tappers work even while you are away</div>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            onClick={() => {
              Dusk.actions.dismissSaveProgressPrompt()
            }}
          >
            Got it!
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
