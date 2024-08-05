const SOUNDS = {
  tap0: new Audio("audio/tap0.mp3"),
  tap1: new Audio("audio/tap1.mp3"),
  tap2: new Audio("audio/tap2.mp3"),
  tap3: new Audio("audio/tap3.mp3"),
  tap4: new Audio("audio/tap4.mp3"),
}

export function playSound(sound: keyof typeof SOUNDS) {
  SOUNDS[sound].play()
}
