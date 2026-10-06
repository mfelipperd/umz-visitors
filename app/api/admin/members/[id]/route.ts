import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/push";
import { deleteMember, getMember, saveMember } from "@/lib/db";
import { num, str } from "@/lib/validate";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Ctx) {
  if (!isAdmin(req)) return NextResponse.json({ error: "não autorizado" }, { status: 401 });
  const { id } = await params;
  const b = await req.json().catch(() => null);
  const name = str(b?.name, 100);
  const age = num(b?.age, 1, 120);
  const phone = str(b?.phone, 30);
  if (!name || age === null || !phone) return NextResponse.json({ error: "dados inválidos" }, { status: 400 });
  try {
    const current = await getMember(id);
    if (!current) return NextResponse.json({ error: "não encontrado" }, { status: 404 });
    const { id: _id, ...rest } = current;
    await saveMember({ ...rest, name, age, phone, is_active: b?.is_active !== false }, id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("admin/members PUT", e);
    return NextResponse.json({ error: "indisponível" }, { status: 503 });
  }
}

export async function DELETE(req: Request, { params }: Ctx) {
  if (!isAdmin(req)) return NextResponse.json({ error: "não autorizado" }, { status: 401 });
  try {
    await deleteMember((await params).id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("admin/members DELETE", e);
    return NextResponse.json({ error: "indisponível" }, { status: 503 });
  }
}
