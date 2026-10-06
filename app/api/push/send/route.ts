import { NextResponse } from "next/server";
import { countSubscriptions, isAdmin, sendToAll, type Notification } from "@/lib/push";
import { formatDate, formatTime, getEvent } from "@/lib/events";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Envia uma notificação a todos os inscritos. Protegido por ADMIN_TOKEN.
 * Corpo: { eventSlug } (monta a mensagem do evento) ou { title, body, url }.
 * Com "dryRun": true só mostra a mensagem e o nº de inscritos, sem enviar.
 */
export async function POST(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: "não autorizado" }, { status: 401 });
  const input = await req.json().catch(() => null);
  if (!input) return NextResponse.json({ error: "JSON inválido" }, { status: 400 });

  let n: Notification;
  if (typeof input.eventSlug === "string") {
    const e = getEvent(input.eventSlug);
    if (!e) return NextResponse.json({ error: "evento não encontrado" }, { status: 404 });
    n = {
      title: `Novo evento: ${e.name}`,
      body: `${formatDate(e)}, ${formatTime(e)} — ${e.place}`,
      url: `/eventos/${e.slug}`,
    };
  } else {
    const { title, body, url } = input;
    const ok = (v: unknown, max: number) => typeof v === "string" && v.length > 0 && v.length <= max;
    if (!ok(title, 80) || !ok(body, 200) || !ok(url, 300) || !(url.startsWith("/") || url.startsWith("https://"))) {
      return NextResponse.json({ error: "title (≤80), body (≤200) e url (/caminho ou https://) são obrigatórios" }, { status: 400 });
    }
    n = { title, body, url };
  }

  try {
    if (input.dryRun) return NextResponse.json({ dryRun: true, notification: n, subscribers: await countSubscriptions() });
    return NextResponse.json({ notification: n, ...(await sendToAll(n)) });
  } catch (e) {
    console.error("push/send", e);
    return NextResponse.json({ error: String(e) }, { status: 503 });
  }
}
