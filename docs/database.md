# Modelo de dados — Gerenciador de Tarefas com Lembretes

## Visão geral

Esta aplicação **não usa banco de dados**. A persistência é feita exclusivamente no `localStorage` do navegador, conforme os requisitos.

## Estrutura do localStorage

### Chave: `tasks`

Valor: array JSON de objetos `Task`.

```typescript
interface Task {
  id: string;           // UUID v4 gerado com crypto.randomUUID()
  title: string;        // obrigatório, não vazio, máximo 200 caracteres
  description: string;  // opcional (pode ser ""), máximo 1000 caracteres
  status: "pending" | "completed";
  reminder: string | null; // data no formato "YYYY-MM-DD" ou null
  createdAt: string;    // ISO 8601 datetime (ex.: "2026-10-08T14:30:00.000Z")
  updatedAt: string;    // ISO 8601 datetime
}
```

### Campos

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | `string` | sim | Identificador único (UUID v4) |
| `title` | `string` | sim | Título da tarefa, não vazio |
| `description` | `string` | sim (pode ser vazio) | Descrição da tarefa |
| `status` | `"pending" \| "completed"` | sim | Estado atual da tarefa |
| `reminder` | `string \| null` | não | Data do lembrete (YYYY-MM-DD) ou null |
| `createdAt` | `string` | sim | Data/hora de criação (ISO 8601) |
| `updatedAt` | `string` | sim | Data/hora da última atualização (ISO 8601) |

### Ordenação

As tarefas são exibidas ordenadas por `createdAt` decrescente (mais recente primeiro).

## Migrations

Não se aplicam. Não há banco de dados relacional.

## Relacionamentos

Não se aplicam. Modelo plano, sem entidades relacionadas.
