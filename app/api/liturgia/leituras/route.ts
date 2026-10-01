import { getLiturgyDate } from "@/lib/liturgy";
import { getReadingsDate, getFullLiturgy } from "@/lib/daily-readings";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const requested = new URL(request.url).searchParams.get("data");
  const date = requested === null ? getLiturgyDate() : getReadingsDate(requested);
  const headers = { "Cache-Control": "no-store" };
  if (!date) return Response.json({ error: "Data inválida." }, { status: 400, headers });
  return Response.json(await getFullLiturgy(date), { headers });
}
