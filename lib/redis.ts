function redisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  if (!url || !token) throw new Error("Redis não configurado (UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN)");
  return { url, token };
}

export async function redis<T = unknown>(cmd: (string | number)[]): Promise<T> {
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

/** Lê um hash inteiro como lista de objetos JSON (campo vira `id`). */
export async function hashAll<T>(key: string): Promise<(T & { id: string })[]> {
  const flat = await redis<string[]>(["HGETALL", key]);
  const out: (T & { id: string })[] = [];
  for (let i = 0; i < flat.length; i += 2) {
    try {
      out.push({ ...JSON.parse(flat[i + 1]), id: flat[i] });
    } catch {
      /* entrada corrompida: ignora */
    }
  }
  return out;
}
