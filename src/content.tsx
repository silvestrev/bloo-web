import type { KazIconName } from '@silvestrev/kaz';

export const nav = [
  { href: '#inicio', label: 'Início' },
  { href: '#servicos', label: 'Serviços' },
  { href: '#produtos', label: 'Produtos' },
  { href: '#processo', label: 'Processo' },
  { href: '#faq', label: 'Perguntas' },
];

export const kpis: { label: string; value: string; delta: string; icon: KazIconName }[] = [
  { label: 'Sessões', value: '1.284', delta: '+12,4%', icon: 'calendar' },
  { label: 'Presença', value: '94%', delta: '+3,1 p.p.', icon: 'check-circle' },
  { label: 'Faltas evitadas', value: '86', delta: '+18%', icon: 'bell' },
  { label: 'Relatórios', value: '6h', delta: '−41%', icon: 'clock' },
];

export const upcoming = [
  { time: '08:00', name: 'Pedro A.', area: 'Fonoaudiologia', status: 'Confirmada' },
  { time: '09:30', name: 'Lia M.', area: 'Terapia ocupacional', status: 'Em sessão' },
  { time: '11:00', name: 'Davi R.', area: 'Psicologia', status: 'Lembrete enviado' },
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
  { art: 'chart', title: 'Produtos para clínicas.', text: 'Plataformas próprias para a rotina de clínicas especializadas em autismo, da agenda à evolução terapêutica, prontas para usar.' },
  { art: 'plan', title: 'Sistemas sob medida.', text: 'Software concebido para os fluxos próprios da sua clínica, do protótipo à implantação.' },
  { art: 'contrast', title: 'Acessibilidade.', text: 'Interfaces previsíveis e de alto contraste, pensadas para pacientes e famílias, em conformidade com a WCAG.' },
  { art: 'bars', title: 'Dados e indicadores.', text: 'Painéis de adesão, frequência e evolução que apoiam decisões clínicas e de gestão baseadas em evidências.' },
  { art: 'week', title: 'Design de produto.', text: 'Pesquisa com terapeutas e famílias para criar telas calmas, claras e fáceis de usar no dia a dia.' },
  { art: 'integrations', title: 'Integrações.', text: 'Conexão com as ferramentas que a clínica já utiliza: WhatsApp, agenda, convênios e financeiro.' },
];

export const integrations = ['WhatsApp', 'Google Agenda', 'Convênios (TISS)', 'Financeiro'];

export const products: { id: string; label: string; icon: KazIconName; text: string }[] = [
  { id: 'agenda', label: 'Agenda e sessões', icon: 'calendar', text: 'Terapeutas, salas e pacientes organizados em um só lugar, com lembretes automáticos para as famílias.' },
  { id: 'evolucao', label: 'Evolução clínica', icon: 'chart', text: 'Registros de sessão convertidos em gráficos claros de progresso para cada objetivo do plano terapêutico.' },
  { id: 'familia', label: 'Portal da família', icon: 'users', text: 'Agenda, orientações e evolução acessíveis às famílias, no tempo de cada uma.' },
];

export const steps = [
  { title: 'Compreender a clínica.', text: 'Ouvimos gestores, terapeutas e famílias e mapeamos o fluxo real de atendimento antes de desenhar qualquer tela.', art: 'hub' as const },
  { title: 'Construir com clareza.', text: 'Definimos escopo, prazos e equipe e entregamos em ciclos curtos, sempre testados.', art: 'scope' as const },
  { title: 'Evoluir com evidências.', text: 'Acompanhamos o uso, medimos os resultados e definimos com você as próximas prioridades.', art: 'release' as const },
];

export const roles = [
  { title: 'Para gestores', text: 'Uma visão integrada da operação: agenda, equipe, convênios e financeiro.' },
  { title: 'Para terapeutas', text: 'Menos tempo com burocracia e mais tempo dedicado aos pacientes.' },
  { title: 'Para famílias', text: 'Acompanhamento transparente da evolução, com orientações claras.' },
  { title: 'Para a recepção', text: 'Agendamentos, confirmações e remarcações sem retrabalho.' },
];

export const faq = [
  {
    id: 'quem',
    title: 'A Bloo atende outros segmentos?',
    content: 'Não. A Bloo é uma HealthTech dedicada exclusivamente a clínicas multidisciplinares que atendem pessoas no espectro autista. Esse foco nos permite conhecer a fundo a rotina, os protocolos e as necessidades de cada perfil envolvido.',
  },
  {
    id: 'servicos',
    title: 'Que tipos de serviço a Bloo oferece?',
    content: 'Toda a tecnologia de que uma clínica especializada em autismo precisa: produtos prontos, sistemas sob medida, painéis de dados, integrações, design de produto e auditoria de acessibilidade.',
  },
  {
    id: 'produtos',
    title: 'Os produtos já estão disponíveis?',
    content: 'Estão em desenvolvimento com clínicas parceiras. Se a sua clínica tiver interesse em participar da fase piloto, entre em contato pelo formulário.',
  },
  {
    id: 'dados',
    title: 'Como os dados de saúde são protegidos?',
    content: 'Seguimos a LGPD com rigor: criptografia, controle de acesso por perfil, registro de acessos e contratos que deixam claro que os dados pertencem à clínica.',
  },
  {
    id: 'valores',
    title: 'Quanto custa um projeto?',
    content: 'Depende do escopo. Após uma primeira conversa, sem custo, enviamos uma proposta com escopo, prazos e valores, organizada em etapas.',
  },
  {
    id: 'codigo',
    title: 'A quem pertence o código de um sistema sob medida?',
    content: 'À sua clínica. Ao final do projeto, você recebe o código-fonte, a documentação e todos os acessos.',
  },
];

export const projectTypes = [
  { value: 'produtos', label: 'Conhecer os produtos Bloo' },
  { value: 'piloto', label: 'Participar da fase piloto' },
  { value: 'sob-medida', label: 'Sistema sob medida para a clínica' },
  { value: 'squad', label: 'Squad dedicado' },
  { value: 'acessibilidade', label: 'Auditoria de acessibilidade' },
  { value: 'outro', label: 'Outro assunto' },
];

export interface Photo {
  /** Caminho da imagem em public/images (ex.: './images/sessao.jpg'). Vazio mostra o espaço reservado. */
  src: string;
  alt: string;
  /** O que a foto deve mostrar. Aparece no espaço reservado enquanto não há imagem. */
  hint: string;
}

export const photos = {
  /** Opcional: com uma foto, ela ocupa o fundo do destaque do hero e o painel fica por cima. */
  hero: { src: '', alt: 'Terapeuta acompanhando uma criança em sessão', hint: 'Foto horizontal de uma sessão, com espaço livre à direita' } satisfies Photo,
  roles: { src: '', alt: 'Terapeuta e criança durante uma sessão de terapia', hint: 'Terapeuta em sessão com uma criança, em luz natural' } satisfies Photo,
  founder: { src: '', alt: 'Victor Silvestre, fundador da Bloo', hint: 'Sua foto de rosto' } satisfies Photo,
  partners: [
    { src: '', alt: 'Terapeuta de clínica parceira', hint: 'Rosto de terapeuta' },
    { src: '', alt: 'Gestora de clínica parceira', hint: 'Rosto de gestora' },
    { src: '', alt: 'Mãe de paciente', hint: 'Rosto de familiar' },
  ] satisfies Photo[],
};
