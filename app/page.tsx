import { DropList } from "@/components/home/drop-list"
import { EntryAnimation } from "@/components/home/entry-animation"
import { GlitchWordmark } from "@/components/home/glitch-wordmark"
import { ManifestoModal } from "@/components/home/manifesto-modal"
import { NotifyDialog } from "@/components/home/notify-dialog"
import { Wordmark } from "@/components/home/wordmark"

export default function Page() {
  return (
    <EntryAnimation>
      <main className="flex min-h-svh flex-col bg-paper text-black">
        <header className="flex flex-col items-center px-4 pt-10 text-center">
          <Wordmark variant="small" priority className="w-[87px]" />

          <p className="mt-3 max-w-[322px] text-[10px] leading-[normal]">
            WE EXIST TO QUESTION EVERYTHING: SYSTEMS, SOCIETY, POWER, CULTURE,
            OURSELVES, AND THE ABSURDITY OF MODERN LIFE.
          </p>

          <div className="mt-4 flex items-center gap-4">
            <NotifyDialog />
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
        <ManifestoModal />
      </main>
    </EntryAnimation>
  )
}
