import webpush from "web-push";
import { createHash, timingSafeEqual } from "crypto";

export type PushSub = { endpoint: string; keys: { p256dh: string; auth: string } };

const MAX_SUBSCRIBERS = 20000;
const HASH_KEY = "push:subs";

function redisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  if (!url || !token) throw new Error("Redis não configurado (UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN)");
  return { url, token };
}

async function redis<T = unknown>(cmd: (string | number)[]): Promise<T> {
  const { url, token } = redisConfig();
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmd),
    cache: "no-store",
  });
  const json = await res.json();
  if (!res.ok || json.error) throw new Error(`Redis: ${json.error ?? res.status}`);
  return json.result as T;
}

const idOf = (endpoint: string) => createHash("sha256").update(endpoint).digest("hex");

export function parseSubscription(input: unknown): PushSub | null {
  const s = input as Partial<PushSub> | null;
  if (!s || typeof s.endpoint !== "string" || s.endpoint.length > 1000) return null;
  if (!s.endpoint.startsWith("https://")) return null;
  const { p256dh, auth } = s.keys ?? ({} as PushSub["keys"]);
  if (typeof p256dh !== "string" || typeof auth !== "string" || p256dh.length > 200 || auth.length > 100) return null;
  return { endpoint: s.endpoint, keys: { p256dh, auth } };
}

export async function addSubscription(sub: PushSub) {
  const count = await redis<number>(["HLEN", HASH_KEY]);
  if (count >= MAX_SUBSCRIBERS) throw new Error("limite de inscritos atingido");
  await redis(["HSET", HASH_KEY, idOf(sub.endpoint), JSON.stringify(sub)]);
}

export async function removeSubscription(endpoint: string) {
  await redis(["HDEL", HASH_KEY, idOf(endpoint)]);
}

export async function countSubscriptions() {
  return redis<number>(["HLEN", HASH_KEY]);
}

async function allSubscriptions(): Promise<{ id: string; sub: PushSub }[]> {
  const flat = await redis<string[]>(["HGETALL", HASH_KEY]);
  const out: { id: string; sub: PushSub }[] = [];
  for (let i = 0; i < flat.length; i += 2) {
    try {
      out.push({ id: flat[i], sub: JSON.parse(flat[i + 1]) });
    } catch {
      /* entrada corrompida: ignora */
    }
  }
  return out;
}

export type Notification = { title: string; body: string; url: string };

export async function sendToAll(n: Notification) {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT;
  if (!publicKey || !privateKey || !subject) {
    throw new Error("VAPID não configurado (NEXT_PUBLIC_VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT)");
  }
  webpush.setVapidDetails(subject, publicKey, privateKey);

  const subs = await allSubscriptions();
  const payload = JSON.stringify(n);
  let sent = 0;
  let failed = 0;
  const dead: string[] = [];

  for (let i = 0; i < subs.length; i += 25) {
    await Promise.all(
      subs.slice(i, i + 25).map(async ({ id, sub }) => {
        try {
          await webpush.sendNotification(sub, payload, { TTL: 60 * 60 * 24 });
          sent++;
        } catch (err) {
          const code = (err as { statusCode?: number }).statusCode;
          if (code === 404 || code === 410) dead.push(id);
          else failed++;
        }
      }),
    );
  }
  for (const id of dead) await redis(["HDEL", HASH_KEY, id]);
  return { total: subs.length, sent, removed: dead.length, failed };
}

export function isAdmin(req: Request) {
  const expected = process.env.ADMIN_TOKEN;
  const given = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  if (!expected || expected.length < 24) return false;
  const a = createHash("sha256").update(given).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}
