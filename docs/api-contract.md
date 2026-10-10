# Contrato de API — Gerenciador de Tarefas com Lembretes

## Visão geral

Esta aplicação **não possui API**. Não há back-end. Todas as operações são feitas localmente no navegador, via hooks React que leem/escrevem no `localStorage`.

## Interface interna (hooks)

O contrato entre os componentes é definido pelo hook `useTasks`, que expõe:

```typescript
interface UseTasksReturn {
  tasks: Task[];                                    // lista de tarefas, ordenada por createdAt desc
  addTask(data: CreateTaskInput): void;             // cria uma nova tarefa
  updateTask(id: string, data: UpdateTaskInput): void; // atualiza uma tarefa existente
  deleteTask(id: string): void;                     // remove uma tarefa
  toggleStatus(id: string): void;                   // alterna pending ↔ completed
}

interface CreateTaskInput {
  title: string;        // obrigatório, não vazio
  description?: string; // opcional
  reminder?: string;    // "YYYY-MM-DD" ou undefined
}

interface UpdateTaskInput {
  title?: string;
  description?: string;
  reminder?: string | null; // null para remover o lembrete
}
```

## Endpoints REST

Nenhum. A aplicação é inteiramente client-side.
