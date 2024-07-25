import capture from "./assets/sound/sfx/capture.mp3"
import check from "./assets/sound/sfx/check.mp3"
import move from "./assets/sound/sfx/move.mp3"
import notify from "./assets/sound/sfx/notify.mp3"

type Sound = "capture" | "check" | "move" | "notify"

const SOUNDS = {
  capture: new Audio(capture),
  check: new Audio(check),
  move: new Audio(move),
  notify: new Audio(notify),
} as const

export function playSound(sound: Sound) {
  SOUNDS[sound].play()
}
