import { randomUUID } from "crypto";
import { redis, hashAll } from "./redis";
import type { Member } from "./matching";

export type { Member };
export type Visit = {
  id: string;
  visitor_name: string;
  visitor_age: number;
  visitor_gender: string;
  visitor_neighborhood: string;
  visitor_religion: string;
  is_adventist: boolean;
  member_id: string;
  created_at: string;
};

const MEMBERS = "members";
const VISITS = "visits";
export const MAX_MEMBERS = 500;

export const listMembers = () => hashAll<Omit<Member, "id">>(MEMBERS) as Promise<Member[]>;
export const listVisits = async () =>
  (await hashAll<Omit<Visit, "id">>(VISITS) as Visit[]).sort((a, b) => b.created_at.localeCompare(a.created_at));

export async function getMember(id: string) {
  const raw = await redis<string | null>(["HGET", MEMBERS, id]);
  return raw ? ({ ...JSON.parse(raw), id } as Member) : null;
}

export async function saveMember(data: Omit<Member, "id"> & Record<string, unknown>, id: string = randomUUID()) {
  await redis(["HSET", MEMBERS, id, JSON.stringify(data)]);
  return id;
}

export const deleteMember = (id: string) => redis(["HDEL", MEMBERS, id]);
export const countMembers = () => redis<number>(["HLEN", MEMBERS]);

export async function logVisit(v: Omit<Visit, "id" | "created_at">) {
  await redis(["HSET", VISITS, randomUUID(), JSON.stringify({ ...v, created_at: new Date().toISOString() })]);
}
