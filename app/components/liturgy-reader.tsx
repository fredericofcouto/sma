"use client";

import { useEffect, useRef, useState } from "react";
import { getLiturgyDate, getLiturgySourceUrl } from "@/lib/liturgy";
import { getReadingsDate, shiftReadingDay, shiftReadingMonth, type FullLiturgy } from "@/lib/daily-readings";

function Chevron({ direction }: { direction: "left" | "right" }) {
  return <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={direction === "left" ? "m14 6-6 6 6 6" : "m10 6 6 6-6 6"} /></svg>;
}

const week = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
const colors: Record<string, string> = { Verde: "green", Vermelho: "red", Roxo: "purple", Rosa: "rose", Branco: "white" };

export default function LiturgyReader({ initial }: { initial: FullLiturgy }) {
  const [selected, setSelected] = useState(initial.date.iso);
  const [month, setMonth] = useState(initial.date.iso.slice(0, 7));
  const [liturgy, setLiturgy] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const firstEffect = useRef(true);
  const [today, setToday] = useState(() => getLiturgyDate().iso);
  const date = getReadingsDate(selected)!;
  const firstOfMonth = new Date(`${month}-01T12:00:00Z`);
  const endOfMonth = new Date(`${shiftReadingMonth(month, 1)}-01T12:00:00Z`);
  endOfMonth.setUTCDate(0);
  const offset = firstOfMonth.getUTCDay();
  const days = endOfMonth.getUTCDate();
  const rows = Math.ceil((offset + days) / 7);
  const monthLabel = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric", timeZone: "UTC" }).format(firstOfMonth);
  const ready = !loading && liturgy.date.iso === selected && liturgy.status === "ready";

  function choose(iso: string) {
    if (!getReadingsDate(iso) || iso === selected) return;
    const calendarHadFocus = document.getElementById("liturgy-calendar-body")?.contains(document.activeElement);
    setSelected(iso);
    setMonth(iso.slice(0, 7));
    setLoading(true);
    setCalendarOpen(false);
    const url = new URL(window.location.href);
    url.searchParams.set("data", iso);
    url.hash = "";
    window.history.replaceState(window.history.state, "", url);
    window.requestAnimationFrame(() => {
      const content = document.getElementById("leituras");
      if (calendarHadFocus && window.matchMedia("(max-width: 720px)").matches) {
        content?.focus({ preventScroll: true });
      }
      content?.scrollIntoView({
        block: "start", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      });
    });
  }

  useEffect(() => {
    if (firstEffect.current) {
      firstEffect.current = false;
      if (initial.status === "ready") return;
    }
    const controller = new AbortController();
    let disposed = false;
    const timeout = window.setTimeout(() => controller.abort(), 12_000);
    async function load() {
      setLoading(true);
      try {
        const response = await fetch(`/api/liturgia/leituras?data=${selected}`, { signal: controller.signal, cache: "no-store" });
        if (!response.ok) throw new Error("Leituras indisponíveis");
        const result = await response.json() as FullLiturgy;
        if (result.date?.iso !== selected || !Array.isArray(result.groups) ||
            !["ready", "not-found", "unavailable"].includes(result.status)) throw new Error("Resposta inválida");
        if (!disposed) setLiturgy(result);
      } catch {
        if (!disposed) setLiturgy({ status: "unavailable", date: getReadingsDate(selected)!, groups: [] });
      } finally {
        window.clearTimeout(timeout);
        if (!disposed) setLoading(false);
      }
    }
    void load();
    return () => { disposed = true; controller.abort(); window.clearTimeout(timeout); };
  }, [selected, attempt, initial.status]);

  useEffect(() => {
    const update = () => setToday(getLiturgyDate().iso);
    const timer = window.setInterval(update, 60_000);
    window.addEventListener("focus", update);
    return () => { window.clearInterval(timer); window.removeEventListener("focus", update); };
  }, []);

  useEffect(() => {
    if (ready && window.location.hash === "#evangelho") {
      document.getElementById("evangelho")?.scrollIntoView({ block: "start" });
    }
  }, [ready]);

  return (
    <div className="shell liturgy-layout">
      <aside className="liturgy-sidebar" aria-label="Calendário da liturgia">
        <div className={`liturgy-calendar${calendarOpen ? " calendar-open" : ""}`}>
          <h2>Escolha a data</h2>
          <button className="liturgy-calendar-toggle" type="button" aria-expanded={calendarOpen} aria-controls="liturgy-calendar-body" onClick={() => setCalendarOpen((open) => !open)}><span>Escolher outra data</span><Chevron direction="right" /></button>
          <div id="liturgy-calendar-body">
          <div className="liturgy-month-nav">
            <button type="button" className="liturgy-icon-button" aria-label="Mês anterior" onClick={() => setMonth(shiftReadingMonth(month, -1))}><Chevron direction="left" /></button>
            <p aria-live="polite">{monthLabel}</p>
            <button type="button" className="liturgy-icon-button" aria-label="Próximo mês" onClick={() => setMonth(shiftReadingMonth(month, 1))}><Chevron direction="right" /></button>
          </div>
          <table className="liturgy-month">
            <caption className="sr-only">Calendário de {monthLabel}</caption>
            <thead><tr>{week.map((day) => <th key={day} scope="col"><abbr title={day}>{day.charAt(0).toUpperCase()}</abbr></th>)}</tr></thead>
            <tbody>{Array.from({ length: rows }, (_, row) => <tr key={row}>{week.map((_, column) => {
              const day = row * 7 + column - offset + 1;
              if (day < 1 || day > days) return <td key={column} />;
              const iso = `${month}-${String(day).padStart(2, "0")}`;
              const label = getReadingsDate(iso)!.label;
              return <td key={column}><button type="button" className={`liturgy-day${iso === selected ? " is-selected" : ""}${iso === today ? " is-today" : ""}`} aria-label={`${label}${iso === today ? ", hoje" : ""}`} aria-pressed={iso === selected} onClick={() => choose(iso)}>{day}</button></td>;
            })}</tr>)}</tbody>
          </table>
          <button className="liturgy-today" type="button" onClick={() => { choose(today); setMonth(today.slice(0, 7)); }}>Ir para hoje</button>
          <div className="liturgy-date-input"><label htmlFor="liturgy-date">Ir para uma data</label><input id="liturgy-date" type="date" value={selected} onChange={(event) => choose(event.target.value)} /></div>
          </div>
        </div>
        <p className="liturgy-provider">Leituras fornecidas por <a href="https://github.com/Dancrf/liturgia-diaria" target="_blank" rel="noopener noreferrer">Liturgia Diária<span className="sr-only"> (abre em nova aba)</span></a>.</p>
      </aside>

      <div id="leituras" className="liturgy-content" tabIndex={-1}>
        <div className="liturgy-day-nav">
          <button type="button" className="liturgy-day-step" onClick={() => choose(shiftReadingDay(selected, -1))}><Chevron direction="left" /><span>Dia anterior</span></button>
          <button type="button" className="liturgy-day-step" onClick={() => choose(shiftReadingDay(selected, 1))}><span>Próximo dia</span><Chevron direction="right" /></button>
        </div>
        <div className="liturgy-date-heading">
          <h2><time dateTime={date.iso}>{date.label}</time></h2>
          {ready && liturgy.celebration && <p className="liturgy-celebration">{liturgy.celebration}</p>}
          {ready && liturgy.color && <p className="liturgy-color"><span className={`liturgy-color-dot color-${colors[liturgy.color]}`} aria-hidden="true" />Cor litúrgica: {liturgy.color.toLowerCase()}</p>}
        </div>
        <div aria-live="polite" aria-busy={loading}>
          {loading ? (
            <div className="liturgy-loading" role="status"><p>Carregando as leituras de {date.day}/{date.month}/{date.year}…</p><div className="liturgy-loading-lines" aria-hidden="true"><span /><span /><span /></div></div>
          ) : ready ? (
            <>
              <nav className="liturgy-reading-nav" aria-label="Ir para uma leitura">{liturgy.groups.map((group) => <a key={group.id} href={`#${group.id}`}>{group.label === "Salmo responsorial" ? "Salmo" : group.label}</a>)}</nav>
              {liturgy.groups.map((group) => <section className={`liturgy-reading${group.id === "evangelho" ? " liturgy-gospel" : ""}`} id={group.id} key={group.id} aria-labelledby={`heading-${group.id}`}>
                <h3 id={`heading-${group.id}`}>{group.label}</h3>
                {group.readings.map((reading, index) => <div className="liturgy-reading-version" key={`${reading.reference}-${index}`}>
                  {group.readings.length > 1 && <p className="liturgy-reading-option">{group.id === "outras-leituras" ? reading.title : `Opção ${index + 1}`}</p>}
                  {reading.reference && <p className="liturgy-reference">{reading.reference}</p>}
                  {reading.title !== group.label && <p className="liturgy-proclamation">{reading.title}</p>}
                  {reading.refrain && <p className="liturgy-refrain">{reading.refrain}</p>}
                  <div className="liturgy-reading-text">{reading.text.split(/\n+/).filter((paragraph) => paragraph.trim()).map((paragraph, p) => <p key={p}>{paragraph}</p>)}</div>
                </div>)}
              </section>)}
              <div className="liturgy-reading-end"><a href={getLiturgySourceUrl(date)} target="_blank" rel="noopener noreferrer">Consultar também na Canção Nova<span className="sr-only"> (abre em nova aba)</span></a></div>
            </>
          ) : (
            <div className="liturgy-unavailable" role="status">
              <h3>{liturgy.status === "not-found" ? "Leituras ainda não disponíveis" : "Não foi possível carregar as leituras"}</h3>
              <p>{liturgy.status === "not-found" ? "A fonte não possui leituras para a data escolhida. Você pode consultar outro dia no calendário." : "Tente novamente ou consulte a liturgia desta data na Canção Nova."}</p>
              <div><button type="button" className="button button-dark" onClick={() => setAttempt((value) => value + 1)}>Tentar novamente</button><a href={getLiturgySourceUrl(date)} target="_blank" rel="noopener noreferrer">Consultar na Canção Nova<span className="sr-only"> (abre em nova aba)</span></a></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
