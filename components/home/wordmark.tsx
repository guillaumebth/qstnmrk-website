import Image from "next/image"

import { cn } from "@/lib/utils"

// Le logo est en deux morceaux dans la maquette : les lettres "QSTN MRK"
// et le point d'interrogation, posé dans l'espace entre N et M.
const variants = {
  small: {
    text: "/logo-text.svg",
    mark: "/logo-mark.svg",
    width: 87.3974,
    height: 12.7618,
  },
  big: {
    text: "/big-text.svg",
    mark: "/big-mark.svg",
    width: 1420.63,
    height: 207.44,
  },
}

export function Wordmark({
  variant,
  className,
  priority,
}: {
  variant: keyof typeof variants
  className?: string
  priority?: boolean
}) {
  const v = variants[variant]

  return (
    <div className={cn("relative", className)}>
      <Image
        src={v.text}
        alt="QSTNMRK?"
        width={v.width}
        height={v.height}
        priority={priority}
        className="block h-auto w-full"
      />
      <Image
        src={v.mark}
        alt=""
        aria-hidden
        width={v.width * 0.0932}
        height={v.height * 0.9777}
        priority={priority}
        className="absolute top-[-1.85%] left-[49.05%] h-auto w-[9.32%]"
      />
    </div>
  )
}
