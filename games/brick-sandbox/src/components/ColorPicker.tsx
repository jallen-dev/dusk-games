import { Color } from "@/types"
import { useState } from "react"

export function ColorPicker({
  color,
  onColorSelected,
}: {
  color: Color
  onColorSelected: (color: Color) => void
}) {
  const [open, setOpen] = useState(false)
  const allOtherColors = Object.fromEntries(
    Object.entries(COLOR_STYLES).filter(([c]) => {
      console.log(c, color)
      return c !== color.toString()
    })
  )
  return (
    <div>
      <button
        className={`w-16 h-8 ${COLOR_STYLES[color]}`}
        onClick={() => setOpen(!open)}
      ></button>

      {open && (
        <div className="flex flex-col gap-1">
          {Object.entries(allOtherColors).map(([color, style]) => (
            <button
              key={color}
              className={`w-16 h-8 ${style}`}
              onClick={() => onColorSelected(parseInt(color))}
            ></button>
          ))}
        </div>
      )}
    </div>
  )
}

const COLOR_STYLES: Record<Color, string> = {
  [Color.Red]: "bg-red-500",
  [Color.Green]: "bg-green-500",
  [Color.Blue]: "bg-blue-500",
  [Color.Yellow]: "bg-yellow-500",
}
