import { useGameStore } from "@/useGameStore"

import { Reveal } from "./Reveal"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"

export function SuperTaps() {
  const yourPlayerId = useGameStore((state) => state.yourPlayerId)
  const level = useGameStore((state) => state.game.persisted[yourPlayerId].level)
  const taps = useGameStore((state) => state.game.persisted[yourPlayerId].taps)
  const superTaps = useGameStore((state) => state.game.persisted[yourPlayerId].superTaps)

  const totalSuperTaps = Math.floor(Math.cbrt(taps / 1_000))
  const unclaimedSuperTaps = totalSuperTaps - superTaps

  return (
    <Reveal show={level > 5 || superTaps > 0}>
      <div className="flex justify-between gap-2">
        <div>
          <div>Super Taps: {superTaps}</div>
          <div>(giving +{superTaps * 10}% boost)</div>
        </div>
        {unclaimedSuperTaps > 0 && (
          <Dialog>
            <DialogTrigger className="rounded-lg bg-blue-600 p-1 px-2 text-white">
              Claim {unclaimedSuperTaps} Super Taps
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Start over with +{unclaimedSuperTaps} Super Taps?</DialogTitle>
                <DialogDescription>
                  <div className="text-left">
                    You are about to start over from the beginning with a total of {totalSuperTaps} Super Taps.
                    <div>Each super tap gives you a +10% boost.</div>
                    <div>Are you sure you want to continue?</div>
                  </div>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <div className="flex justify-end gap-8">
                  <DialogClose>Cancel</DialogClose>
                  <Button
                    variant={"destructive"}
                    className=""
                    onClick={() => {
                      Dusk.actions.claimSuperTaps()
                    }}
                  >
                    Yes, start over
                  </Button>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </Reveal>
  )
}
