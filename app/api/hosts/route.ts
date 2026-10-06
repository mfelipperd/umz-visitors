import { NextResponse } from "next/server";
import { countMembers, listMembers, MAX_MEMBERS, saveMember } from "@/lib/db";
import { num, str } from "@/lib/validate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Lista pública: só id e nome dos anfitriões ativos (telefone nunca sai daqui).
export async function GET() {
  try {
    const hosts = (await listMembers())
      .filter((m) => m.is_active)
      .map((m) => ({ id: m.id, name: m.name }))
      .sort((a, b) => a.name.localeCompare(b.name));
    return NextResponse.json({ hosts });
  } catch (e) {
    console.error("hosts GET", e);
    return NextResponse.json({ hosts: [] }, { status: 503 });
  }
}

// Cadastro público de voluntário.
export async function POST(req: Request) {
  const b = await req.json().catch(() => null);
  const name = str(b?.name, 100);
  const age = num(b?.age, 10, 120);
  const phone = str(b?.phone, 30);
  const gender = str(b?.gender, 30);
  const neighborhood = str(b?.neighborhood, 80);
  if (!name || age === null || phone.replace(/\D/g, "").length < 10 || !gender || !neighborhood || b?.lgpdConsent !== true) {
    return NextResponse.json({ error: "dados inválidos" }, { status: 400 });
  }
  try {
    if ((await countMembers()) >= MAX_MEMBERS) return NextResponse.json({ error: "limite atingido" }, { status: 503 });
    await saveMember({ name, age, phone, gender, neighborhood, is_active: true, created_at: new Date().toISOString(), lgpd_consent: true });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("hosts POST", e);
    return NextResponse.json({ error: "indisponível" }, { status: 503 });
  }
}
