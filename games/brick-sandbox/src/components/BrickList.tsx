import roundLqBrick1x1Round from "@/assets/brick-previews/round-lq-brick-1x1-round.png"
import roundLqBrick1x1 from "@/assets/brick-previews/round-lq-brick-1x1.png"
import roundLqBrick1x2 from "@/assets/brick-previews/round-lq-brick-1x2.png"
import roundLqBrick1x4 from "@/assets/brick-previews/round-lq-brick-1x4.png"
import roundLqBrick1x6 from "@/assets/brick-previews/round-lq-brick-1x6.png"
import roundLqBrick1x8 from "@/assets/brick-previews/round-lq-brick-1x8.png"
import roundLqBrick2x2 from "@/assets/brick-previews/round-lq-brick-2x2.png"
import roundLqBrick2x4 from "@/assets/brick-previews/round-lq-brick-2x4.png"
import roundLqBrick2x6 from "@/assets/brick-previews/round-lq-brick-2x6.png"
import roundLqBrick2x8 from "@/assets/brick-previews/round-lq-brick-2x8.png"
import roundLqBrickCorner from "@/assets/brick-previews/round-lq-brick-corner.png"

import { BrickType } from "@/types"
import { PlusCircledIcon, MinusCircledIcon } from "@radix-ui/react-icons"
import { useState } from "react"

export function BrickList() {
  const [open, setOpen] = useState(false)

  if (!open) {
    return (
      <div className="absolute top-0 right-0 p-2">
        <button onClick={() => setOpen(true)}>
          <div className="flex gap-2 items-center">
            <PlusCircledIcon /> Add brick
          </div>
        </button>
      </div>
    )
  }
  return (
    <div className="absolute top-0 right-0 p-2">
      <button onClick={() => setOpen(false)}>
        <div className="flex gap-2 items-center">
          <MinusCircledIcon /> Close
        </div>
      </button>
      {Object.entries(BRICKS).map(([brickType, { preview, description }]) => (
        <Brick
          key={brickType}
          preview={preview}
          description={description}
          onClick={() => {
            Dusk.actions.addBrick({ brickType })
            setOpen(false)
          }}
        />
      ))}
    </div>
  )
}

function Brick({
  preview,
  description,
  onClick,
}: {
  preview: string
  description: string
  onClick: () => void
}) {
  return (
    <div className="flex items-center space-x-2">
      <button className="flex gap-2" onClick={onClick}>
        <img src={preview} alt="brick preview" className="w-8 h-8" />
        {description}
      </button>
    </div>
  )
}
const BRICKS: Record<BrickType, { preview: string; description: string }> = {
  [BrickType.RoundBrick1x1Round]: {
    preview: roundLqBrick1x1Round,
    description: "1x1 Round",
  },
  [BrickType.RoundBrick1x1]: { preview: roundLqBrick1x1, description: "1x1" },
  [BrickType.RoundBrick1x2]: { preview: roundLqBrick1x2, description: "1x2" },
  [BrickType.RoundBrick1x4]: { preview: roundLqBrick1x4, description: "1x4" },
  [BrickType.RoundBrick1x6]: { preview: roundLqBrick1x6, description: "1x6" },
  [BrickType.RoundBrick1x8]: { preview: roundLqBrick1x8, description: "1x8" },
  [BrickType.RoundBrick2x2]: { preview: roundLqBrick2x2, description: "2x2" },
  [BrickType.RoundBrick2x4]: { preview: roundLqBrick2x4, description: "2x4" },
  [BrickType.RoundBrick2x6]: { preview: roundLqBrick2x6, description: "2x6" },
  [BrickType.RoundBrick2x8]: { preview: roundLqBrick2x8, description: "2x8" },
  [BrickType.RoundBrickCorner]: {
    preview: roundLqBrickCorner,
    description: "Corner",
  },
}
