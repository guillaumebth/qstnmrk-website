"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronDown } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { CloseButton } from "@/components/home/close-button"
import {
  QuestionMarks,
  useBlinkingColors,
} from "@/components/home/question-marks"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

const countryCodes = [
  { code: "+33", flag: "🇫🇷" },
  { code: "+1", flag: "🇺🇸" },
  { code: "+44", flag: "🇬🇧" },
  { code: "+49", flag: "🇩🇪" },
  { code: "+39", flag: "🇮🇹" },
  { code: "+34", flag: "🇪🇸" },
  { code: "+32", flag: "🇧🇪" },
  { code: "+41", flag: "🇨🇭" },
  { code: "+31", flag: "🇳🇱" },
  { code: "+81", flag: "🇯🇵" },
]

// Il faut un e-mail OU un numéro de téléphone, et accepter les T&Cs
const schema = z
  .object({
    email: z.string().trim(),
    countryCode: z.string(),
    phone: z.string().trim(),
    terms: z.boolean().refine((v) => v, "Please accept the T&Cs"),
  })
  .superRefine((data, ctx) => {
    if (!data.email && !data.phone) {
      ctx.addIssue({
        code: "custom",
        path: ["email"],
        message: "Enter an e-mail or a phone number",
      })
    }
    if (data.email && !z.string().email().safeParse(data.email).success) {
      ctx.addIssue({
        code: "custom",
        path: ["email"],
        message: "Invalid e-mail",
      })
    }
    if (data.phone && !/^[0-9 ().-]{6,}$/.test(data.phone)) {
      ctx.addIssue({
        code: "custom",
        path: ["phone"],
        message: "Invalid phone number",
      })
    }
  })

type FormValues = z.infer<typeof schema>

// Sur mobile, le texte tapé est en 16px : en dessous, Safari iPhone zoome sur le champ.
// Les placeholders restent en 10px pour garder le style du site.
const field =
  "h-9 w-full rounded-full bg-paper px-4 text-center text-base leading-[normal] placeholder:text-[10px] md:h-7 md:text-[10px] outline-none placeholder:text-[#a4a4a4] placeholder:uppercase focus-visible:ring-1 focus-visible:ring-black aria-invalid:ring-1 aria-invalid:ring-[#e20000]"

export function NotifyDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="h-auto rounded-full bg-black px-4 py-2 text-[10px] leading-[normal] font-medium text-white hover:bg-black/80">
          Notify me of the next drop
        </Button>
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className="w-[340px] gap-0 rounded-lg bg-white p-0 text-black ring-0 sm:max-w-[340px]"
      >
        {/* Contenu monté seulement quand la fenêtre est ouverte : formulaire neuf à chaque ouverture */}
        <NotifyPanel />
      </DialogContent>
    </Dialog>
  )
}

function NotifyPanel() {
  const [done, setDone] = useState(false)
  const { colors, shuffle } = useBlinkingColors()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", countryCode: "+33", phone: "", terms: false },
  })
  const { errors, isSubmitting } = form.formState
  const error = errors.email ?? errors.phone ?? errors.terms

  async function onSubmit(values: FormValues) {
    // TODO : envoyer l'inscription vers l'outil d'e-mailing / SMS choisi (Klaviyo, Mailchimp…)
    console.info("Notify signup", values)
    setDone(true)
    toast.success("You're on the list.")
  }

  return (
    <div
      onPointerMove={shuffle}
      className="flex flex-col items-center px-8 pt-[30px] pb-8 text-center"
    >
      <DialogClose asChild>
        <CloseButton />
      </DialogClose>

      <QuestionMarks colors={colors} />

      {done ? (
        <>
          <DialogTitle className="mt-6 text-[10px] leading-[normal] font-semibold uppercase">
            You&apos;re on the list.
          </DialogTitle>
          <DialogDescription className="mt-2 text-[10px] leading-[normal] text-black">
            We&apos;ll let you know before the next drop.
          </DialogDescription>
          <DialogClose asChild>
            <Button className="mt-6 h-9 w-full rounded-full bg-black text-[10px] font-medium text-white uppercase hover:bg-black/80 md:h-7">
              Close
            </Button>
          </DialogClose>
        </>
      ) : (
        <>
          <DialogTitle className="mt-6 text-[10px] leading-[normal] font-semibold uppercase">
            Be the first to know
            <br />
            about our next drop.
          </DialogTitle>
          <DialogDescription className="sr-only">
            Leave your e-mail or phone number to be notified of the next drop.
          </DialogDescription>

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
            className="mt-5 flex w-full flex-col items-center"
          >
            <input
              type="email"
              autoComplete="email"
              placeholder="E-mail"
              aria-invalid={!!errors.email}
              className={field}
              {...form.register("email")}
            />

            <span className="my-2 text-[10px] leading-[normal] font-medium text-[#a4a4a4]">
              OR
            </span>

            <div className="flex w-full gap-2">
              <div className="relative shrink-0">
                <select
                  aria-label="Country code"
                  className={cn(
                    field,
                    "w-[116px] appearance-none pr-7 pl-4 text-left md:w-[92px]"
                  )}
                  {...form.register("countryCode")}
                >
                  {countryCodes.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-3 -translate-y-1/2" />
              </div>
              <input
                type="tel"
                autoComplete="tel-national"
                placeholder="Phone number"
                aria-invalid={!!errors.phone}
                className={field}
                {...form.register("phone")}
              />
            </div>

            <label className="mt-5 flex cursor-pointer items-center gap-2 text-[10px] leading-[normal] uppercase">
              <input
                type="checkbox"
                className="size-3 shrink-0 cursor-pointer appearance-none rounded-[2px] border border-black bg-white outline-none checked:bg-black checked:shadow-[inset_0_0_0_2px_white] focus-visible:ring-1 focus-visible:ring-black focus-visible:ring-offset-1"
                {...form.register("terms")}
              />
              <span>
                I accept the{" "}
                <a
                  href="https://www.qstnmrk.com/files/qstnmrk-tcs.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="normal-case underline underline-offset-2"
                >
                  T&amp;Cs
                </a>
              </span>
            </label>

            {error && (
              <p
                role="alert"
                className="mt-3 text-[10px] leading-[normal] text-[#e20000]"
              >
                {error.message}
              </p>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-5 h-9 w-full rounded-full bg-black text-[10px] font-medium text-white uppercase hover:bg-black/80 md:h-7"
            >
              Add me to the list
            </Button>
          </form>
        </>
      )}
    </div>
  )
}
