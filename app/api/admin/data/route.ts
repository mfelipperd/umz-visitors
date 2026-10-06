import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/push";
import { listMembers, listVisits } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: "não autorizado" }, { status: 401 });
  try {
    const [members, visits] = await Promise.all([listMembers(), listVisits()]);
    return NextResponse.json({ members, visits });
  } catch (e) {
    console.error("admin/data", e);
    return NextResponse.json({ error: "indisponível" }, { status: 503 });
  }
}
