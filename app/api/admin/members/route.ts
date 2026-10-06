import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/push";
import { saveMember } from "@/lib/db";
import { num, str } from "@/lib/validate";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: "não autorizado" }, { status: 401 });
  const b = await req.json().catch(() => null);
  const name = str(b?.name, 100);
  const age = num(b?.age, 1, 120);
  const phone = str(b?.phone, 30);
  if (!name || age === null || !phone) return NextResponse.json({ error: "dados inválidos" }, { status: 400 });
  try {
    const id = await saveMember({ name, age, phone, is_active: b?.is_active !== false, created_at: new Date().toISOString() });
    return NextResponse.json({ ok: true, id });
  } catch (e) {
    console.error("admin/members POST", e);
    return NextResponse.json({ error: "indisponível" }, { status: 503 });
  }
}
