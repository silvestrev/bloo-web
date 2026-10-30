import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import {
  KazAccordion,
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

/** Seção visível no momento, para marcar o item ativo do menu. */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-35% 0px -55% 0px' },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
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
                Entrar em contato
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
            Entrar em contato
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

function SectionHead({ id, eyebrow, title, text, center }: { id: string; eyebrow: string; title: ReactNode; text?: string; center?: boolean }) {
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
        <Eyebrow>HealthTech especializada em autismo</Eyebrow>
        <h1 id="hero-title" className="h1">
          Tecnologia que cuida.
          <span className="h1__accent">Feita para clínicas especializadas em autismo.</span>
        </h1>
        <p className="lead">
          A Bloo desenvolve software exclusivamente para clínicas especializadas no Transtorno do Espectro Autista: produtos prontos, sistemas sob medida, dados e integrações, com o cuidado que essa rotina exige.
        </p>
        <div className="actions">
          <Cta href="#contato" size="lg">
            Agendar uma conversa
          </Cta>
          <TextLink href="#produtos">Conheça os produtos</TextLink>
        </div>
        <div className="hero__people">
          <div className="avatars">
            {photos.partners.map((photo) => (
              <Photo key={photo.alt} photo={photo} />
            ))}
          </div>
          <span>Desenvolvido com terapeutas, gestores e famílias</span>
        </div>
        <ul className="hero__checks">
          {['Acessibilidade WCAG', 'Conformidade com a LGPD', 'Foco exclusivo em autismo'].map((item) => (
            <li key={item}>
              <KazIcon name="check" /> {item}
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
      <div className="dash__top">
        <span className="dash__brand">
          <b>bloo</b> / Clínica Raízes
        </span>
        <span className="dash__toggle">
          <span>Semana</span>
          <span className="is-on">Mês</span>
        </span>
      </div>
      <p className="dash__title">Sua clínica, em perspectiva</p>
      <div className="dash__kpis">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="dash__kpi">
            <span>{kpi.label}</span>
            <strong>{kpi.value}</strong>
            <em>{kpi.delta}</em>
          </div>
        ))}
      </div>
      <div className="dash__row">
        <div className="dash__card dash__chart">
          <div className="dash__card-head">
            <span className="dash__tabs">
              <span className="is-on">Sessões</span>
              <span>Faltas</span>
            </span>
            <span className="dash__legend">
              <i className="dot dot--solid" /> Este mês <i className="dot dot--dashed" /> Anterior
            </span>
          </div>
          <AreaChart current={sessionsCurrent} previous={sessionsPrevious} xLabels={['1 out', '15 out', '30 out']} height={150} smooth />
        </div>
        <div className="dash__card dash__spec">
          <span className="dash__card-label">Por especialidade</span>
          {specialties.map((item) => (
            <div key={item.label} className="spec">
              <div className="spec__row">
                <span>{item.label}</span>
                <b>{item.value}</b>
              </div>
              <span className="spec__bar">
                <span style={{ width: `${item.share * 2.2}%` }} />
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="dash__insight">
        <KazIcon name="sparkles" />
        <div>
          <span>Insight Bloo</span>
          <p>Lembretes por WhatsApp reduziram as faltas de terça em 18% neste mês.</p>
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
        text="Do produto pronto ao sistema sob medida, cuidamos de toda a tecnologia da sua clínica, e atendemos somente clínicas especializadas em autismo."
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
          text="Nossos produtos são desenvolvidos em parceria com terapeutas, gestores e famílias de clínicas especializadas em autismo."
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
      <div className="card card--panel" data-reveal aria-hidden="true" {...{ inert: '' }}>
        <div className="card__art unified">
          <span className="art__label">Visão unificada do paciente</span>
          <strong className="unified__value">
            12 <span>objetivos no plano</span>
          </strong>
          <div className="unified__bars">
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
          <AreaChart current={[20, 24, 23, 30, 34, 33, 41, 45, 52, 58]} height={80} grid={false} smooth />
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- Processo */

function StepArt({ art }: { art: (typeof steps)[number]['art'] }) {
  if (art === 'hub')
    return (
      <div className="art art--hub">
        {['Gestão', 'Terapeutas', 'Famílias', 'Recepção'].map((label) => (
          <span key={label} className="hub__node">
            {label}
          </span>
        ))}
        <span className="hub__center">
          <KazIcon name="compass" />
        </span>
      </div>
    );
  if (art === 'scope')
    return (
      <div className="art art--scope">
        {[
          ['Escopo', '3 módulos'],
          ['Prazo', '10 semanas'],
          ['Ciclos', 'Quinzenais'],
        ].map(([label, value]) => (
          <div key={label} className="scope-row">
            <span>{label}</span>
            <b>{value}</b>
          </div>
        ))}
      </div>
    );
  return (
    <div className="art art--release">
      <div className="release-head">
        <KazBadge tone="success" dot size="sm">
          Publicado
        </KazBadge>
        <span>v1.4</span>
      </div>
      <BarStrip data={[4, 6, 5, 8, 9, 8, 11, 12, 14, 13, 16, 18]} height={60} gap={0.35} rounded={false} />
    </div>
  );
}

function Process() {
  return (
    <section id="processo" className="section section--band" aria-labelledby="processo-title">
      <SectionHead id="processo-title" eyebrow="Como trabalhamos" title="Um processo claro, do início ao fim." text="Você acompanha o que está sendo feito, por que e quando será entregue." center />
      <ol className="steps">
        {steps.map((step, index) => (
          <li key={step.title} className="card" data-reveal>
            <div className="card__art" aria-hidden="true" {...{ inert: '' }}>
              <StepArt art={step.art} />
            </div>
            <span className="step-number">{String(index + 1).padStart(2, '0')}</span>
            <h3 className="card__title">{step.title}</h3>
            <p className="card__text">{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ---------------------------------------------------------------- Papéis */

function Roles() {
  return (
    <section className="section split split--reverse" aria-labelledby="papeis-title">
      <div className="roles-visual" data-reveal>
        <Photo photo={photos.roles} />
        <div className="phone" aria-hidden="true" {...{ inert: '' }}>
          <div className="phone__notch" />
          <p className="phone__hello">Olá, família do Pedro</p>
          <div className="phone__card">
            <span>Próxima sessão</span>
            <strong>Quinta, 08:00</strong>
            <small>Fonoaudiologia · Sala 2</small>
          </div>
          <div className="phone__card">
            <span>Evolução do mês</span>
            <AreaChart current={[30, 34, 33, 40, 44, 43, 51, 56]} height={64} grid={false} smooth />
          </div>
          <div className="phone__card phone__card--accent">
            <KazIcon name="heart" />
            <small>Novo registro da terapeuta</small>
          </div>
        </div>
      </div>
      <div>
        <SectionHead id="papeis-title" eyebrow="Para cada perfil" title="Perfis diferentes. O mesmo cuidado." />
        <ol className="roles">
          {roles.map((role, index) => (
            <li key={role.title}>
              <span className="roles__n">{index + 1}</span>
              <div>
                <h3>{role.title}</h3>
                <p>{role.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <Cta href="#contato">Conversar sobre a sua clínica</Cta>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------------- Kaz */

function KazPanel() {
  return (
    <section className="section" aria-labelledby="kaz-title">
      <div className="kaz-panel" data-reveal>
        <div className="kaz-panel__copy">
          <Eyebrow>Design system próprio</Eyebrow>
          <h2 id="kaz-title" className="h2">
            Consistência em cada tela.
          </h2>
          <p>
            O Kaz é a biblioteca de componentes da Bloo: mais de 30 peças acessíveis, com tema claro e escuro, pensadas para interfaces calmas e previsíveis, essenciais ao público neurodivergente. Este
            site foi construído com ele.
          </p>
          <ul className="kaz-panel__facts">
            <li>
              <strong>30+</strong> componentes
            </li>
            <li>
              <strong>WCAG</strong> AA
            </li>
            <li>
              <strong>2</strong> temas
            </li>
          </ul>
        </div>
        <div className="kaz-panel__demo" aria-hidden="true" {...{ inert: '' }}>
          <div className="kaz-demo-row">
            <KazButton size="sm">Agendar sessão</KazButton>
            <KazButton size="sm" variant="soft">
              Ver agenda
            </KazButton>
          </div>
          <div className="kaz-demo-row">
            <KazBadge tone="success" dot>
              Confirmada
            </KazBadge>
            <KazBadge tone="primary">Fono</KazBadge>
            <KazBadge tone="warning">Aguardando</KazBadge>
          </div>
          <KazInput label="Paciente" defaultValue="Pedro Almeida" size="sm" />
        </div>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section id="faq" className="section section--band split split--faq" aria-labelledby="faq-title">
      <SectionHead id="faq-title" eyebrow="Dúvidas" title="Perguntas frequentes." text="Não encontrou o que procurava? Envie a sua pergunta pelo formulário abaixo." />
      <KazAccordion variant="flush" items={faq} defaultValue={['quem']} headingLevel={3} className="faq" />
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
            ['users', 'Atendimento direto', 'Quem responde é quem vai desenvolver.'],
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
          <p>HealthTech que desenvolve tecnologia acessível exclusivamente para clínicas especializadas em autismo.</p>
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
