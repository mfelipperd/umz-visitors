import { NextResponse } from "next/server";
import { listMembers, logVisit } from "@/lib/db";
import { pickBestMember } from "@/lib/matching";
import { num, str } from "@/lib/validate";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const b = await req.json().catch(() => null);
  const name = str(b?.name, 100);
  const age = num(b?.age, 1, 120);
  const gender = str(b?.gender, 30);
  const neighborhood = str(b?.neighborhood, 80);
  const religion = str(b?.religion, 40);
  if (!name || age === null || !gender) return NextResponse.json({ error: "dados inválidos" }, { status: 400 });

  try {
    const member = pickBestMember(await listMembers(), age, gender, neighborhood);
    if (!member) return NextResponse.json({ error: "no_match" }, { status: 404 });

    const adventist = religion === "Adventist";
    const text = adventist
      ? `Olá, meu nome é ${name}. Vi o site da igreja e gostaria de fazer uma visita para passarmos o sábado juntos.`
      : `Olá, meu nome é ${name}. Vi o site da igreja e gostaria de fazer uma visita para conhecer vocês.`;
    let phone = member.phone.replace(/\D/g, "");
    if (phone.length === 10 || phone.length === 11) phone = `55${phone}`;

    await logVisit({
      visitor_name: name,
      visitor_age: age,
      visitor_gender: gender,
      visitor_neighborhood: neighborhood,
      visitor_religion: religion,
      is_adventist: adventist,
      member_id: member.id,
    }).catch((e) => console.error("logVisit", e));

    return NextResponse.json({ url: `https://wa.me/${phone}?text=${encodeURIComponent(text)}` });
  } catch (e) {
    console.error("visit", e);
    return NextResponse.json({ error: "indisponível" }, { status: 503 });
  }
}
