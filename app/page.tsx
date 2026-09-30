import { DropList } from "@/components/home/drop-list"
import { GlitchWordmark } from "@/components/home/glitch-wordmark"
import { Wordmark } from "@/components/home/wordmark"
import { IntroGate } from "@/components/intro/intro-gate"
import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <IntroGate>
      <main className="flex min-h-svh flex-col bg-paper text-black">
        <header className="flex flex-col items-center px-4 pt-10 text-center">
          <Wordmark variant="small" priority className="w-[87px]" />

          <p className="mt-3 max-w-[322px] text-[10px] leading-[normal]">
            WE EXIST TO QUESTION EVERYTHING: SYSTEMS, SOCIETY, POWER, CULTURE,
            OURSELVES, AND THE ABSURDITY OF MODERN LIFE.
          </p>

          <div className="mt-4 flex items-center gap-4">
            {/* TODO : ouvrir la modale d'inscription (pas encore designée) */}
            <Button className="h-auto rounded-full bg-black px-4 py-2 text-[10px] leading-[normal] font-medium text-white hover:bg-black/80">
              M’avertir au prochain drop
            </Button>
            <a
              href="https://www.instagram.com/qstnmrk__/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] leading-[normal] font-semibold uppercase hover:underline"
            >
              Instagram ↗
            </a>
          </div>
        </header>

        <div className="flex flex-1 items-end px-[0.67%] pt-[53px] pb-7">
          <GlitchWordmark className="w-full" />
        </div>

        <DropList />
      </main>
    </IntroGate>
  )
}
