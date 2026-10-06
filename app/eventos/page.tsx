import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Clock, MapPin, ChevronRight } from "lucide-react";
import Footer from "@/components/Footer";
import SiteLogo from "@/components/SiteLogo";
import PushSubscribe from "@/components/PushSubscribe";
import { LanguageProvider } from "@/context/LanguageContext";
import { splitEvents, formatDayMonth, formatTime, type ChurchEvent } from "@/lib/events";

// Reavalia a cada hora para mover eventos para "Anteriores" sem precisar de novo deploy.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Eventos | Espaço Novo Tempo Umarizal",
  description: "Confira os próximos eventos do Espaço Novo Tempo Umarizal, em Belém.",
};

export default function EventosPage() {
  const { upcoming, past } = splitEvents();

  return (
    <LanguageProvider>
      <div className="relative overflow-hidden selection:bg-accent selection:text-primary min-h-screen">
        <SiteLogo />
        <main className="min-h-screen pt-28 px-6 max-w-4xl mx-auto space-y-12 pb-24">
          <Link href="/" className="inline-flex items-center text-primary/60 hover:text-primary transition-colors group">
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Voltar ao início
          </Link>

          <header className="space-y-4 text-center">
            <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto">
              <CalendarDays className="w-8 h-8 text-accent" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-primary">Eventos</h1>
            <p className="text-gray-500 max-w-md mx-auto">
              Fique por dentro do que vai acontecer no Espaço Novo Tempo Umarizal. Todos são bem-vindos.
            </p>
          </header>

          <PushSubscribe />

          <section className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-[0.25em] text-primary/50">Próximos eventos</h2>
            {upcoming.length ? (
              <div className="space-y-4">
                {upcoming.map((e) => (
                  <EventCard key={e.slug} event={e} />
                ))}
              </div>
            ) : (
              <p className="rounded-3xl bg-white border border-gray-100 p-8 text-center text-gray-500">
                Nenhum evento marcado por enquanto. Volte em breve!
              </p>
            )}
          </section>

          {past.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-[0.25em] text-primary/50">Anteriores</h2>
              <div className="space-y-4 opacity-70">
                {past.map((e) => (
                  <EventCard key={e.slug} event={e} />
                ))}
              </div>
            </section>
          )}
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}

function EventCard({ event }: { event: ChurchEvent }) {
  const { day, month } = formatDayMonth(event);
  return (
    <Link
      href={`/eventos/${event.slug}`}
      className="group flex items-center gap-5 rounded-3xl bg-white border border-gray-100 shadow-lg shadow-primary/5 p-5 hover:-translate-y-1 transition-transform"
    >
      <div className="shrink-0 w-20 h-20 rounded-2xl bg-primary text-white flex flex-col items-center justify-center">
        <span className="text-2xl font-bold leading-none">{day}</span>
        <span className="text-xs uppercase tracking-widest text-accent mt-1">{month}</span>
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <h3 className="text-xl font-bold text-primary">{event.name}</h3>
        <p className="text-sm text-gray-500">{event.summary}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-primary/60 pt-1">
          <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{formatTime(event)}</span>
          <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{event.place}</span>
        </div>
      </div>
      <ChevronRight className="shrink-0 w-5 h-5 text-primary/30 group-hover:text-accent transition-colors" />
    </Link>
  );
}
