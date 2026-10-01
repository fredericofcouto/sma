import type { LiturgyDate } from "./liturgy";

export type LiturgyReading = {
  title: string;
  reference: string;
  text: string;
  refrain?: string;
};

export type LiturgyReadingGroup = {
  id: string;
  label: string;
  readings: LiturgyReading[];
};

export type FullLiturgy = {
  status: "ready" | "unavailable" | "not-found";
  date: LiturgyDate;
  celebration?: string;
  color?: string;
  groups: LiturgyReadingGroup[];
};

export function getReadingsDate(iso: string): LiturgyDate | undefined {
  if (typeof iso !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(iso) || iso.startsWith("0000")) return;
  const value = new Date(`${iso}T12:00:00Z`);
  if (!Number.isFinite(value.getTime()) || value.toISOString().slice(0, 10) !== iso) return;
  const [year, month, day] = iso.split("-");
  return {
    iso, year, month, day,
    label: new Intl.DateTimeFormat("pt-BR", {
      timeZone: "UTC", weekday: "long", day: "numeric", month: "long", year: "numeric",
    }).format(value),
  };
}

export function shiftReadingDay(iso: string, amount: number): string {
  const date = new Date(`${iso}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0, 10);
}

export function shiftReadingMonth(month: string, amount: number): string {
  const date = new Date(`${month}-01T12:00:00Z`);
  date.setUTCMonth(date.getUTCMonth() + amount);
  return date.toISOString().slice(0, 7);
}

function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid reading data");
  return value as Record<string, unknown>;
}

function text(value: unknown, limit = 100_000): string {
  if (typeof value !== "string" || value.length > limit) throw new Error("Invalid reading text");
  return value.replace(/\r/g, "").trim();
}

export function parseFullLiturgy(value: unknown, date: LiturgyDate): FullLiturgy {
  const data = record(value);
  if (data.data !== `${date.day}/${date.month}/${date.year}`) {
    throw new Error("The provider returned another date");
  }
  const readings = record(data.leituras);
  const definitions = [
    ["primeiraLeitura", "primeira-leitura", "Primeira leitura"],
    ["salmo", "salmo", "Salmo responsorial"],
    ["segundaLeitura", "segunda-leitura", "Segunda leitura"],
    ["extras", "outras-leituras", "Outras leituras"],
    ["evangelho", "evangelho", "Evangelho"],
  ];
  const groups: LiturgyReadingGroup[] = [];
  for (const [key, id, label] of definitions) {
    const items = readings[key];
    if (items === undefined) continue;
    if (!Array.isArray(items) || items.length > 30) throw new Error("Invalid reading list");
    if (!items.length) continue;
    groups.push({
      id, label,
      readings: items.map((item) => {
        const reading = record(item);
        const body = text(reading.texto);
        if (!body) throw new Error("Empty reading");
        return {
          title: typeof reading.titulo === "string" && reading.titulo.trim()
            ? text(reading.titulo, 600)
            : typeof reading.tipo === "string" ? text(reading.tipo, 600) : label,
          reference: typeof reading.referencia === "string" ? text(reading.referencia, 300) : "",
          text: body,
          refrain: typeof reading.refrao === "string" ? text(reading.refrao, 2000) : undefined,
        };
      }),
    });
  }
  if (!groups.some((group) => group.id === "evangelho")) throw new Error("Missing Gospel");
  const color = typeof data.cor === "string" ? text(data.cor, 30) : undefined;
  return {
    status: "ready", date, groups,
    celebration: text(data.liturgia, 600),
    color: color && ["Verde", "Vermelho", "Roxo", "Rosa", "Branco"].includes(color) ? color : undefined,
  };
}

const cache = new Map<string, { value: FullLiturgy; expires: number }>();
const pending = new Map<string, Promise<FullLiturgy>>();

export async function getFullLiturgy(date: LiturgyDate): Promise<FullLiturgy> {
  const cached = cache.get(date.iso);
  if (cached && cached.expires > Date.now()) return cached.value;
  const existing = pending.get(date.iso);
  if (existing) return existing;

  const request = (async (): Promise<FullLiturgy> => {
    try {
      const url = new URL("https://liturgia.up.railway.app/v2/");
      url.searchParams.set("dia", String(Number(date.day)));
      url.searchParams.set("mes", String(Number(date.month)));
      url.searchParams.set("ano", date.year);
      const response = await fetch(url, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(9000), cache: "no-store",
      });
      if (response.status === 404) return { status: "not-found", date, groups: [] };
      if (!response.ok) throw new Error(`Provider HTTP ${response.status}`);
      const body = await response.text();
      if (body.length > 512_000) throw new Error("Unexpected reading size");
      const value = parseFullLiturgy(JSON.parse(body), date);
      if (cache.size >= 40) cache.delete(cache.keys().next().value!);
      cache.set(date.iso, { value, expires: Date.now() + 60 * 60 * 1000 });
      return value;
    } catch (error) {
      console.warn("Liturgical readings unavailable:", error instanceof Error ? error.message : "Unknown error");
      return cached?.value ?? { status: "unavailable", date, groups: [] };
    } finally {
      pending.delete(date.iso);
    }
  })();
  pending.set(date.iso, request);
  return request;
}
