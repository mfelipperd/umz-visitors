export type InstagramPost = { kind: "p" | "reel"; id: string };

export type ChurchEvent = {
  slug: string;
  name: string;
  summary: string;
  description: string;
  /** ISO 8601 com offset de Belém (-03:00) */
  startsAt: string;
  place: string;
  address: string;
  entry?: string;
  entryNote?: string;
  destination?: string;
  instagram?: InstagramPost[];
};

// Para adicionar um evento, inclua um item aqui: a lista e a página de detalhe são geradas sozinhas.
export const EVENTS: ChurchEvent[] = [
  {
    slug: "tarde-de-louvor-e-esperanca",
    name: "Tarde de Louvor e Esperança",
    summary: "Grupos musicais de Belém em uma tarde de louvor.",
    description:
      "Grupos musicais de Belém reunidos em uma tarde de louvor. Venha louvar com a gente e ajude a levar o Natal a quem precisa.",
    startsAt: "2026-10-10T16:00:00-03:00",
    place: "Espaço Novo Tempo Umarizal",
    address: "Rua Oliveira Belo, 515, Belém/PA",
    entry: "1 kg de alimento não perecível",
    entryNote: "Quem puder levar mais, melhor: cada quilo ajuda. Chame a família e os amigos!",
    destination: "Tudo o que for arrecadado vai para as ações de Natal da ASA.",
    instagram: [
      { kind: "p", id: "Ddzf4SXROWP" },
      { kind: "reel", id: "Dd7pWIAtOVm" },
      { kind: "reel", id: "DeHtaX-x1LX" },
      { kind: "p", id: "Dd7oMm7Dek1" },
    ],
  },
];

const TZ = "America/Belem";

export function getEvent(slug: string) {
  return EVENTS.find((e) => e.slug === slug);
}

/** Um evento deixa de ser "próximo" quando o dia dele termina (fuso de Belém). */
export function isPast(e: ChurchEvent, now = new Date()) {
  const endOfDay = new Date(new Date(e.startsAt).getTime());
  const day = new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(endOfDay);
  return now.getTime() > new Date(`${day}T23:59:59-03:00`).getTime();
}

export function splitEvents(now = new Date()) {
  const byDate = (a: ChurchEvent, b: ChurchEvent) =>
    new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime();
  const upcoming = EVENTS.filter((e) => !isPast(e, now)).sort(byDate);
  const past = EVENTS.filter((e) => isPast(e, now)).sort((a, b) => byDate(b, a));
  return { upcoming, past };
}

export function formatDate(e: ChurchEvent) {
  const s = new Intl.DateTimeFormat("pt-BR", {
    timeZone: TZ,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(e.startsAt));
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function formatDayMonth(e: ChurchEvent) {
  const d = new Date(e.startsAt);
  return {
    day: new Intl.DateTimeFormat("pt-BR", { timeZone: TZ, day: "2-digit" }).format(d),
    month: new Intl.DateTimeFormat("pt-BR", { timeZone: TZ, month: "short" }).format(d).replace(".", ""),
  };
}

export function formatTime(e: ChurchEvent) {
  const [h, m] = new Intl.DateTimeFormat("pt-BR", {
    timeZone: TZ,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  })
    .format(new Date(e.startsAt))
    .split(":");
  return m === "00" ? `${Number(h)}h` : `${Number(h)}h${m}`;
}
