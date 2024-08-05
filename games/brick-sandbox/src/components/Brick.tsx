/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.4.1 round-lq-brick-2x2.glb -t 
*/

import * as THREE from "three"
import { useGLTF } from "@react-three/drei"
import { GLTF } from "three-stdlib"
import { BrickType, Color } from "@/types"

type GLTFResult = GLTF & {
  nodes: Record<string, THREE.Mesh>
  materials: {
    colormap: THREE.MeshStandardMaterial
  }
}

export function Brick(
  props: JSX.IntrinsicElements["group"] & {
    brickType: BrickType
    color?: Color
  }
) {
  const { nodes } = useGLTF(`/${BRICKS[props.brickType]}.glb`) as GLTFResult
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes[`${BRICKS[props.brickType]}_1`].geometry}>
        <meshStandardMaterial
          color={
            props.color !== undefined ? COLOR_NAMES[props.color] : "yellow"
          }
        />
      </mesh>
    </group>
  )
}
const BRICKS: Record<BrickType, string> = {
  [BrickType.RoundBrick1x1Round]: "round-lq-brick-1x1-round",
  [BrickType.RoundBrick1x1]: "round-lq-brick-1x1",
  [BrickType.RoundBrick1x2]: "round-lq-brick-1x2",
  [BrickType.RoundBrick1x4]: "round-lq-brick-1x4",
  [BrickType.RoundBrick1x6]: "round-lq-brick-1x6",
  [BrickType.RoundBrick1x8]: "round-lq-brick-1x8",
  [BrickType.RoundBrick2x2]: "round-lq-brick-2x2",
  [BrickType.RoundBrick2x4]: "round-lq-brick-2x4",
  [BrickType.RoundBrick2x6]: "round-lq-brick-2x6",
  [BrickType.RoundBrick2x8]: "round-lq-brick-2x8",
  [BrickType.RoundBrickCorner]: "round-lq-brick-corner",
}

for (const filename of Object.values(BRICKS)) {
  useGLTF.preload(`/${filename}.glb`)
}

const COLOR_NAMES: Record<Color, string> = {
  [Color.Red]: "red",
  [Color.Green]: "green",
  [Color.Blue]: "blue",
  [Color.Yellow]: "yellow",
}
