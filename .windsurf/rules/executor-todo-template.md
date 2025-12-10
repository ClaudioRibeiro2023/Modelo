---
trigger: always_on
---

# RULES – Template Platform (Monorepo React + FastAPI + pnpm)

Estas regras valem para **todas** as interações neste repositório, independentemente do prompt atual.

O repositório atual é a **Template Platform**, um **monorepo** com:

- `apps/web/` → Aplicação principal (React 18, TypeScript, Vite, TailwindCSS)
- `packages/` → Código compartilhado (ex.: `packages/shared/`, hooks, api client, auth, utils)
- `infra/` → Docker, docker-compose, Keycloak, Postgres, Redis e configs de infraestrutura
- API em **FastAPI (Python)** em pasta própria (use a pasta já existente na repo; **não invente nomes novos**)

O gerenciador de pacotes **oficial** é **pnpm 9.x com workspaces**.

---

## 1. Escopo Geral de Comportamento

- Siga o arquivo **`todo.md`** como **fonte principal de tarefas** a executar.
- Priorize tarefas marcadas como **[P0]** e **[P1]**.
- Trabalhe **fase por fase**:
  - Conclua a **Fase 0** antes de avançar para a **Fase 1**, e assim por diante, salvo se o `todo.md` ou o usuário disser o contrário.
- Sempre que possível, **execute várias tarefas relacionadas em um único ciclo de trabalho**, em vez de tratar apenas 1 item por vez.

---

## 2. Segurança e Limites

- **Nunca**:
  - Apague arquivos críticos de configuração sem motivo claro:
    - `package.json`, `pnpm-workspace.yaml`, `pnpm-lock.yaml`, configs de Vite, configs da API FastAPI, arquivos de `infra/`.
  - Remova código ou pastas inteiras sem explicar claramente o porquê.
  - Alterar ou remover configurações sensíveis de infra (Keycloak, banco, Redis, docker-compose) sem que isso esteja no `todo.md` ou explicitamente pedido.

- Ao mexer em algo sensível (autenticação, segurança, dados, infra):
  - Seja conservador.
  - Explique claramente o impacto.
  - Prefira **centralizar a lógica** em `packages/shared` (por exemplo, AuthContext, config de OIDC), em vez de duplicar em `apps/web`.

- Se encontrar `.env` versionado:
  - Trate como tarefa crítica:
    - Remover do controle de versão.
    - Garantir `.env.example`.
  - Mas **não apague** variáveis diretamente dos ambientes de execução reais (produção, staging etc.).

---

## 3. Stack Oficial e Ferramentas

- Use SEMPRE o gerenciador de pacotes **pnpm**:
  - Para instalar deps: `pnpm install`
  - Para workspaces: `pnpm -C apps/web ...`, `pnpm -C packages/shared ...`, etc.
- **Não use npm ou yarn** neste projeto, a menos que o usuário peça explicitamente.

- Respeite as ferramentas já adotadas:
  - Frontend:
    - React 18 + TypeScript + Vite + Tailwind.
    - Futuro uso de Vitest (quando configurado) para testes unitários.
    - Playwright para E2E (onde já existir).
  - Backend:
    - FastAPI em Python.
    - Tests com pytest (se/onde configurado).
  - Infra:
    - Docker / Docker Compose (PostgreSQL, Redis, Keycloak).
    - GitHub Actions (para CI/CD, quando configurado).

Quando sugerir ou configurar novas ferramentas (Vitest, logging estruturado, etc.), **sempre respeite a stack existente** e o que já está descrito em `PROPOSTA_ARQUITETURA.md` / `todo.md`.

---

## 4. Qualidade Obrigatória Antes de Marcar Tarefas como Concluídas

Para considerar uma tarefa do `todo.md` como **[x] concluída**:

1. A implementação deve:
   - Compilar / buildar **sem erros**, quando aplicável:
     - Frontend: `pnpm -C apps/web build` ou script equivalente.
     - Backend: comando de build/test configurado para a API FastAPI.
   - Manter o padrão de código existente (nome de arquivos, componentes, hooks, etc.).

2. Você deve, sempre que fizer sentido:
   - Rodar testes relevantes:
     - Unitários com Vitest (quando configurado, ex.: em `packages/shared`).
     - Testes E2E com Playwright (quando afetar fluxos de UI).
     - Testes da API com pytest ou equivalente (quando mexer na API).
   - Rodar lint/format se houver scripts:
     - Ex.: `pnpm -C apps/web lint`, `pnpm lint`, etc.

3. Se testes ou lint falharem:
   - NÃO marque a tarefa como concluída.
   - Descreva o erro e **tente corrigir** se for seguro e direto.
   - Se não conseguir resolver, explique o bloqueio e o que seria necessário.

---

## 5. Ordem de Execução das Tarefas

- Dentro de cada fase do `todo.md`:
  - Comece pela **primeira tarefa [P0]**, depois as [P1], e assim por diante.
  - Procure **agrupar tarefas relacionadas** do mesmo contexto em um único ciclo de trabalho (ex.:
    - todas as tarefas de Auth na mesma leva;
    - todas as tarefas de Vitest na mesma leva).
- Só pule uma tarefa se houver bloqueio real:
  - Dependência não resolvida.
  - Falta de informação do usuário.
  - Recurso externo indisponível.

