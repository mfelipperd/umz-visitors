export interface Member {
  id: string;
  name: string;
  age: number;
  phone: string;
  gender?: string;
  neighborhood?: string;
  is_active: boolean;
}

/** Escolhe o anfitrião mais compatível entre os membros ativos (roda só no servidor). */
export function pickBestMember(
  members: Member[],
  visitorAge: number,
  visitorGender?: string,
  visitorNeighborhood?: string,
): Member | null {
  const active = members.filter((m) => m.is_active);
  if (active.length === 0) return null;

  const scored = active.map((m) => {
    let score = 0;
    if (visitorGender && m.gender === visitorGender) score += 100;
    if (visitorNeighborhood && m.neighborhood === visitorNeighborhood) score += 50;
    score -= Math.abs((m.age || 0) - visitorAge);
    return { m, score };
  });

  // Entre os 3 melhores, sorteia um para distribuir a carga.
  const top = scored.sort((a, b) => b.score - a.score).slice(0, 3);
  return top[Math.floor(Math.random() * top.length)].m;
}
