import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import {
  KazAlert,
  KazBadge,
  KazButton,
  KazCheckbox,
  KazIcon,
  KazInput,
  KazProvider,
  KazSelect,
  KazTextarea,
  KazTopbar,
  KazTopbarIconButton,
  KazTopbarLink,
} from '@silvestrev/kaz';
import { AreaChart, BarStrip } from './charts';
import {
  faq,
  integrations,
  kpis,
  momentum,
  nav,
  photos,
  products,
  projectTypes,
  roles,
  services,
  sessionsCurrent,
  sessionsPrevious,
  specialties,
  steps,
  trust,
  upcoming,
  type Photo as PhotoData,
  type ServiceArt,
} from './content';

/** Endpoint que recebe o formulário (ex.: Formspree). Defina VITE_CONTACT_ENDPOINT no build. */
const CONTACT_ENDPOINT: string | undefined = import.meta.env.VITE_CONTACT_ENDPOINT;

type Theme = 'light' | 'dark';

function readTheme(): Theme {
  try {
    const saved = localStorage.getItem('bloo-theme');
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    /* armazenamento indisponível: segue a preferência do sistema */
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/** Seção atual, para marcar o item ativo do menu: a última cuja borda de cima já passou sob o topo fixo. */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const offset = 120; // altura do topo fixo + folga
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= offset) current = id;
      }
      setActive(atBottom ? ids[ids.length - 1] : current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [ids]);
  return active;
}

/** Entrada suave dos blocos marcados com data-reveal. Sem suporte ou com movimento reduzido, tudo aparece direto. */
function useReveal() {
  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) return;
    const root = document.documentElement;
    root.classList.add('reveal-on');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el));
    return () => {
      observer.disconnect();
      root.classList.remove('reveal-on');
    };
  }, []);
}

const sectionIds = nav.map((item) => item.href.slice(1));

export function App() {
  const [theme, setTheme] = useState<Theme>(readTheme);
  const [menuOpen, setMenuOpen] = useState(false);
  const active = useActiveSection(sectionIds);
  useReveal();

  useEffect(() => {
    document.documentElement.style.colorScheme = theme;
    document.body.style.background = theme === 'dark' ? '#0b0f19' : '#f4f4f6';
    try {
      localStorage.setItem('bloo-theme', theme);
    } catch {
      /* ignora */
    }
  }, [theme]);

  return (
    <KazProvider theme={theme} className="site">
      <a href="#conteudo" className="site-skip">
        Pular para o conteúdo
      </a>
      <Header active={active} theme={theme} onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <div className="frame">
        <main id="conteudo">
          <Hero />
          <Services />
          <Products />
          <Process />
          <Roles />
          <KazPanel />
          <Faq />
          <Contact />
        </main>
        <Footer />
      </div>
    </KazProvider>
  );
}

function Logo() {
  return (
    <a href="#inicio" className="logo" aria-label="Bloo, início">
      <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true">
        <rect width="32" height="32" rx="9" fill="var(--kaz-primary-solid)" />
        <circle cx="16" cy="18" r="6" fill="none" stroke="#fff" strokeWidth="3" />
        <path d="M10 6v12" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <span>bloo</span>
    </a>
  );
}

/** Botão escuro com seta, como o CTA principal da referência. */
function Cta({ href, children, size = 'md', fullWidth, onClick }: { href: string; children: ReactNode; size?: 'sm' | 'md' | 'lg'; fullWidth?: boolean; onClick?: () => void }) {
  return (
    <KazButton href={href} size={size} tone="neutral" className="cta" fullWidth={fullWidth} onClick={onClick} rightIcon={<KazIcon name="arrow-right" />}>
      {children}
    </KazButton>
  );
}

function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className="text-link">
      {children} <KazIcon name="arrow-right" />
    </a>
  );
}