Quando pular, registre no texto:

- Qual tarefa foi pulada.
- Por quê.
- O que é necessário para voltar nela.

---

## 6. Atualização do `todo.md`

- Ao concluir uma tarefa:
  - Atualize o `todo.md` marcando a caixa como `[x]`.
  - **Não altere o texto original** da tarefa, apenas o checkbox.
  - Se criar subtarefas adicionais, adicione-as logo abaixo, indentadas, deixando claro que são derivadas daquela tarefa.

- **Nunca marque** uma tarefa como concluída se:
  - O código não foi realmente alterado.
  - Os comandos mínimos de validação ainda não foram executados.
  - Houver falha não explicada em build/test/lint.

---

## 7. Comunicação e Transparência

Para cada bloco de trabalho (por exemplo, após concluir um grupo de tarefas da Fase 0 ou várias tarefas relacionadas):

- Traga um **mini-resumo** com:
  - Lista dos arquivos modificados (por diretório/pacote: `apps/web`, `packages/shared`, `infra`, API).
  - Comandos executados (ex.: `pnpm -C apps/web build`, `pnpm -C packages/shared test`).
  - Resultado:
    - “Todos os testes passaram.”
    - “Build ok, lint com 1 warning não crítico.”
    - “Playwright falhou no teste X.”

Para refatorações maiores (ex.: unificar AuthContext em `packages/shared`):

- Explique claramente:
  - A intenção (“centralizar AuthContext em `packages/shared/src/auth/AuthContext.tsx` e atualizar imports em `apps/web`”).
  - O efeito esperado para o time (“agora todo projeto usa um único contexto de auth compartilhado”).

---

## 8. Checkpoints e Paradas Obrigatórias

Você deve **parar para reportar explicitamente** (e aguardar nova instrução do usuário) quando:

1. Concluir **todas as tarefas de uma fase** (por exemplo, Fase 0 inteira).
2. For propor ou executar mudanças relevantes de arquitetura:
   - Reorganizar pastas de `apps/web`.
   - Alterar estrutura de `packages/shared`.
   - Introduzir novo módulo core (ex.: `core/domain`, `core/auth`).
3. Identificar que uma decisão é claramente de **negócio ou governança**:
   - Mudança de fluxos de autenticação.
   - Modificação significativa de regras de negócio.
   - Exposição de novas APIs públicas.

Nesses casos:

- Não avance sozinho para a fase seguinte.
- Apresente um resumo das mudanças da fase e aguarde instruções (a menos que o usuário já tenha autorizado explicitamente “pode seguir automático até a fase X”).

---

## 9. Ferramentas Novas & Mudanças Estruturais

- Se precisar sugerir ou implementar:
  - Novas libs (ex.: Sentry, structlog para FastAPI, novas libs de estado no React).
  - Novas estruturas de pasta (ex.: criar `packages/shared/src/domain`).

Faça SEMPRE:

- Marque essas iniciativas como **[OPCIONAL]** se não estiverem no `todo.md`.
- Justifique em 1–2 frases o benefício.
- Evite sair implementando mudanças estruturais grandes que **não estejam explicitamente previstas** no `todo.md` ou aprovadas pelo usuário.

---

## 10. Consumo de Tokens e Automação Máxima

O usuário **paga por comando enviado**, então:

1. **Use o máximo de tokens por comando**:
   - Em cada resposta, execute e descreva **o maior número de tarefas possível**, respeitando:
     - Prioridade (P0 → P1 → P2…)
     - Ordem das fases
     - Limites de contexto da ferramenta.
   - Prefira **respostas longas e abrangentes**, com:
     - Vários passos de implementação.
     - Resumo dos arquivos modificados.
     - Resultados de build/test/lint.

2. **Minimize a quantidade de prompts**:
   - Evite fazer perguntas desnecessárias.
   - Quando houver ambiguidades onde for possível tomar uma decisão “segura e razoável”, tome a decisão e explique, em vez de parar o fluxo para perguntar.
   - Agrupe operações:
     - Em vez de implementar uma tarefa e parar, implemente **todas as tarefas relacionadas** (por exemplo, toda a parte de Auth da Fase 0) antes de devolver a resposta.

3. **Execute ciclos completos por resposta**:
   - Dentro de um único comando:
     - Leia o `todo.md`.
     - Escolha a próxima tarefa P0/P1.
     - Implemente.
     - Rode testes/lint/build.
     - Atualize `todo.md`.
     - Passe para a próxima tarefa, repetindo o ciclo enquanto houver espaço de tokens e ausência de bloqueios críticos.

4. **Só pare antes do “limite de tokens” se**:
   - Encontrar um erro crítico que não consiga resolver.
   - Chegar ao final de uma fase.
   - Precisar de uma decisão que claramente foge do escopo técnico (decisão de negócio).

---

## 11. Princípio Geral

Ao longo de todo o processo, seu papel é:

- Ser um **executor cuidadoso, previsível e confiável** das tarefas definidas no `todo.md`.
- Respeitar a stack real do projeto (monorepo com `apps/web`, `packages/shared`, `infra`, API FastAPI) e as ferramentas já em uso.
- Entregar **o máximo de valor possível por comando**, reduzindo o número de interações necessárias, sem comprometer segurança ou qualidade.
