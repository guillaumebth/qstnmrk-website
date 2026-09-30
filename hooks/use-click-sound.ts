"use client"

import { useEffect, useRef } from "react"

// Petit "clac" mécanique généré par le navigateur (pas de fichier son).
// Les navigateurs bloquent le son tant que le visiteur n'a pas cliqué ou tapé
// une touche sur la page : les clacs démarrent donc après la première interaction.
export function useClickSound() {
  const ctxRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    function unlock() {
      ctxRef.current ??= new AudioContext()
      void ctxRef.current.resume()
    }
    window.addEventListener("pointerdown", unlock)
    window.addEventListener("keydown", unlock)
    return () => {
      window.removeEventListener("pointerdown", unlock)
      window.removeEventListener("keydown", unlock)
      void ctxRef.current?.close()
    }
  }, [])

  return function play() {
    const ctx = ctxRef.current
    if (!ctx || ctx.state !== "running") return

    const now = ctx.currentTime
    const duration = 0.035

    // Bruit blanc très court…
    const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1

    const noise = ctx.createBufferSource()
    noise.buffer = buffer

    // …filtré dans les aigus (hauteur un peu différente à chaque fois, plus naturel)…
    const filter = ctx.createBiquadFilter()
    filter.type = "bandpass"
    filter.frequency.value = 2600 + Math.random() * 1200
    filter.Q.value = 1.2

    // …avec une attaque sèche et une chute très rapide
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.35, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration)

    noise.connect(filter).connect(gain).connect(ctx.destination)
    noise.start(now)
    noise.stop(now + duration)
  }
}