function Header({ active, theme, onToggleTheme, menuOpen, setMenuOpen }: { active: string; theme: Theme; onToggleTheme: () => void; menuOpen: boolean; setMenuOpen: (open: boolean) => void }) {
  const close = () => setMenuOpen(false);
  return (
    <div className="header">
      <KazTopbar
        className="topbar"
        brand={<Logo />}
        onMenuClick={() => setMenuOpen(!menuOpen)}
        menuLabel={menuOpen ? 'Fechar menu' : 'Abrir menu'}
        nav={nav.map((item) => (
          <KazTopbarLink key={item.href} href={item.href} active={item.href === `#${active}`}>
            {item.label}
          </KazTopbarLink>
        ))}
        actions={
          <>
            <KazTopbarIconButton aria-label={theme === 'dark' ? 'Usar tema claro' : 'Usar tema escuro'} onClick={onToggleTheme}>
              <KazIcon name={theme === 'dark' ? 'sun' : 'moon'} />
            </KazTopbarIconButton>
            <span className="header__cta">
              <Cta href="#contato" size="sm">
                Agendar uma conversa
              </Cta>
            </span>
          </>
        }
      />
      {menuOpen && (
        <nav className="mobile-nav" aria-label="Menu">
          {nav.map((item) => (
            <a key={item.href} href={item.href} onClick={close}>
              {item.label}
            </a>
          ))}
          <Cta href="#contato" fullWidth onClick={close}>
            Agendar uma conversa
          </Cta>
        </nav>
      )}
    </div>
  );
}

