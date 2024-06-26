import { useEffect } from "react"

export function Controls() {
  useKeyboardControls()

  return null

  return (
    <div className="fixed bottom-8 flex w-full gap-2 p-8">
      <button
        className="bg-slate-800 p-4 hover:bg-slate-700 active:bg-slate-900"
        onPointerDown={() => Dusk.actions.setVelocity({ x: -1 })}
        onPointerUp={() => Dusk.actions.setVelocity({ x: 0 })}
        onPointerOut={() => Dusk.actions.setVelocity({ x: 0 })}
      >
        ◄
      </button>
      <button
        className="bg-slate-800 p-4 hover:bg-slate-700 active:bg-slate-900"
        onPointerDown={() => Dusk.actions.setVelocity({ x: 1 })}
        onPointerUp={() => Dusk.actions.setVelocity({ x: 0 })}
        onPointerOut={() => Dusk.actions.setVelocity({ x: 0 })}
      >
        ►
      </button>
    </div>
  )
}

let left = false
let right = false
let up = false
let down = false

function useKeyboardControls() {
  useEffect(() => {
    function keyDown(event: KeyboardEvent) {
      if (event.key === "a") {
        Dusk.actions.setVelocity({ x: -1 })
        left = true
      } else if (event.key === "d") {
        Dusk.actions.setVelocity({ x: 1 })
        right = true
      } else if (event.key === "w") {
        Dusk.actions.setVelocity({ y: -1 })
        up = true
      } else if (event.key === "s") {
        Dusk.actions.setVelocity({ y: 1 })
        down = true
      }
    }

    function keyUp(event: KeyboardEvent) {
      if (event.key === "a") {
        left = false
        if (!right) {
          Dusk.actions.setVelocity({ x: 0 })
        }
      } else if (event.key === "d") {
        right = false
        if (!left) {
          Dusk.actions.setVelocity({ x: 0 })
        }
      } else if (event.key === "w") {
        up = false
        if (!down) {
          Dusk.actions.setVelocity({ y: 0 })
        }
      } else if (event.key === "s") {
        down = false
        if (!up) {
          Dusk.actions.setVelocity({ y: 0 })
        }
      }
    }

    window.addEventListener("keydown", keyDown)
    window.addEventListener("keyup", keyUp)

    return () => {
      window.removeEventListener("keydown", keyDown)
      window.removeEventListener("keyup", keyUp)
    }
  }, [])
}
