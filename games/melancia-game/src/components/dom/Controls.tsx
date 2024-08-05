import { useEffect, useRef } from "react"

import { useGameStore } from "@/store/useGameStore"

export function Controls() {
  const moveLeft = useGameStore((state) => state.moveLeft)
  const moveRight = useGameStore((state) => state.moveRight)
  const left = useRef(false)
  const right = useRef(false)
  useKeyboardControls(left, right)

  useEffect(() => {
    let rAF = requestAnimationFrame(loop)

    function loop() {
      if (left.current) {
        moveLeft()
      } else if (right.current) {
        moveRight()
      }
      rAF = requestAnimationFrame(loop)
    }
    return () => {
      cancelAnimationFrame(rAF)
    }
  }, [moveLeft, moveRight])

  return (
    <div className="fixed bottom-0 flex w-full justify-between gap-2 p-6">
      <div className="flex gap-6">
        <button
          className="h-20 w-20 bg-slate-800 text-2xl hover:bg-slate-700 active:bg-slate-900"
          onPointerDown={() => (left.current = true)}
          onPointerUp={() => (left.current = false)}
          onPointerOut={() => (left.current = false)}
        >
          ◄
        </button>
        <button
          className="h-20 w-20 bg-slate-800 text-2xl hover:bg-slate-700 active:bg-slate-900"
          onPointerDown={() => (right.current = true)}
          onPointerUp={() => (right.current = false)}
          onPointerOut={() => (right.current = false)}
        >
          ►
        </button>
      </div>
      <button className="bg-slate-800 p-6 text-2xl hover:bg-slate-700 active:bg-slate-900" onPointerDown={drop}>
        DROP
      </button>
    </div>
  )
}

function useKeyboardControls(left: React.MutableRefObject<boolean>, right: React.MutableRefObject<boolean>) {
  useEffect(() => {
    function keyDown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") {
        left.current = true
      } else if (event.key === "ArrowRight") {
        right.current = true
      } else if (event.key === " ") {
        drop()
      } else if (event.key === "s") {
        useGameStore.getState().stressTest()
      }
    }

    function keyUp(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") {
        left.current = false
      } else if (event.key === "ArrowRight") {
        right.current = false
      }
    }

    window.addEventListener("keydown", keyDown)
    window.addEventListener("keyup", keyUp)

    return () => {
      window.removeEventListener("keydown", keyDown)
      window.removeEventListener("keyup", keyUp)
    }
  }, [left, right])
}
function drop() {
  useGameStore.getState().addFruit()
}
