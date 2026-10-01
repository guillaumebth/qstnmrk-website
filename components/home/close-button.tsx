import Image from "next/image"

import { cn } from "@/lib/utils"

// Le petit bouton rond gris "fermer" des fenêtres (maquette : cercle #EAEAEA + croix #A4A4A4)
export function CloseButton({
  className,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      aria-label="Close"
      className={cn(
        "absolute top-2.5 right-2.5 flex size-6 items-center justify-center rounded-full bg-[#eaeaea] transition-colors outline-none hover:bg-[#dcdcdc] focus-visible:ring-1 focus-visible:ring-black",
        className
      )}
      {...props}
    >
      <Image src="/close.svg" alt="" width={16} height={16} />
    </button>
  )
}
