// La liste des drops affichés sur la page d'accueil.
// Pour ajouter un drop : copier un bloc, changer les infos, et mettre l'image dans /public/drops/.

export type Drop = {
  name: string
  date: string
  title: string
  number: string
  /** Lien externe vers la page du drop */
  href: string
  /** Couleur de la ligne au survol */
  color: string
  /** Image carrée (GIF) qui apparaît au survol */
  image: string
}

/** Les prochains drops, pas encore révélés (lignes noires en bas de la liste) */
export const upcomingDrops = [5, 6, 7, 8].map((n) => ({
  name: `DROP${n}`,
  date: "????????",
  title: "??????????????",
  number: String(n).padStart(3, "0"),
}))

// Du plus ancien au plus récent
export const drops: Drop[] = [
  {
    name: "DROP1",
    date: "FEB 2024",
    title: "“THE UNDRINKABLE CAN”",
    number: "001",
    href: "https://www.theundrinkablecan.com/",
    color: "#e20000",
    image: "/drops/drop1.gif",
  },
  {
    name: "DROP2",
    date: "SEPT 2024",
    title: "“A DEADLY LOTTERY”",
    number: "002",
    href: "https://theamericanroulette.org/",
    color: "#8a8a8a",
    image: "/drops/drop2.gif",
  },
  {
    name: "DROP3",
    date: "JUNE 2025",
    title: "“IS AMERICA GREAT AGAIN”",
    number: "003",
    href: "https://www.isamericagreatagain.co/",
    color: "#0038e2",
    image: "/drops/drop3.gif",
  },
  {
    name: "DROP4",
    date: "JUNE 2026",
    title: "“THE LAST DOLLAR”",
    number: "004",
    href: "https://thelastdollar.art/live",
    color: "#7c00e2",
    image: "/drops/drop4.gif",
  },
]
