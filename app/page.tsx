"use client";

import { useState } from "react";

const masses = [
  {
    day: "Domingo",
    times: [
      "07h50 · Comunidade Sant'Ana",
      "09h00 · Igreja Matriz",
      "19h30 · Comunidade Divino Pai Eterno",
      "19h30 · Comunidade São Sebastião",
    ],
  },
  { day: "Quarta-feira", times: ["19h30 · Igreja Matriz"] },
  { day: "Sábado", times: ["19h00 · Igreja Matriz"] },
];

const events = [
  {
    title: "Catequese",
    text: "Caminhos de formação e encontro para crianças, jovens e famílias.",
    image: "https://i.imgur.com/Yl8rUjc.jpg",
    href: "/catequese",
  },
  {
    title: "Festa do Padroeiro",
    text: "Celebrações, devoção e convivência em honra a São Miguel Arcanjo.",
    image: "https://i.imgur.com/bCNj9FO.jpg",
    href: "/festa-padroeiro",
  },
  {
    title: "Avisos semanais",
    text: "Acompanhe os comunicados e a programação da nossa comunidade.",
    image: "https://i.imgur.com/mDunjZK.png",
    href: "/avisos-semanais",
  },
  {
    title: "Web Rádio São Miguel",
    text: "A Hora do Angelus, de segunda a sexta-feira, às 18h.",
    image: "https://i.imgur.com/ESfX1OX.png",
    href: "/web-radio",
  },
];

