export const LITURGY_TIME_ZONE = "America/Sao_Paulo";

export type LiturgyDate = {
  iso: string;
  day: string;
  month: string;
  year: string;
  label: string;
};

export type DailyGospel = {
  status: "ready" | "unavailable";
  date: LiturgyDate;
  source: "Canção Nova";
  sourceUrl: string;
  reference?: string;
  excerpt?: string;
  celebration?: string;
};

export function getLiturgyDate(now = new Date()): LiturgyDate {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: LITURGY_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const part = (type: string) => parts.find((item) => item.type === type)!.value;
  const year = part("year");
  const month = part("month");
  const day = part("day");

  return {
    iso: `${year}-${month}-${day}`,
    day,
    month,
    year,
    label: new Intl.DateTimeFormat("pt-BR", {
      timeZone: LITURGY_TIME_ZONE,
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(now),
  };
}

export function getLiturgySourceUrl(date: LiturgyDate): string {
  const url = new URL("https://liturgia.cancaonova.com/pb/");
  url.searchParams.set("sAno", date.year);
  url.searchParams.set("sMes", String(Number(date.month)));
  url.searchParams.set("sDia", String(Number(date.day)));
  return url.href;
}

const entities: Record<string, string> = {
  amp: "&", quot: '"', apos: "'", nbsp: " ", lt: "<", gt: ">",
  aacute: "á", agrave: "à", acirc: "â", atilde: "ã", auml: "ä",
  eacute: "é", ecirc: "ê", egrave: "è", iacute: "í", igrave: "ì",
  oacute: "ó", ocirc: "ô", otilde: "õ", ouml: "ö", uacute: "ú", uuml: "ü",
  ccedil: "ç", ndash: "–", mdash: "—", hellip: "…",
  lsquo: "‘", rsquo: "’", ldquo: "“", rdquo: "”",
};

function textContent(html: string): string {
  return html
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (entity, key: string) => {
      if (key.startsWith("#")) {
        const hex = key[1].toLowerCase() === "x";
        const number = Number.parseInt(key.slice(hex ? 2 : 1), hex ? 16 : 10);
        return number > 0 && number <= 0x10ffff ? String.fromCodePoint(number) : "";
      }
      const value = entities[key.toLowerCase()];
      if (!value) return entity;
      return /^[A-Z]/.test(key) ? value.toUpperCase() : value;
    })
    .replace(/\s+/g, " ")
    .trim();
}

const months: Record<string, string> = {
  jan: "01", feb: "02", fev: "02", mar: "03", apr: "04", abr: "04",
  may: "05", mai: "05", jun: "06", jul: "07", aug: "08", ago: "08",
  sep: "09", set: "09", oct: "10", out: "10", nov: "11", dec: "12", dez: "12",
};

/** Extract only a brief preview. Never pass publisher HTML through to visitors. */
export function parseDailyGospel(html: string, date: LiturgyDate): DailyGospel {
  const header = html.match(/<hgroup\b[^>]*class=["'][^"']*\bcontent-header\b[^"']*["'][^>]*>([\s\S]*?)<\/hgroup>/i)?.[1];
  if (!header) throw new Error("Missing liturgical date");

  const field = (name: string) => textContent(header.match(
    new RegExp(`<span\\b[^>]*class=["']${name}["'][^>]*>([\\s\\S]*?)<\\/span>`, "i"),
  )?.[1] ?? "");
  if (field("dia").padStart(2, "0") !== date.day ||
      months[field("mes").toLowerCase().replace(/\.$/, "")] !== date.month ||
      field("ano") !== date.year) {
    throw new Error("The publisher returned another day");
  }

  const gospelTab = html.match(/<li\b[^>]*id=["']evangelho["'][^>]*>([\s\S]*?)<\/li>/i)?.[1];
  const target = gospelTab?.match(/href=["']#(liturgia-\d+)["']/i)?.[1];
  const reference = textContent(gospelTab?.match(/<div\b[^>]*class=["'][^"']*\breferencia\b[^"']*["'][^>]*>([\s\S]*?)<\/div>/i)?.[1] ?? "");
  if (!target || !reference || reference.length > 120) throw new Error("Missing Gospel reference");

  const opening = new RegExp(`<div\\b[^>]*id=["']${target}["'][^>]*>`, "i").exec(html);
  if (!opening) throw new Error("Missing Gospel reading");
  const section = html.slice(opening.index + opening[0].length).split(/<\/article>/i)[0];
  const paragraphs = [...section.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map((match) => textContent(
    match[1].replace(/<(strong|sup)\b[^>]*>\s*\d+[a-z]?\s*<\/\1>/gi, " "),
  ));
  const proclamation = paragraphs.findIndex((text) => /proclamação.*evangelho/i.test(text));
  const reading = proclamation >= 0
    ? paragraphs.slice(proclamation + 1).find((text) =>
      text.length > 40 && !/^[-–—]/.test(text) && !/^Glória a vós/i.test(text))
    : undefined;
  if (!reading || reading.includes("&")) throw new Error("Missing readable Gospel text");

  const words = reading.split(/\s+/);
  const excerpt = words.length > 24
    ? words.slice(0, 24).join(" ").replace(/[,;:]$/, "") + "…"
    : reading;
  const celebration = textContent(header.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? "").split(" | ")[0];

  return {
    status: "ready",
    date,
    source: "Canção Nova",
    sourceUrl: getLiturgySourceUrl(date),
    reference,
    excerpt,
    celebration: celebration.slice(0, 220),
  };
}
