import click0 from "./assets/click0.wav"
import click1 from "./assets/click1.wav"
import click2 from "./assets/click2.wav"
import levelUp from "./assets/levelup.wav"

const SOUNDS = [new Audio(click0), new Audio(click1), new Audio(click2), new Audio(levelUp)]

export function playSound(sound: number) {
  SOUNDS[sound].play()
}
