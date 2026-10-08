import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTasks, getTodayString } from './useTasks';

beforeEach(() => {
  localStorage.clear();
});

describe('useTasks', () => {
  // AC-1: app renders without errors — tested in App.test.tsx
  // AC-8: tasks persist in localStorage
  it('AC-8: loads tasks from localStorage on init', () => {
    const stored = [
      {
        id: '1',
        title: 'Stored task',
        status: 'pending',
        createdAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem('tasks', JSON.stringify(stored));
    const { result } = renderHook(() => useTasks());
    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].title).toBe('Stored task');
  });

  it('AC-8: persists tasks to localStorage after addTask', () => {
    const { result } = renderHook(() => useTasks());
    act(() => {
      result.current.addTask({ title: 'New task' });
    });
    const stored = JSON.parse(localStorage.getItem('tasks') ?? '[]');
    expect(stored).toHaveLength(1);
    expect(stored[0].title).toBe('New task');
  });

  // AC-2: create task with required title
  it('AC-2: addTask creates task with title and pending status', () => {
    const { result } = renderHook(() => useTasks());
    act(() => {
      result.current.addTask({ title: 'My task' });
    });
    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].title).toBe('My task');
    expect(result.current.tasks[0].status).toBe('pending');
  });

  // AC-3: create task with optional description and reminder
  it('AC-3: addTask creates task with optional description and reminder', () => {
    const { result } = renderHook(() => useTasks());
    act(() => {
      result.current.addTask({ title: 'Task', description: 'Desc', reminder: '2030-01-01' });
    });
    expect(result.current.tasks[0].description).toBe('Desc');
    expect(result.current.tasks[0].reminder).toBe('2030-01-01');
  });

  // AC-4: all created tasks appear listed
  it('AC-4: addTask adds tasks to the list, most recent first', () => {
    const { result } = renderHook(() => useTasks());
    act(() => {
      result.current.addTask({ title: 'First' });
    });
    act(() => {
      result.current.addTask({ title: 'Second' });
    });
    expect(result.current.tasks).toHaveLength(2);
    expect(result.current.tasks[0].title).toBe('Second');
  });

  // AC-5: toggle status pending <-> completed
  it('AC-5: toggleStatus marks task as completed', () => {
    const { result } = renderHook(() => useTasks());
    act(() => {
      result.current.addTask({ title: 'Toggle me' });
    });
    const id = result.current.tasks[0].id;
    act(() => {
      result.current.toggleStatus(id);
    });
    expect(result.current.tasks[0].status).toBe('completed');
    act(() => {
      result.current.toggleStatus(id);
    });
    expect(result.current.tasks[0].status).toBe('pending');
  });

  // AC-6: edit title, description, reminder
  it('AC-6: updateTask updates title, description and reminder', () => {
    const { result } = renderHook(() => useTasks());
    act(() => {
      result.current.addTask({ title: 'Old', description: 'Old desc', reminder: '2030-01-01' });
    });
    const id = result.current.tasks[0].id;
    act(() => {
      result.current.updateTask(id, { title: 'New', description: 'New desc', reminder: '2031-06-15' });
    });
    const t = result.current.tasks[0];
    expect(t.title).toBe('New');
    expect(t.description).toBe('New desc');
    expect(t.reminder).toBe('2031-06-15');
  });

  it('AC-6: updateTask removes reminder when null', () => {
    const { result } = renderHook(() => useTasks());
    act(() => {
      result.current.addTask({ title: 'Task', reminder: '2030-01-01' });
    });
    const id = result.current.tasks[0].id;
    act(() => {
      result.current.updateTask(id, { reminder: null });
    });
    expect(result.current.tasks[0].reminder).toBeUndefined();
  });

  // AC-7: delete task removes it from list
  it('AC-7: deleteTask removes the task from the list', () => {
    const { result } = renderHook(() => useTasks());
    act(() => {
      result.current.addTask({ title: 'To delete' });
    });
    const id = result.current.tasks[0].id;
    act(() => {
      result.current.deleteTask(id);
    });
    expect(result.current.tasks).toHaveLength(0);
    const stored = JSON.parse(localStorage.getItem('tasks') ?? '[]');
    expect(stored).toHaveLength(0);
  });
});

describe('getTodayString', () => {
  // AC-9: tasks with reminder today get highlighted
  it('AC-9: getTodayString returns YYYY-MM-DD format for today', () => {
    const today = getTodayString();
    expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    const d = new Date();
    const expected = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    expect(today).toBe(expected);
  });
});
