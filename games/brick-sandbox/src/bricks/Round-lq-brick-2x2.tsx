/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.4.1 round-lq-brick-2x2.glb -t 
*/

import * as THREE from "three"
import React from "react"
import { useGLTF } from "@react-three/drei"
import { GLTF } from "three-stdlib"

type GLTFResult = GLTF & {
  nodes: {
    ["round-lq-brick-2x2_1"]: THREE.Mesh
  }
  materials: {
    colormap: THREE.MeshStandardMaterial
  }
  animations: GLTFAction[]
}

export function Model(
  props: JSX.IntrinsicElements["group"] & { color?: string }
) {
  const { nodes, materials } = useGLTF("/round-lq-brick-2x2.glb") as GLTFResult
  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes["round-lq-brick-2x2_1"].geometry}
        material={materials.colormap}
      >
        <meshStandardMaterial color={props.color ?? "yellow"} />
      </mesh>
    </group>
  )
}

useGLTF.preload("/round-lq-brick-2x2.glb")