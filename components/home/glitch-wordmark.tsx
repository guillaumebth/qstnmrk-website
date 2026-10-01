import type { CSSProperties } from "react"

import { Wordmark } from "@/components/home/wordmark"
import { cn } from "@/lib/utils"

// Les calques colorés du glitch reprennent la forme exacte du logo grâce à un masque :
// lettres (big-text.svg) + point d'interrogation (big-mark.svg), placés comme dans Wordmark.
// Les positions sont converties dans la logique de mask-position :
// 49.05% / (100% - 9.32%) = 54.09%  ·  -1.85% / (100% - 97.77%) = -82.96%
const logoMask: CSSProperties = {
  maskImage: "url(/big-text.svg), url(/big-mark.svg)",
  maskSize: "100% 100%, 9.32% 97.77%",
  maskPosition: "0 0, 54.09% -82.96%",
  maskRepeat: "no-repeat",
}

// Le glitch se déclenche au survol, et aussi pendant l'animation d'arrivée (EntryAnimation)
const layer =
  "pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 group-data-[intro=reveal]/intro:opacity-100 motion-reduce:hidden"

export function GlitchWordmark({ className }: { className?: string }) {
  return (
    <div className={cn("group relative", className)}>
      <Wordmark
        variant="big"
        priority
        className="w-full group-hover:animate-glitch-base group-data-[intro=reveal]/intro:animate-glitch-base motion-reduce:animate-none"
      />
      <div
        aria-hidden
        style={logoMask}
        className={cn(
          layer,
          "bg-black group-hover:animate-glitch-1 group-data-[intro=reveal]/intro:animate-glitch-1"
        )}
      />
      <div
        aria-hidden
        style={logoMask}
        className={cn(
          layer,
          "bg-[#8a8a8a] group-hover:animate-glitch-2 group-data-[intro=reveal]/intro:animate-glitch-2"
        )}
      />
    </div>
  )
}