const navigation = [
  ["Início", "inicio"],
  ["A paróquia", "paroquia"],
  ["Missas", "missas"],
  ["Agenda", "agenda"],
  ["Contato", "contato"],
] as const;

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <main>
      <a className="skip-link" href="#conteudo">Ir para o conteúdo</a>

      <header className="site-header">
        <div className="shell header-inner">
          <a className="brand" href="#inicio" onClick={closeMenu}>
            <span className="brand-mark" aria-hidden="true">✠</span>
            <span>
              <strong>Paróquia São Miguel Arcanjo</strong>
              <small>São Miguel do Araguaia · GO</small>
            </span>
          </a>

          <button
            className="menu-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="navegacao-principal"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="sr-only">{menuOpen ? "Fechar" : "Abrir"} menu</span>
            <span aria-hidden="true">{menuOpen ? "×" : "☰"}</span>
          </button>

          <nav id="navegacao-principal" className={menuOpen ? "nav nav-open" : "nav"} aria-label="Navegação principal">
            {navigation.map(([label, id]) => (
              <a key={id} href={`#${id}`} onClick={closeMenu}>{label}</a>
            ))}
            <a className="nav-action" href="#missas" onClick={closeMenu}>Participe</a>
          </nav>
        </div>
      </header>

      <section id="inicio" className="hero" aria-labelledby="hero-title">
        <img
          className="hero-image"
          src="https://i.imgur.com/ggKPu86.jpg"
          alt="Igreja da Paróquia São Miguel Arcanjo"
        />
        <div className="hero-shade" />
        <div className="shell hero-content">
          <p className="eyebrow light">Bem-vindos à nossa comunidade</p>
          <h1 id="hero-title">Fé que acolhe.<br />Esperança que reúne.</h1>
          <p className="hero-copy">Um lugar de oração, encontro e serviço para caminhar com Cristo em São Miguel do Araguaia.</p>
          <div className="hero-actions">
            <div className="hero-quick-links">
              <a className="button button-primary" href="#missas">Horários das missas <span aria-hidden="true">→</span></a>
              <a className="button button-liturgia" href="https://sagradaliturgia.com.br/" target="_blank" rel="noreferrer">Liturgia diária e homilias <span aria-hidden="true">↗</span></a>
            </div>
            <a className="button button-quiet" href="#contato">Fale conosco</a>
          </div>
        </div>
      </section>

      <section id="conteudo" className="intro section" aria-labelledby="intro-title">
        <div className="shell intro-grid">
          <div>
            <p className="eyebrow">Nossa paróquia</p>
            <h2 id="intro-title">Um convite para viver a fé em comunidade.</h2>
          </div>
          <div className="intro-copy">
            <p>A Paróquia São Miguel Arcanjo é casa de portas abertas: um espaço de celebração, escuta e cuidado com as pessoas.</p>
            <p>Há mais de 50 anos, a comunidade caminha unida, anunciando o Evangelho e sendo presença de esperança em nossa cidade.</p>
            <a className="text-link" href="#contato">Conheça e participe <span aria-hidden="true">→</span></a>
          </div>
        </div>
      </section>

      <section id="paroquia" className="story section section-soft" aria-labelledby="story-title">
        <div className="shell story-grid">
          <div className="story-image-wrap">
            <img src="https://i.imgur.com/wQBXBhW.jpg" alt="Comunidade reunida na Paróquia São Miguel Arcanjo" />
          </div>
          <div className="story-copy">
            <p className="eyebrow">Caminhamos juntos</p>
            <h2 id="story-title">Serviço, fraternidade e oração.</h2>
            <blockquote>“O amor é paciente, o amor é bondoso.”<cite>1 Coríntios 13:4</cite></blockquote>
            <p>Em cada celebração, pastoral e gesto de solidariedade, renovamos o compromisso de ser uma comunidade próxima, missionária e acolhedora.</p>
          </div>
        </div>
      </section>

      <section id="missas" className="section masses" aria-labelledby="masses-title">
        <div className="shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Celebrações</p>
              <h2 id="masses-title">Horários das missas</h2>
            </div>
            <p>Reserve este momento para a oração, a Palavra e a comunhão.</p>
          </div>
          <div className="mass-list">
            {masses.map((mass) => (
              <article className="mass-row" key={mass.day}>
                <h3>{mass.day}</h3>
                <ul>{mass.times.map((time) => <li key={time}>{time}</li>)}</ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="agenda" className="section section-blue" aria-labelledby="agenda-title">
        <div className="shell">
          <div className="section-heading heading-light">
            <div>
              <p className="eyebrow light">Vida paroquial</p>
              <h2 id="agenda-title">Agenda e comunicados</h2>
            </div>
            <p>Informações para acompanhar e participar da vida da comunidade.</p>
          </div>
          <div className="event-grid">
            {events.map((event) => (
              <a className="event-card" href={event.href} key={event.title}>
                <div className="event-image"><img src={event.image} alt="" /></div>
                <div className="event-body">
                  <h3>{event.title}</h3>
                  <p>{event.text}</p>
                  <span>Saiba mais <b aria-hidden="true">→</b></span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section giving" aria-labelledby="giving-title">
        <div className="shell giving-inner">
          <div>
            <p className="eyebrow">Contribuições</p>
            <h2 id="giving-title">Sua generosidade fortalece a missão.</h2>
            <p>O dízimo e as doações ajudam a sustentar as celebrações, as ações sociais e o cuidado cotidiano com a nossa paróquia.</p>
          </div>
          <div className="giving-actions">
            <a className="button button-dark" href="#contato">Informações sobre dízimo</a>
            <a className="text-link" href="https://sagradaliturgia.com.br/" target="_blank" rel="noreferrer">Liturgia diária <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </section>

      <section id="contato" className="contact section section-soft" aria-labelledby="contact-title">
        <div className="shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Estamos perto</p>
              <h2 id="contact-title">Fale conosco</h2>
            </div>
            <p>Venha nos visitar ou entre em contato com a secretaria paroquial.</p>
          </div>
          <div className="contact-grid">
            <address className="contact-details">
              <div><span>Endereço</span><p>R. 2, 376–444 · Setor Centro<br />São Miguel do Araguaia – GO<br />CEP 76590-000</p></div>
              <div><span>Telefone</span><a href="tel:+556233641191">(62) 3364-1191</a></div>
              <div><span>WhatsApp</span><a href="https://wa.me/5562982717499" target="_blank" rel="noreferrer">(62) 98271-7499</a></div>
              <div><span>E-mail</span><a href="mailto:contato@paroquiasaomiguel.com.br">contato@paroquiasaomiguel.com.br</a></div>
            </address>
            <div className="map-wrap">
              <iframe
                title="Localização da Paróquia São Miguel Arcanjo"
                src="https://www.google.com/maps?q=-13.27339,-50.15872&z=17&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="shell footer-grid">
          <div>
            <div className="footer-brand"><span aria-hidden="true">✠</span><strong>Paróquia São Miguel Arcanjo</strong></div>
            <p>São Miguel do Araguaia · Goiás</p>
          </div>
          <div className="socials" aria-label="Redes sociais">
            <a className="social-facebook" href="https://www.facebook.com/ParoqSaoMiguelArcanjo/" target="_blank" rel="noreferrer" aria-label="Facebook" title="Facebook">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8h3V4h-3c-3 0-5 2-5 5v3H6v4h3v4h4v-4h3l1-4h-4V9c0-.6.4-1 1-1Z" /></svg>
            </a>
            <a className="social-instagram" href="https://www.instagram.com/paroquiasaomiguelarcanjo.sma/" target="_blank" rel="noreferrer" aria-label="Instagram" title="Instagram">
              <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="4" /><circle cx="12" cy="12" r="3.5" /><circle cx="17.2" cy="6.8" r=".8" fill="currentColor" stroke="none" /></svg>
            </a>
            <a className="social-youtube" href="https://www.youtube.com/c/ParoquiaSaoMiguelArcanjo" target="_blank" rel="noreferrer" aria-label="YouTube" title="YouTube">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path className="youtube-mark" d="M21.58 7.19a2.94 2.94 0 0 0-2.07-2.08C17.68 4.6 12 4.6 12 4.6s-5.68 0-7.51.51a2.94 2.94 0 0 0-2.07 2.08A30.4 30.4 0 0 0 1.9 12a30.4 30.4 0 0 0 .52 4.81 2.94 2.94 0 0 0 2.07 2.08c1.83.51 7.51.51 7.51.51s5.68 0 7.51-.51a2.94 2.94 0 0 0 2.07-2.08A30.4 30.4 0 0 0 22.1 12a30.4 30.4 0 0 0-.52-4.81Z" /><path d="M10 8.8v6.4l5.5-3.2L10 8.8Z" className="social-play" /></svg>
            </a>
            <a className="social-whatsapp" href="https://wa.me/5562982717499" target="_blank" rel="noreferrer" aria-label="WhatsApp" title="WhatsApp">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 11.7a8.5 8.5 0 0 1-12.8 7.4L3.5 20l.9-4a8.5 8.5 0 1 1 16.1-4.3Z" /><path d="M9.2 8.2c.2-.3.4-.3.7-.3h.5c.2 0 .4.1.5.4l.6 1.5c.1.2.1.4-.1.6l-.5.7c.5 1 1.3 1.7 2.3 2.2l.7-.5c.2-.1.4-.2.6-.1l1.5.7c.2.1.3.3.3.5v.5c0 .3-.1.5-.3.7-.4.3-.8.5-1.3.5-1.1 0-2.5-.7-3.8-1.9-1.3-1.2-2.1-2.6-2.1-3.7 0-.5.2-1 .4-1.3Z" /></svg>
            </a>
          </div>
        </div>
        <div className="shell footer-bottom">© 2026 Paróquia São Miguel Arcanjo. Todos os direitos reservados.</div>
      </footer>
    </main>
  );
}
