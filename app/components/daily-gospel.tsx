"use client";

import { useEffect, useState } from "react";
import { getLiturgyDate, getLiturgySourceUrl, type DailyGospel, type LiturgyDate } from "@/lib/liturgy";
import bootstrap from "@/lib/liturgy-bootstrap.json";

export default function DailyGospelBlock() {
  const [gospel, setGospel] = useState<DailyGospel | null>(() =>
    bootstrap.date.iso === getLiturgyDate().iso ? bootstrap as DailyGospel : null);
  const [date, setDate] = useState<LiturgyDate | null>(() => gospel?.date ?? null);
  const [loading, setLoading] = useState(!gospel);

  useEffect(() => {
    let disposed = false;
    let pending = false;
    let lastAttempt = 0;
    let requestedDay = "";
    let controller: AbortController | undefined;

    async function refresh() {
      if (pending) return;
      const today = getLiturgyDate();
      pending = true;
      requestedDay = today.iso;
      lastAttempt = Date.now();
      setDate(today);
      setGospel((current) => current?.date.iso === today.iso ? current : null);
      setLoading(true);
      controller = new AbortController();
      const timeout = window.setTimeout(() => controller?.abort(), 12_000);

      try {
        const response = await fetch("/api/liturgia", { signal: controller.signal, cache: "no-store" });
        if (!response.ok) throw new Error("Leitura indisponível");
        const data = await response.json() as DailyGospel;
        if (data.date?.iso !== getLiturgyDate().iso) throw new Error("Leitura de outra data");
        if (data.status !== "ready" || !data.reference || !data.excerpt) throw new Error("Leitura indisponível");
        if (!disposed) setGospel(data);
      } catch {
        if (!disposed) setGospel((current) => current?.date.iso === getLiturgyDate().iso ? current : null);
      } finally {
        window.clearTimeout(timeout);
        pending = false;
        if (!disposed) setLoading(false);
      }
    }

    function checkDay() {
      if (document.visibilityState === "visible" &&
          (getLiturgyDate().iso !== requestedDay || Date.now() - lastAttempt >= 15 * 60 * 1000)) {
        void refresh();
      }
    }

    void refresh();
    const interval = window.setInterval(checkDay, 60_000);
    document.addEventListener("visibilitychange", checkDay);
    window.addEventListener("focus", checkDay);

    return () => {
      disposed = true;
      controller?.abort();
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", checkDay);
      window.removeEventListener("focus", checkDay);
    };
  }, []);

  const sourceUrl = date ? getLiturgySourceUrl(date) : "https://liturgia.cancaonova.com/pb/";

  return (
    <section id="evangelho-do-dia" className="daily-gospel" aria-labelledby="daily-gospel-title">
      <div className="shell daily-gospel-grid">
        <div className="daily-gospel-heading">
          <h2 id="daily-gospel-title">Evangelho do dia</h2>
          {date && <time dateTime={date.iso}>{date.label}</time>}
          {gospel?.celebration && <p className="daily-gospel-celebration">{gospel.celebration}</p>}
        </div>
        <div className="daily-gospel-reading" aria-live="polite" aria-busy={loading}>
          {gospel ? (
            <>
              <h3>{gospel.reference}</h3>
              <blockquote><p>“{gospel.excerpt}”</p></blockquote>
            </>
          ) : (
            <p className="daily-gospel-status">
              {loading ? "Buscando o Evangelho de hoje…" : "O trecho está indisponível no momento. A leitura completa está disponível na Canção Nova."}
            </p>
          )}
          <div className="daily-gospel-links">
            <a className="daily-gospel-full" href={sourceUrl} target="_blank" rel="noopener noreferrer">
              Ler Evangelho completo<span className="sr-only"> na Canção Nova (abre em nova aba)</span>
            </a>
            <span className="daily-gospel-source">Fonte: Canção Nova</span>
          </div>
        </div>
      </div>
    </section>
  );
}
