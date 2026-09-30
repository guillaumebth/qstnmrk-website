"use client"

import { useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { drops } from "@/lib/drops"
import { cn } from "@/lib/utils"

// Déroulé de la transition après "Enter" :
// intro → leaving (les ? clignotent et se rejoignent) → reveal (l'intro se découpe, le logo glitch) → done
type Phase = "intro" | "leaving" | "reveal" | "done"

const LEAVING_MS = 450
const REVEAL_MS = 900

const palette = drops.map((d) => d.color)

function pickOther(current: string) {
  const options = palette.filter((c) => c !== current)
  return options[Math.floor(Math.random() * options.length)]
}

const manifesto = `We are an Art collective creating cultural provocations.
We design controversial objects,
digital experiments and performances.
We are part of the same world we provoke.
Not outside it, not above it.
We challenge because we belong.

Our drops are moments:
brief, thoughtful, subversive.
It's meant to sell out, spark debate or be ignored.
All outcomes are valid.

QSTNMRK? is not here to save or condemn.
It stands for one purpose only: to keep asking, irreverently, relentlessly, when most of us take the current answer for granted.`

export function IntroGate({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<Phase>("intro")
  const started = useRef(false)

  // Pas de scroll de la home tant que l'intro est affichée
  useEffect(() => {
    document.documentElement.style.overflow = phase === "done" ? "" : "hidden"
  }, [phase])

  function enter() {
    if (started.current) return
    started.current = true
    setPhase("leaving")
    setTimeout(() => {
      window.scrollTo(0, 0)
      setPhase("reveal")
    }, LEAVING_MS)
    setTimeout(() => setPhase("done"), LEAVING_MS + REVEAL_MS)
  }

  return (
    <div data-intro={phase} className="group/intro">
      {children}
      {phase !== "done" && <IntroScreen phase={phase} onEnter={enter} />}
    </div>
  )
}

function IntroScreen({
  phase,
  onEnter,
}: {
  phase: Phase
  onEnter: () => void
}) {
  const [colors, setColors] = useState([palette[0], palette[2], palette[3]])
  const lastMove = useRef(0)
  const leaving = phase !== "intro"

  function shuffleAll() {
    setColors((prev) => prev.map(pickOther))
  }

  // Couleurs random quand la souris bouge (limité pour que ça reste lisible)
  function onPointerMove() {
    const now = performance.now()
    if (now - lastMove.current < 70) return
    lastMove.current = now
    shuffleAll()
  }

  // Au repos : un ? change de couleur de temps en temps.
  // Après "Enter" : les trois clignotent très vite.
  useEffect(() => {
    const id = setInterval(
      () => {
        if (leaving) return shuffleAll()
        const i = Math.floor(Math.random() * 3)
        setColors((prev) => prev.map((c, j) => (j === i ? pickOther(c) : c)))
      },
      leaving ? 60 : 800
    )
    return () => clearInterval(id)
  }, [leaving])

  // La touche Entrée fonctionne aussi
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Enter") onEnter()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  })

  return (
    <div
      onPointerMove={onPointerMove}
      className={cn(
        "fixed inset-0 z-50 overflow-y-auto bg-paper text-black",
        phase === "reveal" && "animate-intro-wipe"
      )}
    >
      {/* Tout le bloc (?, texte, bouton) est centré dans la page */}
      <div className="flex min-h-full flex-col items-center justify-center px-4 py-10 text-center">
        <div className="flex gap-9">
          {colors.map((color, i) => (
            <QuestionMark
              key={i}
              color={color}
              className={cn(
                "transition-transform duration-400 ease-[steps(4,end)]",
                leaving && i === 0 && "translate-x-[94px]",
                leaving && i === 2 && "-translate-x-[94px]"
              )}
            />
          ))}
        </div>

        <div className={cn(leaving && "invisible")}>
          <p className="mt-[73px] text-[10px] leading-[normal] whitespace-pre-line">
            {manifesto}
          </p>
          <Button
            onClick={onEnter}
            className="mt-[26px] h-auto rounded-full bg-black px-4 py-2 text-[10px] leading-[normal] font-medium text-white hover:bg-black/80"
          >
            Enter
          </Button>
        </div>
      </div>
    </div>
  )
}

// Le ? de la maquette (même tracé que /qmark.svg), en SVG inline pour pouvoir
// changer sa couleur tout en restant net pendant les animations
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
      width="58.1534"
      height="89.0473"
      viewBox="0 0 58.1534 89.0473"
      fill={color}
      className={cn("block", className)}
    >
      <path d="M41.4317 79.0964C41.4317 73.4835 37.0652 69.1424 31.4194 69.1424C25.7736 69.1424 21.4071 73.4835 21.4071 79.0964C21.4071 84.7093 25.7736 89.0503 31.4194 89.0503C37.0652 89.0503 41.4317 84.7093 41.4317 79.0964ZM10.4377 42.2472C5.00451 37.8005 -3.8147e-05 30.3871 -3.8147e-05 22.6597C-3.8147e-05 19.9045 0.531673 -0.000185552 29.183 -0.000185552C32.1638 -0.000185552 49.2044 -0.000185552 58.1533 20.6478L41.219 25.8346C40.4746 23.3998 36.3208 16.0921 29.183 16.0921C17.7882 16.0921 16.9342 26.6804 24.3911 33.4562C32.167 40.5493 40.581 44.6789 40.581 56.9619V60.4572H22.3674C22.3674 50.7147 19.1707 49.3403 10.4377 42.244V42.2472Z" />
    </svg>
  )
}
