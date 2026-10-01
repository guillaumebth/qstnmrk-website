"use client"

import { useEffect, useState } from "react"

import { CloseButton } from "@/components/home/close-button"
import {
  QuestionMarks,
  useBlinkingColors,
} from "@/components/home/question-marks"

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

// Petite fenêtre en bas à droite avec le manifeste, ouverte à l'arrivée sur le site
export function ManifestoModal() {
  const [open, setOpen] = useState(true)

  // Échap ferme la fenêtre (sauf si la fenêtre "Notify me" est ouverte : elle passe en premier)
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Escape") return
      if (document.querySelector("[data-slot=dialog-content]")) return
      setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  if (!open) return null
  return <ManifestoCard onClose={() => setOpen(false)} />
}

function ManifestoCard({ onClose }: { onClose: () => void }) {
  const { colors, shuffle } = useBlinkingColors()

  return (
    <div
      role="dialog"
      aria-label="About QSTNMRK?"
      onPointerMove={shuffle}
      className="fixed right-4 bottom-4 z-40 flex w-[268px] animate-in flex-col items-center rounded-lg bg-white px-6 pt-[30px] pb-8 text-center text-black delay-700 duration-500 fill-mode-backwards fade-in slide-in-from-bottom-4 md:right-[55px] md:bottom-6"
    >
      <CloseButton onClick={onClose} />

      <QuestionMarks colors={colors} />

      <p className="mt-[25px] text-[10px] leading-[normal] whitespace-pre-line">
        {manifesto}
      </p>
    </div>
  )
}
