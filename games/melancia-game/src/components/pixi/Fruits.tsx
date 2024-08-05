import { PlayerId } from "dusk-games-sdk"

import { useGameStore } from "@/store/useGameStore"

import { Fruit } from "./Fruit"

export function Fruits({ playerId }: { playerId: PlayerId }) {
  const fruits = useGameStore((state) => state.fruits[playerId])
  const world = useGameStore((state) => state.worlds[playerId])

  if (!fruits || !world) {
    return null
  }

  return Object.entries(fruits).map(([handle, fruit]) => {
    return (
      <Fruit
        key={handle}
        type={fruit.type}
        rigidBodyHandle={fruit.rigidBody.handle}
        world={world}
        playerId={playerId}
        merged={fruit.merged}
      />
    )
  })
}
