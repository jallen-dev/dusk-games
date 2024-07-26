import { useEffect, useRef } from "react"

import { FriendBoost } from "./FriendBoost"
import { SuperTaps } from "./SuperTaps"
import { taps } from "./interpolators"

export function TapCounter() {
  const tapsRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let rAF: number
    const loop = () => {
      if (tapsRef.current) {
        tapsRef.current.innerText = Math.floor(taps.getPosition()).toLocaleString()
      }
      rAF = requestAnimationFrame(loop)
    }
    loop()

    return () => {
      cancelAnimationFrame(rAF)
    }
  }, [])

  return (
    <div className="w-full p-2 pb-0">
      <div className="text-2xl">
        Taps: <span ref={tapsRef}></span>
      </div>
      <SuperTaps />
      <FriendBoost />
    </div>
  )
}
