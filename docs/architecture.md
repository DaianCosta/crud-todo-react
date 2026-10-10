# Arquitetura — Gerenciador de Tarefas com Lembretes

## Visão geral

Aplicação SPA (Single Page Application) em React + TypeScript + Vite + Material UI. Não há back-end: toda a persistência é feita no `localStorage` do navegador. O projeto vive inteiramente na pasta `front-end/`.

## Front-end

**Required** — todo o trabalho desta task é front-end.

## Back-end

**Nenhum.** Os requisitos excluem explicitamente back-end, API e banco de dados. A pasta `back-end/` não será criada.

---

## Componentes

### Camadas

```
src/
├── main.tsx                  # ponto de entrada (ReactDOM, ThemeProvider)
├── App.tsx                   # componente raiz, layout geral
├── theme.ts                  # tema MUI customizado (paleta, tipografia)
├── types/
│   └── task.ts               # interface Task e enums
├── hooks/
│   ├── useLocalStorage.ts    # hook genérico de leitura/escrita no localStorage
│   └── useTasks.ts           # CRUD de tarefas (create, update, delete, toggle)
├── components/
│   ├── TaskDashboard.tsx     # painel principal: lista de tarefas + destaques
│   ├── TaskFormDialog.tsx    # diálogo para criar/editar tarefa
│   ├── TaskCard.tsx          # cartão individual de tarefa
│   └── ReminderAlert.tsx     # notificação visual (snackbar) para lembretes do dia
├── utils/
│   └── date.ts               # helpers de data (isToday, formatDate)
└── __tests__/                # testes unitários (Vitest + Testing Library)
    ├── useTasks.test.ts
    ├── TaskDashboard.test.tsx
    ├── TaskFormDialog.test.tsx
    ├── TaskCard.test.tsx
    └── ReminderAlert.test.tsx
```

### Descrição dos componentes

| Componente | Responsabilidade |
|---|---|
| `App` | Layout da página (AppBar com título, container central), renderiza `TaskDashboard` |
| `TaskDashboard` | Orquestra a lista de tarefas, o botão de criar, e o `ReminderAlert`. Usa `useTasks` |
| `TaskFormDialog` | Dialog MUI com formulário: título (obrigatório), descrição (opcional), lembrete/data (opcional). Usado para criação e edição |
| `TaskCard` | Card MUI que exibe uma tarefa. Checkbox para marcar concluída, botões editar/excluir. Destaque visual (borda/cor) se o lembrete é hoje |
| `ReminderAlert` | Snackbar/Alert MUI que aparece ao abrir a página quando existem tarefas com lembrete para hoje |
| `useLocalStorage` | Hook genérico: `[value, setValue] = useLocalStorage<T>(key, defaultValue)`. Serializa/deserializa JSON |
| `useTasks` | Hook que expõe: `tasks`, `addTask`, `updateTask`, `deleteTask`, `toggleStatus`. Internamente usa `useLocalStorage('tasks', [])` |

### Modelo de dados (localStorage)

Chave: `tasks`

```typescript
interface Task {
  id: string;           // crypto.randomUUID()
  title: string;        // obrigatório, não vazio
  description: string;  // pode ser ""
  status: "pending" | "completed";
  reminder: string | null; // data ISO "YYYY-MM-DD" ou null
  createdAt: string;    // ISO datetime
  updatedAt: string;    // ISO datetime
}
```

## Fluxos principais

### Criar tarefa
1. Usuário clica no FAB (+) no `TaskDashboard`.
2. `TaskFormDialog` abre em modo criação.
3. Usuário preenche título (obrigatório), descrição e lembrete (opcionais).
4. Ao confirmar, `useTasks.addTask` gera `id` com `crypto.randomUUID()`, define `status: "pending"`, timestamps e salva no localStorage.
5. A lista re-renderiza com a nova tarefa.

### Editar tarefa
1. Usuário clica no ícone de editar no `TaskCard`.
2. `TaskFormDialog` abre em modo edição, pré-preenchido.
3. Ao confirmar, `useTasks.updateTask` atualiza os campos e `updatedAt`.

### Excluir tarefa
1. Usuário clica no ícone de excluir no `TaskCard`.
2. Diálogo de confirmação (Dialog MUI).
3. `useTasks.deleteTask` remove a tarefa.

### Marcar como concluída
1. Usuário clica na checkbox do `TaskCard`.
2. `useTasks.toggleStatus` alterna entre `"pending"` e `"completed"`.

### Lembrete do dia
1. Ao montar o `TaskDashboard`, filtra tarefas com `reminder === hoje`.
2. Se houver, exibe `ReminderAlert` (Snackbar com Alert MUI, severity="warning").
3. No painel, os `TaskCard` dessas tarefas recebem destaque visual (borda colorida e/ou chip "Lembrete hoje").

---

## Plano de implementação

### Front-end (pasta `front-end/`)

Toda a implementação é front-end. Ordem sugerida:

1. **Scaffolding**: inicializar o projeto com Vite + React + TypeScript. Instalar Material UI (`@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled`). Configurar Vitest + Testing Library.
2. **Tipos e hooks**: criar `types/task.ts`, `hooks/useLocalStorage.ts`, `hooks/useTasks.ts`.
3. **Componentes base**: `App.tsx` (AppBar + layout), `theme.ts`.
4. **TaskCard**: cartão de tarefa com checkbox, botões, destaque de lembrete.
5. **TaskFormDialog**: diálogo de criação/edição com validação de título obrigatório.
6. **TaskDashboard**: painel principal integrando lista, FAB de criação, diálogo de confirmação de exclusão.
7. **ReminderAlert**: snackbar para lembretes do dia.
8. **Testes**: testes unitários para cada componente e hook, cobrindo todos os ACs.

### Back-end (pasta `back-end/`)

Nenhum trabalho de back-end. Os requisitos excluem explicitamente back-end, API e banco de dados.

---

## Mapeamento AC → Componentes

| AC | Componentes |
|---|---|
| AC-1 | `App`, `TaskDashboard` |
| AC-2 | `TaskFormDialog` (validação de título obrigatório) |
| AC-3 | `TaskFormDialog` (campos opcionais) |
| AC-4 | `TaskDashboard`, `TaskCard` |
| AC-5 | `TaskCard` (checkbox), `useTasks.toggleStatus` |
| AC-6 | `TaskFormDialog` (modo edição), `useTasks.updateTask` |
| AC-7 | `TaskDashboard` (confirmação), `useTasks.deleteTask` |
| AC-8 | `useLocalStorage`, `useTasks` |
| AC-9 | `TaskCard` (destaque visual), `utils/date.ts` |
| AC-10 | `ReminderAlert`, `TaskDashboard` |

---

## Como rodar

### Pré-requisitos
- Node.js 20+

### Variáveis de ambiente
Nenhuma variável de ambiente é necessária. A aplicação usa apenas `localStorage`.

### Comandos

```bash
# Instalar dependências
cd front-end && npm install

# Rodar em desenvolvimento
npm run dev

# Testes
npx vitest run

# Lint
npx tsc --noEmit

# Build de produção
npm run build
```

### Docker Compose

O sistema inicia com `docker compose up` na raiz do repositório. Serviços:

| Serviço | Descrição |
|---|---|
| `frontend` | Aplicação React (Vite), porta 5173 |

Não há serviços `backend` nem `postgres` — a aplicação é inteiramente client-side.

O `Dockerfile` do front-end deve ter um `HEALTHCHECK` para o gate `compose_health`.

O `docker-compose.yml` será gerado pela Squad a partir do `Dockerfile`.
