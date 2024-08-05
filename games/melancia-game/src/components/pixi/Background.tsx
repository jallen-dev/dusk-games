import { TilingSprite, useApp, useTick } from "@pixi/react"
import { useRef } from "react"

import { ITilingSprite } from "@/types"

export function Background() {
  const app = useApp()
  const ref = useRef<ITilingSprite>(null)

  useTick((delta) => {
    if (ref.current) {
      ref.current.tilePosition.x -= delta / 4
      ref.current.tilePosition.y += delta / 2
    }
  })

  return (
    <TilingSprite
      ref={ref}
      tilePosition={{ x: 0, y: 0 }}
      width={app.screen.width}
      height={app.screen.height}
      image="background"
    />
  )
}
