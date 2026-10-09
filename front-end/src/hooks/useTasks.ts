import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Task, TaskStatus, CreateTaskInput, UpdateTaskInput } from '../api/types';

const STORAGE_KEY = 'tasks';

function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Task[];
  } catch {
    return [];
  }
}

function saveTasks(tasks: Task[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export interface UseTasksReturn {
  tasks: Task[];
  addTask: (data: CreateTaskInput) => void;
  updateTask: (id: string, data: UpdateTaskInput) => void;
  deleteTask: (id: string) => void;
  toggleStatus: (id: string) => void;
}

export function useTasks(): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());

  const addTask = useCallback((data: CreateTaskInput) => {
    const now = new Date().toISOString();
    const newTask: Task = {
      id: uuidv4(),
      title: data.title,
      description: data.description,
      status: 'pending',
      reminder: data.reminder,
      createdAt: now,
      updatedAt: now,
    };
    setTasks((prev) => {
      const updated = [newTask, ...prev];
      saveTasks(updated);
      return updated;
    });
  }, []);

  const updateTask = useCallback((id: string, data: UpdateTaskInput) => {
    setTasks((prev) => {
      const updated = prev.map((t) => {
        if (t.id !== id) return t;
        const next = { ...t };
        if (data.title !== undefined) next.title = data.title;
        if (data.description !== undefined) {
          if (data.description === '') {
            delete next.description;
          } else {
            next.description = data.description;
          }
        }
        if (data.reminder === null) {
          delete next.reminder;
        } else if (data.reminder !== undefined) {
          next.reminder = data.reminder;
        }
        next.updatedAt = new Date().toISOString();
        return next;
      });
      saveTasks(updated);
      return updated;
    });
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      saveTasks(updated);
      return updated;
    });
  }, []);

  const toggleStatus = useCallback((id: string) => {
    setTasks((prev) => {
      const updated = prev.map((t) =>
        t.id === id
          ? { ...t, status: (t.status === 'pending' ? 'completed' : 'pending') as TaskStatus }
          : t
      );
      saveTasks(updated);
      return updated;
    });
  }, []);

  return { tasks, addTask, updateTask, deleteTask, toggleStatus };
}

export function getTodayString(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}
