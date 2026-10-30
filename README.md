# bloo-web

Site da Bloo, HealthTech para clínicas especializadas em autismo, construído com o **Kaz**, o design system da Bloo (`@silvestrev/kaz`).

Stack: React 18, TypeScript e Vite. O resultado do build é estático e roda em qualquer hospedagem (Vercel, Netlify, Cloudflare Pages, S3).

## Rodando localmente

O Kaz é um pacote privado no GitHub Packages, então o npm precisa de um token para baixá-lo.

1. Crie um token clássico em **GitHub → Settings → Developer settings → Personal access tokens** com o escopo `read:packages`.
2. Exporte o token no seu terminal (nunca coloque o token no repositório):

   ```bash
   export NODE_AUTH_TOKEN=ghp_seu_token
   ```

3. Instale e rode:

   ```bash
   npm install
   npm run dev       # http://localhost:5173
   npm run build     # gera dist/
   npm run preview   # serve o build
   ```

O `.npmrc` do projeto já aponta o escopo `@silvestrev` para o GitHub Packages e lê o token da variável `NODE_AUTH_TOKEN`.

### Usando o Kaz direto do código-fonte

Para testar mudanças no Kaz antes de publicar uma versão, clone os dois repositórios lado a lado e rode:

```bash
KAZ_LOCAL=../kaz-design-system npm run dev
```

## Formulário de contato

O formulário valida os campos no navegador e envia um POST JSON para `VITE_CONTACT_ENDPOINT` (Formspree, Getform ou uma API própria). Copie `.env.example` para `.env` e preencha:

```bash
VITE_CONTACT_ENDPOINT=https://formspree.io/f/SEU_ID
```

Sem essa variável, o site avisa que o envio ainda não está configurado e não envia nada.

## Onde editar

- Textos, serviços, produtos, etapas e perguntas: `src/content.tsx`
- Estrutura das seções: `src/App.tsx`
- Gráficos decorativos: `src/charts.tsx`
- Fotos reais (perfis, avatares do hero, contato e, opcionalmente, o fundo do hero): coloque os arquivos em `public/images/` e preencha `src` em `photos`, no fim de `src/content.tsx` (ex.: `'./images/sessao.jpg'`). Enquanto `src` estiver vazio, o site mostra um espaço reservado descrevendo a foto ideal.
- Layout: `src/site.css` (cores, fontes e espaçamentos vêm dos tokens do Kaz)

## Deploy

O workflow `.github/workflows/deploy.yml` publica o site no **GitHub Pages** a cada merge na `main`, e também pode ser rodado à mão em **Actions**. Para funcionar:

1. Ative **Settings → Pages → Source: GitHub Actions**. Em repositório privado, o Pages exige o plano GitHub Pro.
2. Opcional: crie a variável `VITE_CONTACT_ENDPOINT` em **Settings → Secrets and variables → Actions → Variables** para ligar o formulário.

O site fica em `https://silvestrev.github.io/bloo-web/`. Para usar um domínio próprio, configure em **Settings → Pages → Custom domain**.

## CI e segurança

- **CI** (`.github/workflows/ci.yml`): instala e builda a cada PR e push na `main`. O job se chama `check`.
- **Proteção da `main`**: as regras ficam em `.github/rulesets/proteger-main.json`. Para aplicar, vá em **Settings → Rules → Rulesets → New ruleset → Import a ruleset** e escolha esse arquivo. Elas bloqueiam push direto, force push e exclusão da `main`, e exigem PR com o `check` verde e histórico linear (squash).
- **Dependabot** (`.github/dependabot.yml`): atualizações semanais do npm e mensais das Actions. Para ele enxergar o Kaz, crie um secret do Dependabot chamado `DEPENDABOT_PACKAGES_TOKEN` com um token `read:packages`.

Para o CI baixar o Kaz, o pacote precisa dar acesso a este repositório: no GitHub, abra o pacote `kaz` → **Package settings → Manage Actions access → Add repository → bloo-web** (permissão de leitura).

## Licença

Software proprietário. © 2026 Bloo. Todos os direitos reservados.
