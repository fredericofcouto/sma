import type { Metadata } from "next";
import Link from "next/link";
import { getLiturgyDate } from "@/lib/liturgy";
import { getFullLiturgy, getReadingsDate } from "@/lib/daily-readings";
import LiturgyReader from "../components/liturgy-reader";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Liturgia Diária | Paróquia São Miguel Arcanjo",
  description: "Leia a liturgia diária e escolha uma data no calendário da Paróquia São Miguel Arcanjo, em São Miguel do Araguaia.",
};

export default async function DailyLiturgyPage({ searchParams }: {
  searchParams: Promise<{ data?: string }>;
}) {
  const params = await searchParams;
  const date = (params.data && getReadingsDate(params.data)) || getLiturgyDate();
  const initial = await getFullLiturgy(date);

  return (
    <div className="liturgy-page">
      <a className="skip-link" href="#leituras">Ir para as leituras</a>
      <header className="site-header liturgy-site-header">
        <div className="shell header-inner">
          <Link className="brand" href="/">
            <span className="brand-mark" aria-hidden="true">✠</span>
            <span><strong>Paróquia São Miguel Arcanjo</strong><small>São Miguel do Araguaia · GO</small></span>
          </Link>
          <Link className="liturgy-home-link" href="/">Voltar ao início</Link>
        </div>
      </header>
      <main>
        <div className="liturgy-masthead">
          <div className="shell">
            <h1>Liturgia diária</h1>
            <p>Escolha uma data e acompanhe as leituras da missa.</p>
          </div>
        </div>
        <LiturgyReader initial={initial} />
      </main>
      <footer className="liturgy-footer">
        <div className="shell"><span>Paróquia São Miguel Arcanjo</span><Link href="/">Página inicial da paróquia</Link></div>
      </footer>
    </div>
  );
}
