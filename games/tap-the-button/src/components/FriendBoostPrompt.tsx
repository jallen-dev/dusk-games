import placeholder from "@/assets/avatar-placeholder.png"
import { useGameStore } from "@/useGameStore"
import { DoubleArrowUpIcon } from "@radix-ui/react-icons"
import { PlayerId } from "dusk-games-sdk"

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog"
import { Button } from "./ui/button"

export function FriendBoostPrompt() {
  const playerIds = useGameStore((state) => state.game.playerIds)
  const yourPlayerId = useGameStore((state) => state.yourPlayerId)
  const level = useGameStore((state) => state.game.persisted[yourPlayerId].level)
  const dismissedFriendBoostPrompt = useGameStore(
    (state) => state.game.persisted[yourPlayerId].dismissedFriendBoostPrompt,
  )

  const otherPlayerIds = playerIds.filter((id) => id !== yourPlayerId)

  if (level < 4) {
    return null
  }

  if (playerIds.length > 2) {
    return (
      <AlertDialog open={!dismissedFriendBoostPrompt}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>You're getting a boost from your friends!</AlertDialogTitle>
            <AlertDialogDescription>
              <FriendBoostIllustration playerIds={otherPlayerIds} />
              The more friends you play with, the faster you'll level up. Get your friends to join you!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              onClick={() => {
                Dusk.actions.dismissFriendBoostPrompt()
              }}
            >
              Cool!
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }

  if (playerIds.length > 1) {
    return (
      <AlertDialog open={!dismissedFriendBoostPrompt}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>You're getting a boost from your friend!</AlertDialogTitle>
            <AlertDialogDescription>
              <FriendBoostIllustration playerIds={otherPlayerIds} />
              You'll get an even larger boost if you play with more people!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              onClick={() => {
                Dusk.actions.dismissFriendBoostPrompt()
              }}
            >
              Cool!
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }

  return (
    <AlertDialog open={!dismissedFriendBoostPrompt}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Get boosts from your friends</AlertDialogTitle>
          <AlertDialogDescription>
            <FriendBoostIllustration playerIds={[undefined as unknown as string]} />
            If you play with other people, you'll get a boost from each of them. Invite your friends to play with you!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            onClick={() => {
              Dusk.actions.dismissFriendBoostPrompt()
            }}
          >
            Cool!
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function Avatar({ playerId }: { playerId?: PlayerId }) {
  if (!playerId) {
    return <img className="aspect-square w-full" src={placeholder} alt="a friend" />
  }
  const playerInfo = Dusk.getPlayerInfo(playerId)
  return (
    <div className="relative aspect-square w-full">
      <img className="absolute h-full w-full" src={placeholder} alt={playerInfo.displayName} />
      <img className="absolute h-full w-full" src={playerInfo.avatarUrl} alt={playerInfo.displayName} />
    </div>
  )
}

function FriendBoostIllustration({ playerIds }: { playerIds: PlayerId[] }) {
  return (
    <div className="flex flex-row flex-wrap items-center justify-center gap-4">
      {playerIds.map((playerId) => (
        <div key={playerId} className="flex w-full max-w-20 items-center">
          <DoubleArrowUpIcon className="h-10 w-10 text-green-500" />
          <div className="w-full max-w-20">
            <Avatar playerId={playerId} />
          </div>
        </div>
      ))}
    </div>
  )
}
