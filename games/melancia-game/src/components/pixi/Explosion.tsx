import { Texture } from "@pixi/core"
import { AnimatedSprite } from "@pixi/react"
import { useState } from "react"

let textures: Texture[]

function getTextures() {
  if (!textures) {
    textures = [
      Texture.from("explosion_1"),
      Texture.from("explosion_2"),
      Texture.from("explosion_3"),
      Texture.from("explosion_4"),
      Texture.from("explosion_5"),
      Texture.from("explosion_6"),
      Texture.from("explosion_7"),
      Texture.from("explosion_8"),
      Texture.from("explosion_9"),
    ]
  }
  return textures
}

export function Explosion() {
  const [visible, setVisible] = useState(true)
  return (
    <AnimatedSprite
      isPlaying={true}
      textures={getTextures()}
      anchor={0.5}
      animationSpeed={0.35}
      loop={false}
      scale={0.35}
      visible={visible}
      onComplete={() => setVisible(false)}
    />
  )
}
