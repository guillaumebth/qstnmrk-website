"use client"

import { useEffect, useState } from "react"

// Animation d'arrivée sur le site : le gros logo glitch et les drops descendent un par un.
// Les composants enfants réagissent à data-intro via les classes group-data-[intro=…]/intro.
const REVEAL_MS = 1100

export function EntryAnimation({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<"reveal" | "done">("reveal")

  useEffect(() => {
    const id = setTimeout(() => setPhase("done"), REVEAL_MS)
    return () => clearTimeout(id)
  }, [])

  return (
    <div data-intro={phase} className="group/intro">
      {children}
    </div>
  )
}
