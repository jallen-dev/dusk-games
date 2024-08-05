import * as RAPIER from "@dimforge/rapier2d-compat"
import { useTick } from "@pixi/react"
import { useRef } from "react"

import { useGameStore } from "@/store/useGameStore"

export function Physics() {
  const eventQueue = useRef(new RAPIER.EventQueue(true))
  useTick(() => {
    const worlds = useGameStore.getState().worlds
    const fruits = useGameStore.getState().fruits
    for (const [playerId, world] of Object.entries(worlds)) {
      if (!world || !eventQueue.current) {
        continue
      }

      try {
        world.step(eventQueue.current)
        eventQueue.current.drainCollisionEvents((handle1, handle2) => {
          const fruit1 = fruits[playerId][handle1]
          const fruit2 = fruits[playerId][handle2]
          if (fruit1 && fruit2 && fruit1.type === fruit2.type) {
            useGameStore.getState().mergeFruit(playerId, handle1, handle2)
          }
        })
      } catch (e) {
        // console.error(e)
      }
    }
  })

  return null
}
