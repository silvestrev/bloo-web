import type { KazIconName } from '@silvestrev/kaz';

export const nav = [
  { href: '#inicio', label: 'Início' },
  { href: '#servicos', label: 'Serviços' },
  { href: '#produtos', label: 'Produtos' },
  { href: '#processo', label: 'Processo' },
  { href: '#faq', label: 'Perguntas' },
];

export const stack = ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'React Native', 'AWS', 'Figma', 'Kaz'];

export const kpis = [
  { label: 'Sessões realizadas', value: '1.284', delta: '+12,4%' },
  { label: 'Presença', value: '94%', delta: '+3,1 p.p.' },
  { label: 'Faltas evitadas', value: '86', delta: '+18%' },
  { label: 'Tempo em relatórios', value: '6h', delta: '−41%' },
];

export const specialties = [
  { label: 'Fonoaudiologia', value: 526, share: 41 },
  { label: 'Terapia ocupacional', value: 424, share: 33 },
  { label: 'Psicologia', value: 334, share: 26 },
];

/** Séries de demonstração (atual e período anterior). */
export const sessionsCurrent = [32, 34, 31, 42, 38, 45, 44, 51, 48, 56, 53, 64];
export const sessionsPrevious = [28, 30, 29, 33, 31, 35, 34, 38, 36, 40, 37, 42];
export const momentum = [8, 10, 12, 15, 17, 18, 18, 17, 15, 13, 12, 11, 11, 12, 14, 17, 20, 22, 23, 23, 22, 20, 18, 17, 17, 18, 21, 24, 26, 27];

export type ServiceArt = 'chart' | 'plan' | 'contrast' | 'bars' | 'week' | 'integrations';

export const services: { title: string; text: string; art: ServiceArt }[] = [
  { art: 'chart', title: 'Produtos SaaS.', text: 'Criamos e operamos produtos próprios para nichos que conhecemos a fundo, começando pela saúde.' },
  { art: 'plan', title: 'Software sob medida.', text: 'Sistemas web e mobile feitos para o fluxo real do seu negócio, do protótipo à produção.' },
  { art: 'contrast', title: 'Acessibilidade digital.', text: 'Auditoria e correção de produtos para atender WCAG e incluir mais pessoas.' },
  { art: 'bars', title: 'Dados e painéis.', text: 'Indicadores claros que mostram o que mudou e onde vale agir.' },
  { art: 'week', title: 'Design de produto.', text: 'Pesquisa, UX e interfaces calmas e previsíveis, construídas sobre o Kaz.' },
  { art: 'integrations', title: 'Integrações.', text: 'Conectamos o software às ferramentas que a sua operação já usa.' },
];

export const integrations = ['WhatsApp', 'Google Agenda', 'Convênios (TISS)', 'Financeiro'];

export const products: { id: string; label: string; icon: KazIconName; text: string }[] = [
  { id: 'agenda', label: 'Agenda e sessões', icon: 'calendar', text: 'Terapeutas, salas e pacientes em um só lugar, com lembretes automáticos para as famílias.' },
  { id: 'evolucao', label: 'Evolução clínica', icon: 'chart', text: 'Registros de sessão que viram gráficos claros de progresso para cada objetivo do plano.' },
  { id: 'familia', label: 'Portal da família', icon: 'users', text: 'Agenda, combinados e evolução acessíveis para as famílias, no tempo delas.' },
];

export const steps = [
  { title: 'Entender o contexto.', text: 'Conversamos com quem usa e mapeamos o fluxo real antes de desenhar qualquer tela.', art: 'hub' as const },
  { title: 'Construir com clareza.', text: 'Definimos escopo, prazo e equipe, e entregamos em ciclos curtos e testados.', art: 'scope' as const },
  { title: 'Evoluir com evidência.', text: 'Acompanhamos o uso, medimos resultados e decidimos juntos o próximo passo.', art: 'release' as const },
];

export const roles = [
  { title: 'Para clínicas e gestores', text: 'Uma visão compartilhada da operação, da agenda ao financeiro.' },
  { title: 'Para terapeutas', text: 'Menos tempo com papelada e mais tempo com quem importa.' },
  { title: 'Para famílias', text: 'Acompanhamento claro, com o contexto certo e sem ruído.' },
  { title: 'Para empresas de outros setores', text: 'O mesmo cuidado aplicado ao software sob medida do seu negócio.' },
];

export const formats = [
  {
    tag: 'Para começar',
    name: 'Projeto sob medida',
    headline: 'Escopo fechado',
    note: 'Prazo e entregas definidos',
    text: 'Um problema claro, uma solução bem delimitada.',
    features: ['Imersão e protótipo navegável', 'Design e desenvolvimento', 'Testes e acessibilidade', 'Publicação e treinamento', '30 dias de acompanhamento'],
    recommended: false,
  },
  {
    tag: 'Recomendado para crescer',
    name: 'Squad dedicado',
    headline: 'Mensal',
    note: 'Sem fidelidade longa',
    text: 'Uma equipe da Bloo evoluindo o seu produto continuamente.',
    features: ['Produto, design e desenvolvimento', 'Entregas a cada duas semanas', 'Prioridades revistas com você', 'Métricas de uso e qualidade', 'Design system Kaz incluído'],
    recommended: true,
  },
  {
    tag: 'Para clínicas',
    name: 'Produtos Bloo',
    headline: 'Por clínica',
    note: 'Assinatura mensal',
    text: 'Software pronto para clínicas de TEA, em fase piloto.',
    features: ['Agenda e sessões', 'Evolução clínica', 'Portal da família', 'Implantação assistida', 'Suporte em português'],
    recommended: false,
  },
];

export const faq = [
  {
    id: 'quem',
    title: 'Para quem a Bloo trabalha?',
    content: 'Para empresas que precisam de software confiável e acessível. Nosso primeiro foco são clínicas multidisciplinares que atendem pessoas no espectro autista, mas também fazemos projetos sob medida para outros setores.',
  },
  {
    id: 'produtos',
    title: 'Os produtos para clínicas já estão disponíveis?',
    content: 'Estão em desenvolvimento junto com clínicas parceiras. Se quiser participar da fase piloto, deixe seu contato no formulário.',
  },
  {
    id: 'dados',
    title: 'Como vocês cuidam dos dados de saúde?',
    content: 'Seguimos a LGPD: criptografia, controle de acesso por perfil, registro de acessos e contratos claros sobre quem é dono dos dados (você).',
  },
  {
    id: 'valores',
    title: 'Quanto custa um projeto?',
    content: 'Depende do escopo. Depois de uma primeira conversa sem custo, enviamos uma proposta com escopo, prazos e valores, dividida em etapas.',
  },
  {
    id: 'codigo',
    title: 'De quem é o código do meu projeto sob medida?',
    content: 'Seu. Ao final do projeto você recebe o código, a documentação e os acessos.',
  },
  {
    id: 'kaz',
    title: 'O que é o Kaz?',
    content: 'É o design system próprio da Bloo: uma biblioteca de componentes acessíveis e testados que usamos em todos os projetos. Ele acelera as entregas e mantém a qualidade consistente.',
  },
];

export const projectTypes = [
  { value: 'clinica', label: 'Software para minha clínica' },
  { value: 'piloto', label: 'Participar do piloto dos produtos Bloo' },
  { value: 'sob-medida', label: 'Projeto de software sob medida' },
  { value: 'squad', label: 'Squad dedicado' },
  { value: 'acessibilidade', label: 'Auditoria de acessibilidade' },
  { value: 'outro', label: 'Outro assunto' },
];
