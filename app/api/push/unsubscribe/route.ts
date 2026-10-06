import { NextResponse } from "next/server";
import { removeSubscription } from "@/lib/push";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (typeof body?.endpoint !== "string") return NextResponse.json({ error: "endpoint ausente" }, { status: 400 });
  try {
    await removeSubscription(body.endpoint);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("push/unsubscribe", e);
    return NextResponse.json({ error: "não foi possível remover" }, { status: 503 });
  }
}
