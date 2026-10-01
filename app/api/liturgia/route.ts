import { getLiturgyDate, getLiturgySourceUrl, parseDailyGospel, type DailyGospel } from "@/lib/liturgy";
import bootstrap from "@/lib/liturgy-bootstrap.json";

export const dynamic = "force-dynamic";

let cached: { gospel: DailyGospel; expiresAt: number } | undefined;

export async function GET() {
  const date = getLiturgyDate();
  const headers = { "Cache-Control": "no-store" };

  if (cached?.gospel.date.iso === date.iso && cached.expiresAt > Date.now()) {
    return Response.json(cached.gospel, { headers });
  }

  try {
    const response = await fetch(getLiturgySourceUrl(date), {
      headers: { Accept: "text/html" },
      signal: AbortSignal.timeout(9000),
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`Publisher returned HTTP ${response.status}`);
    const html = await response.text();
    if (html.length > 512_000) throw new Error("Unexpected publisher response");
    const gospel = parseDailyGospel(html, date);
    cached = { gospel, expiresAt: Date.now() + 60 * 60 * 1000 };
    return Response.json(gospel, { headers });
  } catch (error) {
    console.warn("Daily Gospel refresh failed:", error instanceof Error ? error.message : "Unknown source error");
    if (bootstrap.date.iso === date.iso) {
      return Response.json(bootstrap, { headers });
    }
    // A failed refresh must not label yesterday's reading as today's Gospel.
    return Response.json({
      status: "unavailable",
      date,
      source: "Canção Nova",
      sourceUrl: getLiturgySourceUrl(date),
    } satisfies DailyGospel, { headers });
  }
}
