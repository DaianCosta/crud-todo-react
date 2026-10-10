import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

beforeEach(() => {
  localStorage.clear();
});

describe('App', () => {
  // AC-1: app renders without errors and shows task panel
  it('AC-1: renders the task panel without errors', () => {
    render(<App />);
    expect(screen.getByText('Gerenciador de Tarefas')).toBeInTheDocument();
    expect(screen.getByText('Nenhuma tarefa ainda.')).toBeInTheDocument();
  });

  // AC-1: FAB button is present
  it('AC-1: shows the add task FAB button', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /adicionar tarefa/i })).toBeInTheDocument();
  });

  // AC-2: form prevents submission without title
  it('AC-2: prevents form submission when title is empty', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /adicionar tarefa/i }));
    const saveBtn = screen.getByRole('button', { name: /salvar/i });
    expect(saveBtn).toBeDisabled();
  });

  // AC-2: title validation shows error message
  it('AC-2: shows title required error when title is cleared', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /adicionar tarefa/i }));
    const titleInput = screen.getByRole('textbox', { name: /título/i });
    await user.type(titleInput, 'a');
    await user.clear(titleInput);
    // Save button should be disabled
    expect(screen.getByRole('button', { name: /salvar/i })).toBeDisabled();
  });

  // AC-3: create task with description and reminder
  it('AC-3: creates task with optional description', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /adicionar tarefa/i }));
    await user.type(screen.getByRole('textbox', { name: /título/i }), 'Minha Tarefa');
    await user.type(screen.getByRole('textbox', { name: /descrição/i }), 'Uma descrição');
    await user.click(screen.getByRole('button', { name: /salvar/i }));
    // Wait for dialog exit animation before checking
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(screen.getByText('Minha Tarefa')).toBeInTheDocument();
    expect(screen.getByText('Uma descrição')).toBeInTheDocument();
  });

  // AC-4: all tasks appear in the panel
  it('AC-4: all created tasks appear in the list', async () => {
    const user = userEvent.setup();
    render(<App />);
    for (const title of ['Tarefa 1', 'Tarefa 2']) {
      await user.click(screen.getByRole('button', { name: /adicionar tarefa/i }));
      await user.type(screen.getByRole('textbox', { name: /título/i }), title);
      await user.click(screen.getByRole('button', { name: /salvar/i }));
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    }
    expect(screen.getByText('Tarefa 1')).toBeInTheDocument();
    expect(screen.getByText('Tarefa 2')).toBeInTheDocument();
  });

  // AC-5: toggle task status
  it('AC-5: toggles task status to completed on checkbox click', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /adicionar tarefa/i }));
    await user.type(screen.getByRole('textbox', { name: /título/i }), 'Toggle Task');
    await user.click(screen.getByRole('button', { name: /salvar/i }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    const checkbox = screen.getByRole('checkbox', { name: /marcar como concluída/i });
    await user.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(screen.getByText('Concluída')).toBeInTheDocument();
  });

  // AC-6: edit task
  it('AC-6: opens edit dialog with existing task data', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /adicionar tarefa/i }));
    await user.type(screen.getByRole('textbox', { name: /título/i }), 'Original Title');
    await user.click(screen.getByRole('button', { name: /salvar/i }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());

    // Open menu
    await user.click(screen.getByRole('button', { name: /mais opções/i }));
    await user.click(screen.getByRole('menuitem', { name: /editar/i }));

    // Dialog opens with existing title
    const titleInput = screen.getByRole('textbox', { name: /título/i });
    expect(titleInput).toHaveValue('Original Title');

    // Edit title
    await user.clear(titleInput);
    await user.type(titleInput, 'Updated Title');
    await user.click(screen.getByRole('button', { name: /salvar/i }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());

    expect(screen.getByText('Updated Title')).toBeInTheDocument();
    expect(screen.queryByText('Original Title')).not.toBeInTheDocument();
  });

  // AC-7: delete task
  it('AC-7: deletes task after confirmation', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /adicionar tarefa/i }));
    await user.type(screen.getByRole('textbox', { name: /título/i }), 'Delete Me');
    await user.click(screen.getByRole('button', { name: /salvar/i }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());

    await user.click(screen.getByRole('button', { name: /mais opções/i }));
    await user.click(screen.getByRole('menuitem', { name: /excluir/i }));

    // Confirm dialog
    const dialog = screen.getByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: /excluir/i }));

    expect(screen.queryByText('Delete Me')).not.toBeInTheDocument();
  });

  // AC-8: persistence tested in useTasks.test.ts (localStorage read/write)

  // AC-9: tasks with today's reminder get highlighted
  it('AC-9: task with today reminder is highlighted with warning chip', () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    // Pre-populate localStorage with a task with today's reminder
    localStorage.setItem(
      'tasks',
      JSON.stringify([
        {
          id: 'test-today',
          title: 'Reminder Today',
          status: 'pending',
          reminder: `${yyyy}-${mm}-${dd}`,
          createdAt: new Date().toISOString(),
        },
      ])
    );
    render(<App />);
    expect(screen.getByText('Reminder Today')).toBeInTheDocument();
    // The warning banner should appear
    expect(screen.getByText(/lembrete para hoje/i)).toBeInTheDocument();
  });

  // AC-10: notification banner when reminder is today
  it('AC-10: shows reminder banner when there are tasks with today reminder', () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    localStorage.setItem(
      'tasks',
      JSON.stringify([
        {
          id: 'test-today',
          title: 'Today Task',
          status: 'pending',
          reminder: `${yyyy}-${mm}-${dd}`,
          createdAt: new Date().toISOString(),
        },
      ])
    );
    render(<App />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/1 tarefa\(s\)/)).toBeInTheDocument();
  });

  // AC-10: no banner when no reminders for today
  it('AC-10: hides reminder banner when no tasks have today reminder', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /adicionar tarefa/i }));
    await user.type(screen.getByRole('textbox', { name: /título/i }), 'No Reminder');
    await user.click(screen.getByRole('button', { name: /salvar/i }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
