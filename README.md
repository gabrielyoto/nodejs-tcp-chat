# primeiro-hackaton-mb

## O desafio 3 consiste em criar um app onde o usuário possa acompanhar suas metas e atividades.

Objetivo desse app é os colaboradores visualizarem de forma clara suas metas e atividades por período, podendo receber e enviar feedbacks.

### Funcionalidades sugeridas:

- Home com um resumo das metas
- Tela de listagem de metas com filtro por tempo (bimestre, trimestre, etc)
- Tela de detalhe de meta
  - Listagem das atividades da meta
  - Feedback atual da meta
  - Indicadores da meta
  - Solicitar/Receber Feedbacks
- Tela de detalhe de atividade com anexos, comentários e histórico da atividade
- Tela de resumo da completude das metas e atividades
- Notificação sobre os prazos das atividades e das metas
- Utilização de gráficos e modelos de exibição

## Configurações do workspace

- Node versão `14.16.0`
- Yarn versão `1.22.4`

## Scripts

#### Lint

- `yarn lint`

#### Backend

- `yarn server`

#### Mobile

- `yarn native:android`

## Trabalhando com monorepo

Cada workspace do nosso monorepo tem um name:

- Backend: `@hackaton/backend`
- Mobile: `@hackaton/mobile`
- Eslint config: `@hackaton/eslint-config`

Para acessar um outro pacote basta usar `import foo from {workspace}`, exemplo `import { eslintNode } from '@hackaton/eslint-config'`

Para instalar um pacote você deve digitar `yarn workspace {workspace} add {pacote}`, exemplo: `yarn workspace @hackaton/backend add cors`

## Git

- Lembrem-se de sempre rodar `git pull` antes de fazer alguma alteração
- Lembrem-se de fazer PRs para feats que realmente precisem de revisão e marcar todos como reviewers

### Padronização de commits

`{fix | feat}({backend | mobile}): {message}`, exemplo: `fix(mobile): add login screen`
