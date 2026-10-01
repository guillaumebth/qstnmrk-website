"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"

import { useClickSound } from "@/hooks/use-click-sound"
import { drops, upcomingDrops } from "@/lib/drops"
import { cn } from "@/lib/utils"

const ROW_HEIGHT = 64

// Mêmes colonnes que la maquette : 40 / 151 / 377 px, numéro aligné à droite, flèche
// Pendant la transition d'entrée, les lignes descendent une par une, du haut vers le bas.
// (variantes "reveal" et "done" pour que l'animation ne soit pas coupée à la fin de l'intro)
const rowEnter =
  "fill-mode-backwards group-data-[intro=done]/intro:animate-in group-data-[intro=done]/intro:fade-in group-data-[intro=done]/intro:slide-in-from-top-6 group-data-[intro=reveal]/intro:animate-in group-data-[intro=reveal]/intro:fade-in group-data-[intro=reveal]/intro:slide-in-from-top-6"
const enterDelay = (i: number) => ({
  animationDelay: `${100 + i * 60}ms`,
  animationDuration: "600ms",
  animationTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
})

const rowGrid =
  "grid h-16 items-center px-4 text-[10px] leading-[normal] font-medium uppercase grid-cols-[64px_1fr_24px] gap-x-4 md:px-10 md:gap-x-0 md:grid-cols-[111px_226px_1fr_auto_120px]"

export function DropList() {
  const [hovered, setHovered] = useState<number | null>(null)
  const playClick = useClickSound()
  const rowRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const lastHovered = useRef<number | null>(null)

  function hover(i: number | null) {
    if (i !== null && lastHovered.current !== i) playClick()
    lastHovered.current = i
    setHovered(i)
  }

  // Sur mobile (pas de survol possible) : la ligne qui passe au centre de l'écran s'allume
  useEffect(() => {
    if (!window.matchMedia("(hover: none)").matches) return

    let frame = 0
    function update() {
      frame = 0
      const center = window.innerHeight / 2
      const index = rowRefs.current.findIndex((row) => {
        const rect = row?.getBoundingClientRect()
        return rect && rect.top <= center && rect.bottom > center
      })
      if (index !== lastHovered.current) hover(index === -1 ? null : index)
    }
    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    window.addEventListener("load", onScroll)
    // Recalcul une fois l'animation d'arrivée terminée (les lignes bougent pendant)
    const settle = setTimeout(onScroll, 1300)
    update()
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      window.removeEventListener("load", onScroll)
      clearTimeout(settle)
      cancelAnimationFrame(frame)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- à brancher une seule fois
  }, [])

  return (
    <div className="relative" onMouseLeave={() => hover(null)}>
      {drops.map((drop, i) => (
        <a
          key={drop.name}
          ref={(el) => {
            rowRefs.current[i] = el
          }}
          href={drop.href}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => hover(i)}
          onFocus={() => hover(i)}
          onBlur={() => hover(null)}
          style={{
            ...enterDelay(i),
            ...(hovered === i && { backgroundColor: drop.color }),
          }}
          className={cn(
            rowGrid,
            rowEnter,
            "text-black transition-colors duration-150 outline-none",
            i % 2 === 0 ? "bg-row" : "bg-row-alt"
          )}
        >
          <span>{drop.name}</span>
          <span className="hidden font-bold md:block">{drop.date}</span>
          <span className="truncate">{drop.title}</span>
          <span className="hidden text-right md:block">{drop.number}</span>
          <span className="flex justify-end">
            <Image
              src="/arrow.svg"
              alt=""
              aria-hidden
              width={32}
              height={32}
              className="size-4 md:size-5"
            />
          </span>
        </a>
      ))}

      {/* Prochains drops, pas encore révélés */}
      {upcomingDrops.map((drop, i) => (
        <div
          key={drop.name}
          style={enterDelay(drops.length + i)}
          className={cn(rowGrid, rowEnter, "bg-upcoming text-white")}
        >
          <span>{drop.name}</span>
          <span className="hidden font-bold md:block">{drop.date}</span>
          <span className="truncate">{drop.title}</span>
          <span className="hidden text-right md:block">{drop.number}</span>
          <span />
        </div>
      ))}

      {/* Mobile : un peu de fond sombre en plus en bas de page,
          pour que le dernier drop puisse lui aussi remonter jusqu'au centre de l'écran */}
      <div
        aria-hidden
        className="bg-upcoming md:hidden"
        style={{
          height: `max(0px, calc(50svh - ${upcomingDrops.length * ROW_HEIGHT + ROW_HEIGHT / 2}px))`,
        }}
      />

      {/* Images qui apparaissent au survol (ou au centre de l'écran sur mobile), centrées sur leur ligne.
          Toutes chargées dès le départ (mais invisibles) pour apparaître sans délai.
          Taille : 140px sur mobile, 227px (maquette) sur ordinateur. */}
      {drops.map((drop, i) => (
        <div
          key={drop.name}
          aria-hidden
          className={cn(
            "pointer-events-none absolute right-12 size-(--preview) transition-[opacity,scale] duration-150 [--preview:140px] md:right-auto md:left-[calc(62.5%+6px)] md:[--preview:227px]",
            hovered === i ? "scale-100 opacity-100" : "scale-95 opacity-0"
          )}
          style={{
            top: `calc(${i * ROW_HEIGHT + ROW_HEIGHT / 2}px - var(--preview) / 2)`,
          }}
        >
          <Image
            src={drop.image}
            alt=""
            fill
            sizes="227px"
            unoptimized
            loading="eager"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  )
}
