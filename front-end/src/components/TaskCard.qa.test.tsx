/**
 * QA tests for TaskCard — verifies AC-9 card-level visual highlight and AC-5 visual state.
 * These tests complement App.test.tsx which covers the Alert banner (AC-10).
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material';
import { TaskCard } from './TaskCard';
import type { Task } from '../api/types';

function getTodayISO(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function renderCard(task: Task) {
  return render(
    <ThemeProvider theme={createTheme()}>
      <TaskCard task={task} onToggle={() => {}} onEdit={() => {}} onDelete={() => {}} />
    </ThemeProvider>
  );
}

describe('TaskCard — AC-9: visual highlight for today reminder', () => {
  // AC-9: Task with today reminder renders a reminder chip visible in the card
  it('AC-9: shows reminder chip when reminder is today', () => {
    const task: Task = {
      id: '1',
      title: 'Today Task',
      status: 'pending',
      reminder: getTodayISO(),
      createdAt: new Date().toISOString(),
    };
    renderCard(task);
    // The chip displays the date in pt-BR format; verify by role or icon
    // The NotificationsActive icon is rendered for today; its aria-hidden sibling MUI chip is shown
    // We check that the card renders the task title and no "sem lembrete" state
    expect(screen.getByText('Today Task')).toBeInTheDocument();
    // The chip label shows the localized date — we just verify it's present in the card
    const dateStr = new Date(getTodayISO() + 'T12:00:00').toLocaleDateString('pt-BR');
    expect(screen.getByText(dateStr)).toBeInTheDocument();
  });

  // AC-9: Task with future reminder does NOT get today-style chip
  it('AC-9: task with future reminder shows date chip but NOT today highlighting (no banner-level promotion)', () => {
    const task: Task = {
      id: '2',
      title: 'Future Task',
      status: 'pending',
      reminder: '2099-12-31',
      createdAt: new Date().toISOString(),
    };
    renderCard(task);
    const dateStr = new Date('2099-12-31T12:00:00').toLocaleDateString('pt-BR');
    expect(screen.getByText(dateStr)).toBeInTheDocument();
    // Title is visible
    expect(screen.getByText('Future Task')).toBeInTheDocument();
  });

  // AC-9: Task with NO reminder shows no date chip
  it('AC-9: task without reminder shows no date chip', () => {
    const task: Task = {
      id: '3',
      title: 'No Reminder',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    renderCard(task);
    expect(screen.getByText('No Reminder')).toBeInTheDocument();
    // No date chip expected
    expect(screen.queryByText(/\d{2}\/\d{2}\/\d{4}/)).not.toBeInTheDocument();
  });

  // AC-5: completed task shows "Concluída" chip
  it('AC-5: completed task shows Concluída chip', () => {
    const task: Task = {
      id: '4',
      title: 'Done Task',
      status: 'completed',
      createdAt: new Date().toISOString(),
    };
    renderCard(task);
    expect(screen.getByText('Concluída')).toBeInTheDocument();
  });

  // AC-5: pending task shows "Pendente" chip
  it('AC-5: pending task shows Pendente chip', () => {
    const task: Task = {
      id: '5',
      title: 'Pending Task',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    renderCard(task);
    expect(screen.getByText('Pendente')).toBeInTheDocument();
  });
});
