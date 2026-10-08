export type TaskStatus = 'pending' | 'completed';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  reminder?: string; // "YYYY-MM-DD"
  createdAt: string; // ISO string
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  reminder?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  reminder?: string | null; // null to remove
}
