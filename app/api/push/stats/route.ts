import { NextResponse } from "next/server";
import { countSubscriptions, isAdmin } from "@/lib/push";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: "não autorizado" }, { status: 401 });
  try {
    return NextResponse.json({ subscribers: await countSubscriptions() });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 503 });
  }
}
