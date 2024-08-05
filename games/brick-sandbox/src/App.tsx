import { memo, useEffect, useState } from "react"

import { Canvas } from "@react-three/fiber"
import { Grid, Html, OrbitControls, PivotControls } from "@react-three/drei"

import * as THREE from "three"
import { useGameStore } from "./store/useGameStore.ts"

import { Brick as BrickModel } from "@/components/Brick.tsx"
import { Avatar } from "./components/Avatar.tsx"
import { BrickList } from "./components/BrickList.tsx"
import { ColorPicker } from "./components/ColorPicker.tsx"

function App() {
  useEffect(() => {
    Dusk.initClient({
      onChange: ({ game, yourPlayerId }) => {
        useGameStore.setState({ game, yourPlayerId })
      },
    })
  }, [])

  return (
    <>
      <Canvas camera={{ position: [4, 4, 4] }}>
        <Bricks />
        <OrbitControls enabled={true} makeDefault />
        <Grid infiniteGrid cellSize={1} />
        <ambientLight intensity={0.25} />
        <directionalLight position={[0, 10, 5]} intensity={1} />
      </Canvas>
      <BrickList />
      <div className="absolute top-0 left-0 p-4">
        <SelectedBrickColorPicker />
      </div>
    </>
  )
}

function SelectedBrickColorPicker() {
  const yourPlayerId = useGameStore((state) => state.yourPlayerId)
  const selectedBrickIds = useGameStore(
    (state) => state.game.selectedBrickIds[yourPlayerId ?? ""]
  )
  const selectedBrick = useGameStore(
    (state) => state.game.bricks[selectedBrickIds ? selectedBrickIds[0] : ""]
  )

  if (!selectedBrick) {
    return null
  }

  if (selectedBrickIds.length > 1) {
    // TODO: Implement multiple brick selection
    return <div>Multiple bricks selected</div>
  }

  return (
    <ColorPicker
      color={selectedBrick.color}
      onColorSelected={(color) => {
        Dusk.actions.changeBrickColor({
          brickId: selectedBrickIds[0],
          color,
        })
      }}
    />
  )
}

function Bricks() {
  const brickIds = useGameStore((state) => Object.keys(state.game.bricks))

  return (
    <>
      {brickIds.map((brickId) => (
        <Brick key={brickId} brickId={brickId} />
      ))}
    </>
  )
}

export default App

const Brick = memo(function Brick({ brickId }: { brickId: string }) {
  const [dragged, setDragged] = useState(false)
  const [active, setActive] = useState(false)
  const start = () => setDragged(true)
  const end = () => setDragged(false)
  const missed = () => {
    if (dragged || !active) {
      return
    }
    Dusk.actions.deselectBrick({ brickId })
    setActive(false)
  }
  const [matrix] = useState(() => new THREE.Matrix4())
  const [oldPosition] = useState(() => new THREE.Vector3())
  const [newPosition] = useState(() => new THREE.Vector3())

  const yourPlayerId = useGameStore((state) => state.yourPlayerId)

  const color = useGameStore((state) => state.game.bricks[brickId].color)
  const brickType = useGameStore((state) => state.game.bricks[brickId].type)
  const controlledBy = useGameStore(
    (state) => state.game.bricks[brickId].controlledBy
  )

  useEffect(() => {
    const unsubscribe = useGameStore.subscribe(
      (state) => state.game.bricks[brickId]?.position,
      (position) => {
        matrix.setPosition(
          new THREE.Vector3(position[0], position[1] * 1.21, position[2])
        )
      },
      { fireImmediately: true }
    )

    return unsubscribe
  }, [brickId, matrix])
  return (
    <PivotControls
      disableScaling
      disableRotations
      autoTransform={false}
      matrix={matrix}
      enabled={active}
      onDragStart={start}
      onDragEnd={end}
      onDrag={throttle((draggedMatrix) => {
        oldPosition.setFromMatrixPosition(matrix)
        newPosition.setFromMatrixPosition(draggedMatrix)
        newPosition.round()
        if (!oldPosition.equals(newPosition)) {
          Dusk.actions.setPosition({
            brickId,
            position: [newPosition.x, newPosition.y, newPosition.z],
          })
        }
      }, 100)}
      onPointerMissed={missed}
      depthTest={false}
      axisColors={["#bb726f", "#6c9d8d", "#8c83d3"]}
      scale={2}
      anchor={[0, -1, 0]}
    >
      <group
        onClick={() => {
          if (dragged) {
            return
          }

          if (active) {
            Dusk.actions.deselectBrick({ brickId })
          } else {
            Dusk.actions.selectBrick({ brickId })
          }
          setActive(!active)
        }}
      >
        <BrickModel scale={12.6} color={color} brickType={brickType} />
      </group>
      {controlledBy && controlledBy !== yourPlayerId && (
        <Html className="w-16">
          <Avatar playerId={controlledBy} />
        </Html>
      )}
    </PivotControls>
  )
})

const throttle = (fn: Function, wait: number = 300) => {
  let inThrottle: boolean,
    lastFn: ReturnType<typeof setTimeout>,
    lastTime: number

  return function (this: any) {
    const context = this,
      args = arguments
    if (!inThrottle) {
      fn.apply(context, args)
      lastTime = Date.now()
      inThrottle = true
    } else {
      clearTimeout(lastFn)
      lastFn = setTimeout(
        () => {
          if (Date.now() - lastTime >= wait) {
            fn.apply(context, args)
            lastTime = Date.now()
          }
        },
        Math.max(wait - (Date.now() - lastTime), 0)
      )
    }
  }
}
