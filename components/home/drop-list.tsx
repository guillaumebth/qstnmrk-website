"use client"

import Image from "next/image"
import { useState } from "react"

import { useClickSound } from "@/hooks/use-click-sound"
import { drops, upcomingDrops } from "@/lib/drops"
import { cn } from "@/lib/utils"

const ROW_HEIGHT = 64
const PREVIEW_SIZE = 227

// Mêmes colonnes que la maquette : 40 / 151 / 377 px, numéro aligné à droite, flèche
// Pendant la transition d'entrée, les lignes descendent une par une, du haut vers le bas.
// (variantes "reveal" et "done" pour que l'animation ne soit pas coupée à la fin de l'intro)
const rowEnter =
  "fill-mode-backwards group-data-[intro=done]/intro:animate-in group-data-[intro=done]/intro:fade-in group-data-[intro=done]/intro:slide-in-from-top-6 group-data-[intro=reveal]/intro:animate-in group-data-[intro=reveal]/intro:fade-in group-data-[intro=reveal]/intro:slide-in-from-top-6"
const enterDelay = (i: number) => ({
  animationDelay: `${250 + i * 60}ms`,
  animationDuration: "600ms",
  animationTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
})

const rowGrid =
  "grid h-16 items-center px-4 text-[10px] leading-[normal] font-medium uppercase grid-cols-[64px_1fr_24px] gap-x-4 md:px-10 md:gap-x-0 md:grid-cols-[111px_226px_1fr_auto_120px]"

export function DropList() {
  const [hovered, setHovered] = useState<number | null>(null)
  const playClick = useClickSound()

  function hover(i: number) {
    if (hovered !== i) playClick()
    setHovered(i)
  }

  return (
    <div className="relative" onMouseLeave={() => setHovered(null)}>
      {drops.map((drop, i) => (
        <a
          key={drop.name}
          href={drop.href}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => hover(i)}
          onFocus={() => hover(i)}
          onBlur={() => setHovered(null)}
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

      {/* Images qui apparaissent au survol, centrées sur leur ligne.
          Toutes chargées dès le départ (mais invisibles) pour apparaître sans délai. */}
      {drops.map((drop, i) => (
        <div
          key={drop.name}
          aria-hidden
          className={cn(
            "pointer-events-none absolute left-[calc(62.5%+6px)] hidden transition-[opacity,scale] duration-150 md:block",
            hovered === i ? "scale-100 opacity-100" : "scale-95 opacity-0"
          )}
          style={{
            width: PREVIEW_SIZE,
            height: PREVIEW_SIZE,
            top: i * ROW_HEIGHT + ROW_HEIGHT / 2 - PREVIEW_SIZE / 2,
          }}
        >
          <Image
            src={drop.image}
            alt=""
            fill
            sizes={`${PREVIEW_SIZE}px`}
            unoptimized
            loading="eager"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  )
}