/** Foto real. Sem `src`, mostra um espaço reservado dizendo que imagem colocar ali. */
function Photo({ photo, className }: { photo: PhotoData; className?: string }) {
  if (photo.src) {
    return (
      <div className={`photo${className ? ` ${className}` : ''}`}>
        <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" />
      </div>
    );
  }
  return (
    <div className={`photo photo--empty${className ? ` ${className}` : ''}`} role="img" aria-label={`Espaço para foto: ${photo.alt}`}>
      <span className="photo__hint" aria-hidden="true">
        <KazIcon name="user" />
        <strong>Espaço para foto</strong>
        <span>{photo.hint}</span>
      </span>
    </div>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

function SectionHead({ id, eyebrow, title, text, center, split }: { id: string; eyebrow: string; title: ReactNode; text?: string; center?: boolean; split?: boolean }) {
  if (split)
    return (
      <header className="section-head section-head--split" data-reveal>
        <div>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 id={id} className="h2">
            {title}
          </h2>
        </div>
        {text && <p className="lead">{text}</p>}
      </header>
    );
  return (
    <header className={`section-head${center ? ' section-head--center' : ''}`} data-reveal>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 id={id} className="h2">
        {title}
      </h2>
      {text && <p className="lead">{text}</p>}
    </header>
  );
}

/* ------------------------------------------------------------------ Hero */

function Hero() {
  return (
    <section id="inicio" className="section hero" aria-labelledby="hero-title">
      <div className="hero__copy">
        <p className="hero__badge">
          <span className="hero__badge-dot" aria-hidden="true" />
          HealthTech especializada em autismo
        </p>
        <h1 id="hero-title" className="h1 hero__title">
          Tecnologia à altura <span className="h1__accent">do cuidado no autismo.</span>
        </h1>
        <p className="lead hero__lead">Produtos, sistemas sob medida, dados e integrações para a rotina de terapeutas, gestores e famílias.</p>
        <div className="actions">
          <Cta href="#contato" size="lg">
            Agendar uma conversa
          </Cta>
          <TextLink href="#produtos">Conheça os produtos</TextLink>
        </div>
        <ul className="hero__trust" aria-label="Compromissos da Bloo">
          {trust.map((item) => (
            <li key={item.label}>
              <KazIcon name={item.icon} />
              {item.label}
            </li>
          ))}
        </ul>
      </div>
      <div className={`hero__visual${photos.hero.src ? ' hero__visual--photo' : ''}`}>
        {photos.hero.src && <img className="hero__photo" src={photos.hero.src} alt={photos.hero.alt} />}
        <Dashboard />
        <p className="hero__caption">Conceito de produto · Dados de demonstração</p>
      </div>
    </section>
  );
}

/** Mock do painel da clínica. Decorativo: escondido de leitores de tela. */
function Dashboard() {
  return (
    <div className="dash" aria-hidden="true" {...{ inert: '' }}>
      <nav className="dash__rail">
        <span className="dash__logo">b</span>
        {(['home', 'calendar', 'chart', 'users', 'settings'] as const).map((icon, i) => (
          <span key={icon} className={`dash__rail-item${i === 0 ? ' is-on' : ''}`}>
            <KazIcon name={icon} />
          </span>
        ))}
      </nav>
      <div className="dash__main">
        <div className="dash__top">
          <div>
            <span className="dash__brand">Clínica Raízes · Outubro</span>
            <p className="dash__title">Bom dia, Ana</p>
          </div>
          <span className="dash__toggle">
            <span>Semana</span>
            <span className="is-on">Mês</span>
          </span>
        </div>
        <div className="dash__kpis">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="dash__kpi">
              <span className="dash__kpi-head">
                <i>
                  <KazIcon name={kpi.icon} />
                </i>
                {kpi.label}
              </span>
              <strong>{kpi.value}</strong>
              <em>{kpi.delta}</em>
            </div>
          ))}
        </div>
        <div className="dash__row">
          <div className="dash__card dash__chart">
            <div className="dash__card-head">
              <div>
                <span className="dash__card-label">Sessões realizadas</span>
                <span className="dash__legend">
                  <i className="dot dot--solid" /> Este mês <i className="dot dot--dashed" /> Mês anterior
                </span>
              </div>
              <span className="dash__trend">+12,4%</span>
            </div>
            <AreaChart current={sessionsCurrent} previous={sessionsPrevious} xLabels={['1 out', '15 out', '30 out']} height={300} smooth marker="64 hoje" />
          </div>
          <div className="dash__card dash__agenda">
            <span className="dash__card-label">Próximas sessões</span>
            {upcoming.map((item) => (
              <div key={item.time} className="agenda-item">
                <time>{item.time}</time>
                <div>
                  <b>{item.name}</b>
                  <small>{item.area}</small>
                </div>
              </div>
            ))}
            <div className="dash__spec">
              {specialties.map((item) => (
                <span key={item.label} style={{ flexGrow: item.share }} title={item.label} />
              ))}
            </div>
            <small className="dash__spec-legend">Fono 41% · TO 33% · Psico 26%</small>
          </div>
        </div>
      </div>
      <div className="dash__toast">
        <span>
          <KazIcon name="sparkles" />
        </span>
        <div>
          <b>Insight Bloo</b>
          <small>Lembretes por WhatsApp reduziram as faltas de terça em 18%.</small>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- Serviços */

function ServiceIllustration({ art }: { art: ServiceArt }) {
  switch (art) {
    case 'chart':
      return (
        <div className="art art--chart">
          <div className="art__stat">
            <span>Adesão ao plano</span>
            <strong>
              87% <em>+6 p.p.</em>
            </strong>
          </div>
          <AreaChart current={[6, 8, 7, 11, 12, 15, 14, 19, 21, 24]} height={90} grid={false} smooth />
        </div>
      );
    case 'plan':
      return (
        <div className="art art--plan">
          <span className="art__label">Plano da semana</span>
          {[
            ['Protótipo navegável', true],
            ['Validação com terapeutas', true],
            ['Agenda integrada', false],
          ].map(([label, done]) => (
            <div key={String(label)} className={`plan-item${done ? ' is-done' : ''}`}>
              <span className="plan-item__box">{done && <KazIcon name="check" />}</span>
              {label}
            </div>
          ))}
        </div>
      );
    case 'contrast':
      return (
        <div className="art art--contrast">
          <div className="swatch swatch--dark">Aa</div>
          <div className="swatch swatch--light">Aa</div>
          <div className="contrast-meta">
            <strong>7,1 : 1</strong>
            <KazBadge tone="success" size="sm">
              AAA
            </KazBadge>
          </div>
        </div>
      );
    case 'bars':
      return (
        <div className="art art--bars">
          <span className="art__tip">+18%</span>
          <BarStrip data={momentum} height={96} />
        </div>
      );
    case 'week':
      return (
        <div className="art art--week">
          {['Seg', 'Ter', 'Qua', 'Qui', 'Sex'].map((day, i) => (
            <div key={day} className="week-col">
              <span>{day}</span>
              <i style={{ height: `${[40, 70, 55, 85, 60][i]}%` }} className={i === 3 ? 'is-on' : ''} />
            </div>
          ))}
        </div>
      );
    case 'integrations':
      return (
        <div className="art art--integrations">
          {integrations.map((item, i) => (
            <div key={item} className="integration">
              <span>{item}</span>
              {i < 3 ? (
                <KazBadge tone="success" size="sm" dot>
                  Conectado
                </KazBadge>
              ) : (
                <KazBadge tone="neutral" size="sm">
                  Em breve
                </KazBadge>
              )}
            </div>
          ))}
        </div>
      );
  }
}

/** Cards que ocupam duas colunas no desktop, para dar hierarquia ao bento. */
const wideArts: ServiceArt[] = ['chart', 'bars', 'integrations'];

function Services() {
  return (
    <section id="servicos" className="section section--band" aria-labelledby="servicos-title">
      <SectionHead
        id="servicos-title"
        eyebrow="Soluções"
        title={
          <>
            Toda a tecnologia da clínica <span className="muted">em um só parceiro.</span>
          </>
        }
        text="Do produto pronto ao sistema sob medida, com quem conhece de perto a rotina de uma clínica multidisciplinar: agenda, evolução clínica, convênios e famílias."
        split
      />
      <div className="bento">
        {services.map((service) => (
          <article key={service.title} className={`card${wideArts.includes(service.art) ? ' card--wide' : ''}`} data-reveal>
            <div className="card__art" aria-hidden="true" {...{ inert: '' }}>
              <ServiceIllustration art={service.art} />
            </div>
            <h3 className="card__title">{service.title}</h3>
            <p className="card__text">{service.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- Produtos */

function Products() {
  return (
    <section id="produtos" className="section split" aria-labelledby="produtos-title">
      <div>
        <SectionHead
          id="produtos-title"
          eyebrow="Produtos Bloo"
          title="Uma plataforma para toda a clínica."
          text="Cada produto nasce da escuta atenta de terapeutas, gestores e famílias."
        />
        <ul className="product-list">
          {products.map((product) => (
            <li key={product.id}>
              <span className="icon-chip">
                <KazIcon name={product.icon} />
              </span>
              <div>
                <h3>{product.label}</h3>
                <p>{product.text}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="actions">
          <KazBadge tone="warning" dot>
            Em desenvolvimento
          </KazBadge>
          <TextLink href="#contato">Participar da fase piloto</TextLink>
        </div>
      </div>
      <div className="patient" data-reveal aria-hidden="true" {...{ inert: '' }}>
        <div className="patient__head">
          <span className="patient__avatar">PA</span>
          <div>
            <strong>Pedro A.</strong>
            <span>6 anos · Plano terapêutico ativo</span>
          </div>
          <KazBadge tone="success" dot size="sm">
            Em evolução
          </KazBadge>
        </div>
        <ul className="patient__stats">
          {[
            ['12', 'objetivos'],
            ['94%', 'presença'],
            ['24', 'sessões'],
          ].map(([value, label]) => (
            <li key={label}>
              <b>{value}</b>
              <span>{label}</span>
            </li>
          ))}
        </ul>
        <div className="patient__block">
          <span className="art__label">Objetivos do plano</span>
          {[
            ['Comunicação', 78],
            ['Autonomia', 64],
            ['Interação social', 52],
            ['Regulação', 70],
          ].map(([label, value]) => (
            <div key={label} className="spec">
              <div className="spec__row">
                <span>{label}</span>
                <b>{value}%</b>
              </div>
              <span className="spec__bar">
                <span style={{ width: `${value}%` }} />
              </span>
            </div>
          ))}
        </div>
        <div className="patient__block patient__trend">
          <div className="spec__row">
            <span className="art__label">Evolução geral · 10 semanas</span>
            <b className="patient__delta">+38%</b>
          </div>
          <AreaChart current={[20, 24, 23, 30, 34, 33, 41, 45, 52, 58]} height={72} grid={false} smooth />
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- Processo */

function Process() {
  return (
    <section id="processo" className="section section--band" aria-labelledby="processo-title">
      <SectionHead id="processo-title" eyebrow="Como trabalhamos" title="Um processo claro, do início ao fim." text="Você acompanha o que está sendo feito, por que e quando será entregue." center />
      <ol className="timeline">
        {steps.map((step, index) => (
          <li key={step.title} className="timeline__step" data-reveal>
            <div className="timeline__head">
              <span className="timeline__node" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="timeline__phase">{step.phase}</span>
            </div>
            <h3 className="timeline__title">{step.title}</h3>
            <p className="timeline__text">{step.text}</p>
            <div className="timeline__deliver">
              <p className="timeline__label">O que você recebe</p>
              <ul>
                {step.deliverables.map((item) => (
                  <li key={item}>
                    <KazIcon name="check" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
      <p className="timeline__note" data-reveal>
        <KazIcon name="shield" />
        <span>
          <strong>Em todas as etapas:</strong> um responsável direto pelo seu projeto, prazos combinados por escrito e visibilidade completa do andamento.
        </span>
      </p>
    </section>
  );
}

/* ---------------------------------------------------------------- Papéis */

function Roles() {
  return (
    <section className="section split split--reverse" aria-labelledby="papeis-title">
      <div className="roles-visual" data-reveal>
        <Photo photo={photos.roles} />
      </div>
      <div>
        <SectionHead id="papeis-title" eyebrow="Para cada perfil" title="Perfis diferentes. O mesmo cuidado." />
        <ul className="roles">
          {roles.map((role) => (
            <li key={role.title} data-reveal>
              <span className="icon-chip">
                <KazIcon name={role.icon} />
              </span>
              <h3>{role.title}</h3>
              <p>{role.text}</p>
            </li>
          ))}
        </ul>
        <Cta href="#contato">Agendar uma conversa</Cta>
      </div>
    </section>
  );
}

/* -------------------------------------------------------- Acessibilidade */

function KazPanel() {
  return (
    <section className="section" aria-labelledby="acessibilidade-title">
      <div className="kaz-panel" data-reveal>
        <div className="kaz-panel__copy">
          <Eyebrow>Acessibilidade</Eyebrow>
          <h2 id="acessibilidade-title" className="h2">
            Acessibilidade em cada tela.
          </h2>
          <p>
            Interfaces calmas, previsíveis e de alto contraste, pensadas para pessoas neurodivergentes, para as famílias e para quem atende. Menos estímulos, linguagem clara e o mesmo padrão em todas as
            telas.
          </p>
          <ul className="kaz-panel__facts">
            <li>
              <strong>WCAG</strong> AA
            </li>
            <li>
              <strong>100%</strong> por teclado
            </li>
            <li>
              <strong>2</strong> temas
            </li>
          </ul>
        </div>
        <div className="kaz-panel__demo" aria-hidden="true" {...{ inert: '' }}>
          <div className="kaz-demo__head">
            <span className="art__label">Próxima sessão</span>
            <KazBadge tone="success" dot size="sm">
              Confirmada
            </KazBadge>
          </div>
          <div className="kaz-demo__who">
            <span className="patient__avatar">PA</span>
            <div>
              <strong>Pedro Almeida</strong>
              <span>Fonoaudiologia · Hoje, 08:00 · Sala 2</span>
            </div>
          </div>
          <div className="kaz-demo-row">
            <KazBadge tone="primary">Comunicação</KazBadge>
            <KazBadge tone="neutral">Rotina visual</KazBadge>
          </div>
          <KazInput label="Observação para a família" defaultValue="Trazer o caderno de comunicação." size="sm" />
          <div className="kaz-demo-row">
            <KazButton size="sm">Iniciar sessão</KazButton>
            <KazButton size="sm" variant="soft">
              Remarcar
            </KazButton>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Perguntas com abertura suave: a altura anima em vez de saltar, sem empurrar a página de uma vez. */
function Faq() {
  const [open, setOpen] = useState<string | null>(faq[0].id);
  return (
    <section id="faq" className="section section--band split split--faq" aria-labelledby="faq-title">
      <SectionHead id="faq-title" eyebrow="Dúvidas" title="Perguntas frequentes." text="Não encontrou o que procurava? Envie a sua pergunta pelo formulário abaixo." />
      <div className="faq">
        {faq.map((item) => {
          const isOpen = open === item.id;
          return (
            <div key={item.id} className={`faq__item${isOpen ? ' is-open' : ''}`}>
              <h3 className="faq__heading">
                <button
                  type="button"
                  id={`faq-${item.id}`}
                  className="faq__trigger"
                  aria-expanded={isOpen}
                  aria-controls={`faq-${item.id}-painel`}
                  onClick={() => setOpen(isOpen ? null : item.id)}
                >
                  {item.title}
                  <span className="faq__icon" aria-hidden="true">
                    <KazIcon name="plus" />
                  </span>
                </button>
              </h3>
              <div id={`faq-${item.id}-painel`} role="region" aria-labelledby={`faq-${item.id}`} className="faq__panel" {...(isOpen ? {} : { inert: '' })}>
                <div className="faq__content">
                  <p>{item.content}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Contato */

interface FormErrors {
  name?: string;
  email?: string;
  type?: string;
  message?: string;
  consent?: string;
}

function Contact() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error' | 'not-configured'>('idle');
  const [errors, setErrors] = useState<FormErrors>({});

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const next: FormErrors = {};
    if (!data.name?.trim()) next.name = 'Informe o seu nome.';
    if (!/^\S+@\S+\.\S+$/.test(data.email ?? '')) next.email = 'Informe um e-mail válido, como nome@clinica.com.br.';
    if (!data.type) next.type = 'Selecione o assunto.';
    if ((data.message ?? '').trim().length < 10) next.message = 'A mensagem deve ter pelo menos 10 caracteres.';
    if (!data.consent) next.consent = 'É necessário o seu consentimento para que possamos responder.';
    setErrors(next);
    if (Object.keys(next).length) {
      form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      return;
    }
    if (!CONTACT_ENDPOINT) {
      setStatus('not-configured');
      return;
    }
    setStatus('sending');
    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(String(response.status));
      setStatus('sent');
      form.reset();
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contato" className="section contact" aria-labelledby="contato-title">
      <div className="contact__copy">
        <SectionHead id="contato-title" eyebrow="Contato" title="Vamos conversar sobre a sua clínica?" text="Conte-nos um pouco sobre o seu desafio. A primeira conversa é gratuita e sem compromisso." />
        <ul className="contact__list">
          {[
            ['clock', 'Resposta ágil', 'Retorno em até um dia útil.'],
            ['users', 'Atendimento direto', 'Quem responde é quem conduz o seu projeto.'],
            ['lock', 'Dados protegidos', 'Usados apenas para responder ao seu contato.'],
          ].map(([icon, title, text]) => (
            <li key={title}>
              <span className="icon-chip">
                <KazIcon name={icon as 'clock' | 'users' | 'lock'} />
              </span>
              <div>
                <strong>{title}</strong>
                <span>{text}</span>
              </div>
            </li>
          ))}
        </ul>
        <div className="founder">
          <Photo photo={photos.founder} />
          <div>
            <strong>Victor Silvestre</strong>
            <p>Fundador da Bloo. É ele quem lê e responde cada contato.</p>
          </div>
        </div>
      </div>
      <form className="contact__form" noValidate onSubmit={onSubmit}>
        {status === 'sent' && (
          <KazAlert tone="success" title="Mensagem enviada!" onClose={() => setStatus('idle')}>
            Obrigado pelo contato. Responderemos em até um dia útil.
          </KazAlert>
        )}
        {status === 'error' && (
          <KazAlert tone="danger" title="Não foi possível enviar" onClose={() => setStatus('idle')}>
            Verifique a sua conexão e tente novamente.
          </KazAlert>
        )}
        {status === 'not-configured' && (
          <KazAlert tone="info" title="Formulário em configuração" onClose={() => setStatus('idle')}>
            O envio ainda não está ligado nesta versão do site. Seus dados não foram enviados.
          </KazAlert>
        )}
        <div className="contact__row">
          <KazInput name="name" label="Nome" required autoComplete="name" error={errors.name} />
          <KazInput name="company" label="Clínica" autoComplete="organization" />
        </div>
        <KazInput name="email" type="email" label="E-mail" required autoComplete="email" placeholder="nome@clinica.com.br" leftIcon={<KazIcon name="mail" />} error={errors.email} />
        <KazSelect name="type" label="Assunto" required placeholder="Selecione" defaultValue="" options={projectTypes} error={errors.type} />
        <KazTextarea name="message" label="Mensagem" required rows={5} placeholder="Descreva brevemente o que você precisa…" error={errors.message} />
        <div>
          <KazCheckbox name="consent" value="sim" label="Aceito que a Bloo use estes dados para responder ao meu contato." />
          {errors.consent && (
            <p className="kaz-field__msg kaz-field__msg--error contact__consent-error" role="alert">
              {errors.consent}
            </p>
          )}
        </div>
        <KazButton type="submit" size="lg" tone="neutral" className="cta" fullWidth loading={status === 'sending'} rightIcon={<KazIcon name="arrow-right" />}>
          Enviar mensagem
        </KazButton>
      </form>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__grid">
        <div className="footer__brand">
          <Logo />
          <p>HealthTech dedicada ao cuidado no autismo.</p>
        </div>
        <nav aria-label="Rodapé" className="footer__col">
          <span>Navegação</span>
          {nav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="footer__col">
          <span>Contato</span>
          <a href="#contato">Formulário de contato</a>
          <p>Brasil · Atendimento remoto</p>
        </div>
      </div>
      <div className="footer__bottom">
        <span>© {new Date().getFullYear()} Bloo. Todos os direitos reservados.</span>
        <span>Feito com Kaz</span>
      </div>
    </footer>
  );
}
