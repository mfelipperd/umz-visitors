import { NextResponse } from "next/server";
import { addSubscription, parseSubscription } from "@/lib/push";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const sub = parseSubscription(await req.json().catch(() => null));
  if (!sub) return NextResponse.json({ error: "inscrição inválida" }, { status: 400 });
  try {
    await addSubscription(sub);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("push/subscribe", e);
    return NextResponse.json({ error: "não foi possível salvar" }, { status: 503 });
  }
}
