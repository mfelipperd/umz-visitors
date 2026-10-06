import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock, MapPin, Music, Package, HeartHandshake, Instagram, Navigation } from "lucide-react";
import Footer from "@/components/Footer";
import SiteLogo from "@/components/SiteLogo";
import { LanguageProvider } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { EVENTS, getEvent, formatDate, formatTime, isPast } from "@/lib/events";

export const revalidate = 3600;
export const dynamicParams = false;

export function generateStaticParams() {
  return EVENTS.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const event = getEvent((await params).slug);
  if (!event) return {};
  const when = `${formatDate(event)}, ${formatTime(event)}`;
  return {
    title: `${event.name} | ${event.place}`,
    description: `${event.summary} ${when}.${event.entry ? ` Entrada: ${event.entry}.` : ""}`,
    openGraph: {
      title: event.name,
      description: `${when} — ${event.place}.${event.entry ? ` Entrada: ${event.entry}.` : ""}`,
      type: "website",
      locale: "pt_BR",
    },
  };
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const event = getEvent((await params).slug);
  if (!event) notFound();

  const mapsQuery = encodeURIComponent(`${event.place}, ${event.address}`);
  const past = isPast(event);

  return (
    <LanguageProvider>
      <div className="relative overflow-hidden selection:bg-accent selection:text-primary min-h-screen">
        <SiteLogo />
        <main className="min-h-screen pt-28 px-6 max-w-4xl mx-auto space-y-14 pb-24">
          <Link href="/eventos" className="inline-flex items-center text-primary/60 hover:text-primary transition-colors group">
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Todos os eventos
          </Link>

          <header className="space-y-6 text-center">
            <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto">
              <Music className="w-8 h-8 text-accent" />
            </div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-primary/50">
              {past ? "Evento encerrado" : "Você está convidado"}
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-primary leading-tight">{event.name}</h1>
            <p className="text-gray-500 max-w-xl mx-auto text-lg">{event.description}</p>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoCard icon={<CalendarDays className="w-6 h-6 text-accent" />} label="Data" value={formatDate(event)} />
            <InfoCard icon={<Clock className="w-6 h-6 text-accent" />} label="Horário" value={formatTime(event)} />
            <InfoCard icon={<MapPin className="w-6 h-6 text-accent" />} label="Local" value={event.place} sub={event.address} />
          </section>

          {event.entry && (
            <section className="rounded-[2.5rem] bg-primary text-white p-8 md:p-10 space-y-5 shadow-2xl shadow-primary/20">
              <div className="flex items-center gap-3">
                <Package className="w-7 h-7 text-accent" />
                <h2 className="text-2xl font-bold">Como participar</h2>
              </div>
              <p className="text-blue-100/80 text-lg font-light">
                A entrada é <strong className="text-accent font-bold">{event.entry}</strong>.
                {event.entryNote && <> {event.entryNote}</>}
              </p>
              {event.destination && (
                <div className="flex items-start gap-3 text-blue-100/70 font-light">
                  <HeartHandshake className="w-5 h-5 mt-1 shrink-0 text-accent" />
                  <p>{event.destination}</p>
                </div>
              )}
            </section>
          )}

          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <MapPin className="w-6 h-6 text-accent" />
              <h2 className="text-2xl font-bold text-primary">Como chegar</h2>
            </div>
            <p className="text-gray-500">{event.place} — {event.address}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button variant="accent" className="h-14 rounded-2xl gap-2 font-bold shadow-lg shadow-accent/20" asChild>
                <a href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`} target="_blank" rel="noopener noreferrer">
                  <Navigation className="w-4 h-4" />
                  Google Maps
                </a>
              </Button>
              <Button variant="outline" className="h-14 rounded-2xl border-gray-200 hover:bg-[#33CCFF] hover:text-white transition-all" asChild>
                <a href={`https://waze.com/ul?q=${mapsQuery}&navigate=yes`} target="_blank" rel="noopener noreferrer">
                  Ir de Waze
                </a>
              </Button>
            </div>
          </section>

          {event.instagram && event.instagram.length > 0 && (
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <Instagram className="w-6 h-6 text-accent" />
                <h2 className="text-2xl font-bold text-primary">Veja no Instagram</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {event.instagram.map((post) => {
                  const url = `https://www.instagram.com/${post.kind}/${post.id}/`;
                  return (
                    <div key={post.id} className="rounded-3xl overflow-hidden border border-gray-100 bg-white shadow-lg shadow-primary/5">
                      <iframe
                        src={`${url}embed`}
                        title={`Publicação do Instagram ${post.id}`}
                        className="w-full border-0"
                        height={560}
                        loading="lazy"
                        allow="encrypted-media"
                      />
                      <a href={url} target="_blank" rel="noopener noreferrer" className="block text-center py-3 text-sm font-semibold text-primary hover:text-accent transition-colors">
                        Abrir no Instagram
                      </a>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}

function InfoCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-3xl bg-white border border-gray-100 shadow-lg shadow-primary/5 p-6 space-y-2">
      <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">{icon}</div>
      <p className="text-xs font-bold uppercase tracking-widest text-primary/40">{label}</p>
      <p className="text-xl font-bold text-primary">{value}</p>
      {sub && <p className="text-sm text-gray-500">{sub}</p>}
    </div>
  );
}
