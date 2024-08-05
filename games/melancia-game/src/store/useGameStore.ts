import * as RAPIER from "@dimforge/rapier2d-compat"
import { Player, PlayerId } from "dusk-games-sdk"
import { create } from "zustand"
import { subscribeWithSelector } from "zustand/middleware"
import { immer } from "zustand/middleware/immer"

import { CONTAINER_HEIGHT, FRUIT_SIZES } from "@/constants"
import { GameState } from "@/logic"
import { Fruit, FruitType } from "@/types"

type State = {
  yourPlayerId?: PlayerId
  game: GameState
  playerDetails: Record<PlayerId, Player>
  worlds: Record<PlayerId, RAPIER.World>
  fruits: Record<PlayerId, Record<number, Fruit>>
  dropPosition: number
  points: number
  nextFruit: FruitType
  random: () => number
}

type Actions = {
  addFruit: () => void
  moveLeft: () => void
  moveRight: () => void
  updateWorldforPlayer: (playerId: PlayerId) => void
  stressTest: () => void
  mergeFruit(playerId: PlayerId, fruit1: number, fruit2: number): void
}

export const useGameStore = create<State & Actions>()(
  immer(
    subscribeWithSelector((set, get) => ({
      game: {
        players: {},
        currentScreen: "lobby",
        activePlayerIds: [],
        seed: "",
        gameStartedAt: Infinity,
        timeRemaining: 0,
        gameOver: false,
      },
      playerDetails: {},
      worlds: {},
      fruits: {},
      dropPosition: 80,
      points: 0,
      nextFruit: FruitType.Cherry,
      random: Math.random,
      addFruit: () => {
        const yourPlayerId = get().yourPlayerId
        if (!yourPlayerId) {
          return
        }

        if (!get().game.players[yourPlayerId].dropReady) {
          return
        }

        if (get().game.gameOver) {
          return
        }

        const world = get().worlds[yourPlayerId]
        const type = get().nextFruit
        try {
          const { rigidBody, collider } = createRigidBodyAndCollider(world, type, {
            // bit of randomness so they don't stack perfectly
            x: get().dropPosition + Math.random(),
            y: 0,
          })
          const fruit = { type, rigidBody: rigidBody }
          set((state) => {
            state.fruits[yourPlayerId][collider.handle] = fruit
            state.nextFruit = Math.floor(get().random() * 5)
          })
          const fruits = Object.values(get().fruits[yourPlayerId]).map((fruit) => ({
            type: fruit.type,
            position: { x: fruit.rigidBody.translation().x, y: fruit.rigidBody.translation().y },
            rotation: fruit.rigidBody.rotation(),
            linvel: fruit.rigidBody.linvel(),
            angvel: fruit.rigidBody.angvel(),
          }))
          Dusk.actions.updateFruits({ fruits })
        } catch (e) {
          console.error(e)
        }
      },
      stressTest: () => {
        const yourPlayerId = get().yourPlayerId
        if (!yourPlayerId) {
          return
        }
        const world = get().worlds[yourPlayerId]
        for (let i = 0; i < 100; i++) {
          const type = FruitType.Cherry
          const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(
            get().dropPosition,
            CONTAINER_HEIGHT + i * -14,
          )
          const rigidBody = world.createRigidBody(rigidBodyDesc)
          rigidBody.enableCcd(true)

          const colliderDesc = RAPIER.ColliderDesc.ball(FRUIT_SIZES[type])
            .setRestitution(0.4)
            .setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS)
          const collider = world.createCollider(colliderDesc, rigidBody)

          const fruit = { type, rigidBody: rigidBody }
          set((state) => {
            state.fruits[yourPlayerId][collider.handle] = fruit
          })

          const fruits = Object.values(get().fruits[yourPlayerId]).map((fruit) => ({
            type: fruit.type,
            position: { x: fruit.rigidBody.translation().x, y: fruit.rigidBody.translation().y },
            rotation: fruit.rigidBody.rotation(),
            linvel: fruit.rigidBody.linvel(),
            angvel: fruit.rigidBody.angvel(),
          }))
          Dusk.actions.updateFruits({ fruits })
        }
      },
      moveLeft: () => {
        set((state) => {
          state.dropPosition = Math.max(14, state.dropPosition - 2)
        })
      },
      moveRight: () => {
        set((state) => {
          state.dropPosition = Math.min(172, state.dropPosition + 2)
        })
      },
      updateWorldforPlayer: (playerId) => {
        const world = get().worlds[playerId]
        world.forEachRigidBody((rigidBody) => {
          world.removeRigidBody(rigidBody)
        })

        const player = get().game.players[playerId]

        if (!player.active) {
          return
        }

        const fruits: Record<number, { type: FruitType; rigidBody: RAPIER.RigidBody }> = {}
        for (const fruit of player.fruits) {
          const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
            .setTranslation(fruit.position.x, fruit.position.y)
            .setRotation(fruit.rotation)
            .setLinvel(fruit.linvel.x, fruit.linvel.y)
            .setAngvel(fruit.angvel)
          const rigidBody = world.createRigidBody(rigidBodyDesc)

          const colliderDesc = RAPIER.ColliderDesc.ball(FRUIT_SIZES[fruit.type])
            .setRestitution(0.4)
            .setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS)
          const collider = world.createCollider(colliderDesc, rigidBody)

          fruits[collider.handle] = { type: fruit.type, rigidBody: rigidBody }
        }
        set((state) => {
          state.fruits[playerId] = fruits
        })
      },
      mergeFruit: (playerId, fruit1, fruit2) => {
        const world = get().worlds[playerId]

        const rigidBody1 = get().fruits[playerId][fruit1].rigidBody
        const rigidBody2 = get().fruits[playerId][fruit2].rigidBody

        const position1 = rigidBody1.translation()
        const position2 = rigidBody2.translation()

        const center = {
          x: (position1.x + position2.x) / 2,
          y: (position1.y + position2.y) / 2,
        }

        const type = Math.min(get().fruits[playerId][fruit1].type + 1, 9)

        const { rigidBody, collider } = createRigidBodyAndCollider(world, type, center)

        const fruit = { type, rigidBody: rigidBody, merged: true }
        set((state) => {
          if (playerId === get().yourPlayerId) {
            state.points += 2 ** type
          }
          state.fruits[playerId][collider.handle] = fruit
          delete state.fruits[playerId][fruit1]
          delete state.fruits[playerId][fruit2]
        })

        world.removeRigidBody(rigidBody1)
        world.removeRigidBody(rigidBody2)
      },
    })),
  ),
)

function createRigidBodyAndCollider(world: RAPIER.World, type: FruitType, position: { x: number; y: number }) {
  const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(position.x, position.y)
  const rigidBody = world.createRigidBody(rigidBodyDesc)
  rigidBody.enableCcd(true)

  const colliderDesc = RAPIER.ColliderDesc.ball(FRUIT_SIZES[type])
    .setRestitution(0.4)
    .setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS)
  const collider = world.createCollider(colliderDesc, rigidBody)

  return { rigidBody, collider }
}
