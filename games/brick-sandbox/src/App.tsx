import { useEffect, useState } from "react"

import { Canvas } from "@react-three/fiber"
import { Grid, OrbitControls, PivotControls } from "@react-three/drei"

import * as THREE from "three"
import { useGameStore } from "./store/useGameStore.ts"

import { Model } from "@/bricks/Round-lq-brick-2x2.tsx"

function App() {
  useEffect(() => {
    Dusk.initClient({
      onChange: ({ game, yourPlayerId }) => {
        useGameStore.setState({ game, yourPlayerId })
      },
    })
  }, [])

  return (
    <Canvas camera={{ position: [4, 4, 4] }}>
      <Model scale={12.6} color="red"></Model>
      <Movable>
        <Model scale={12.61}></Model>
      </Movable>
      <OrbitControls enabled={false} />
      <Grid infiniteGrid cellSize={1} />
      <ambientLight intensity={0.25} />
      <directionalLight position={[0, 10, 5]} intensity={1} />
    </Canvas>
  )
}

export default App

const oldPosition = new THREE.Vector3()
const newPosition = new THREE.Vector3()

function Movable(props) {
  const [dragged, setDragged] = useState(false)
  const [active, setActive] = useState(false)
  const start = () => setDragged(true)
  const end = () => setDragged(false)
  const missed = () => !dragged && setActive(false)
  const [matrix] = useState(() => new THREE.Matrix4())

  useGameStore.subscribe(
    (state) => state.game.position,
    (position) => {
      matrix.setPosition(
        new THREE.Vector3(position[0], position[1] * 1.21, position[2])
      )
    }
  )
  return (
    <PivotControls
      disableScaling
      disableRotations
      autoTransform={false}
      matrix={matrix}
      enabled={active}
      onDragStart={start}
      onDragEnd={end}
      onDrag={throttle((m) => {
        oldPosition.setFromMatrixPosition(m)
        newPosition.setFromMatrixPosition(m)
        newPosition.round()
        if (!oldPosition.equals(newPosition)) {
          Dusk.actions.setPosition([
            newPosition.x,
            newPosition.y,
            newPosition.z,
          ])
        }
      }, 100)}
      onPointerMissed={missed}
      depthTest={false}
      axisColors={["#bb726f", "#6c9d8d", "#8c83d3"]}
      scale={1}
      anchor={[0, -1, 0]}
    >
      <group onClick={() => !dragged && setActive(!active)} {...props} />
    </PivotControls>
  )
}

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
