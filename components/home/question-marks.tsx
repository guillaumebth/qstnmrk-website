"use client"

import { useEffect, useRef, useState } from "react"

import { drops } from "@/lib/drops"
import { cn } from "@/lib/utils"

const palette = drops.map((d) => d.color)

function pickOther(current: string) {
  const options = palette.filter((c) => c !== current)
  return options[Math.floor(Math.random() * options.length)]
}

// Les trois ? aux couleurs des drops :
// un ? change de couleur de temps en temps, et tous changent au hasard quand la souris bouge.
export function useBlinkingColors() {
  const [colors, setColors] = useState([palette[0], palette[2], palette[3]])
  const lastMove = useRef(0)

  useEffect(() => {
    const id = setInterval(() => {
      const i = Math.floor(Math.random() * 3)
      setColors((prev) => prev.map((c, j) => (j === i ? pickOther(c) : c)))
    }, 800)
    return () => clearInterval(id)
  }, [])

  function shuffle() {
    const now = performance.now()
    if (now - lastMove.current < 70) return
    lastMove.current = now
    setColors((prev) => prev.map(pickOther))
  }

  return { colors, shuffle }
}

export function QuestionMarks({ colors }: { colors: string[] }) {
  return (
    <div className="flex gap-3">
      {colors.map((color, i) => (
        <QuestionMark key={i} color={color} />
      ))}
    </div>
  )
}

// Le ? de la maquette, en SVG inline pour pouvoir changer sa couleur
function QuestionMark({
  color,
  className,
}: {
  color: string
  className?: string
}) {
  return (
    <svg
      aria-hidden
      width="20.4283"
      height="31.2808"
      viewBox="0 0 58.1534 89.0473"
      fill={color}
      className={cn("block", className)}
    >
      <path d="M41.4317 79.0964C41.4317 73.4835 37.0652 69.1424 31.4194 69.1424C25.7736 69.1424 21.4071 73.4835 21.4071 79.0964C21.4071 84.7093 25.7736 89.0503 31.4194 89.0503C37.0652 89.0503 41.4317 84.7093 41.4317 79.0964ZM10.4377 42.2472C5.00451 37.8005 -3.8147e-05 30.3871 -3.8147e-05 22.6597C-3.8147e-05 19.9045 0.531673 -0.000185552 29.183 -0.000185552C32.1638 -0.000185552 49.2044 -0.000185552 58.1533 20.6478L41.219 25.8346C40.4746 23.3998 36.3208 16.0921 29.183 16.0921C17.7882 16.0921 16.9342 26.6804 24.3911 33.4562C32.167 40.5493 40.581 44.6789 40.581 56.9619V60.4572H22.3674C22.3674 50.7147 19.1707 49.3403 10.4377 42.244V42.2472Z" />
    </svg>
  )
}
