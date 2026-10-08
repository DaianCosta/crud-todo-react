import { useState, useMemo } from 'react';
import {
  CssBaseline,
  ThemeProvider,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Container,
  Box,
  Stack,
  Alert,
  Fab,
  useMediaQuery,
} from '@mui/material';
import { Add, LightMode, DarkMode, AssignmentOutlined, NotificationsActive } from '@mui/icons-material';
import type { PaletteMode } from '@mui/material';
import { buildTheme } from './theme';
import { useTasks, getTodayString } from './hooks/useTasks';
import { TaskCard } from './components/TaskCard';
import { TaskFormDialog } from './components/TaskFormDialog';
import { DeleteConfirmDialog } from './components/DeleteConfirmDialog';
import type { Task, CreateTaskInput, UpdateTaskInput } from './api/types';

export default function App() {
  const [mode, setMode] = useState<PaletteMode>('light');
  const theme = useMemo(() => buildTheme(mode), [mode]);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { tasks, addTask, updateTask, deleteTask, toggleStatus } = useTasks();

  const [formOpen, setFormOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [deleteTask_, setDeleteTask] = useState<Task | null>(null);

  const today = getTodayString();
  const todayReminders = tasks.filter(
    (t) => t.reminder === today && t.status === 'pending'
  );

  function handleOpenCreate() {
    setEditTask(null);
    setFormOpen(true);
  }

  function handleOpenEdit(task: Task) {
    setEditTask(task);
    setFormOpen(true);
  }

  function handleSave(data: CreateTaskInput | UpdateTaskInput, id?: string) {
    if (id) {
      updateTask(id, data as UpdateTaskInput);
    } else {
      addTask(data as CreateTaskInput);
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="fixed" elevation={2} color="default">
        <Toolbar>
          <AssignmentOutlined sx={{ mr: 1.5 }} />
          <Typography variant="h6" fontWeight={600} sx={{ flex: 1 }}>
            Gerenciador de Tarefas
          </Typography>
          <IconButton
            aria-label={mode === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
            onClick={() => setMode((m) => (m === 'light' ? 'dark' : 'light'))}
            color="inherit"
          >
            {mode === 'light' ? <DarkMode /> : <LightMode />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ pt: { xs: 8, sm: 9 }, pb: 12, minHeight: '100vh', bgcolor: 'background.default' }}>
        <Container
          maxWidth={false}
          sx={{
            maxWidth: { md: 720 },
            px: { xs: 0, sm: 2, md: 4 },
          }}
        >
          {todayReminders.length > 0 && (
            <Alert
              severity="warning"
              icon={<NotificationsActive />}
              sx={{ mb: 2, mx: { xs: 2, sm: 0 } }}
            >
              Você tem <strong>{todayReminders.length} tarefa(s)</strong> com lembrete para hoje.
            </Alert>
          )}

          {tasks.length === 0 ? (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              sx={{ mt: 8 }}
              gap={2}
            >
              <AssignmentOutlined sx={{ fontSize: 64, color: 'text.disabled' }} />
              <Typography color="text.secondary">Nenhuma tarefa ainda.</Typography>
              <Typography
                component="button"
                variant="body2"
                onClick={handleOpenCreate}
                sx={{
                  cursor: 'pointer',
                  color: 'primary.main',
                  background: 'none',
                  border: 'none',
                  fontFamily: 'inherit',
                  fontSize: 'inherit',
                  textDecoration: 'underline',
                }}
              >
                Criar primeira tarefa
              </Typography>
            </Box>
          ) : (
            <Stack spacing={1.5} sx={{ px: { xs: 0, sm: 0 } }}>
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggle={toggleStatus}
                  onEdit={handleOpenEdit}
                  onDelete={setDeleteTask}
                />
              ))}
            </Stack>
          )}
        </Container>
      </Box>

      <Fab
        variant={isMobile ? 'circular' : 'extended'}
        size={isMobile ? 'small' : 'large'}
        color="primary"
        aria-label="Adicionar tarefa"
        onClick={handleOpenCreate}
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
      >
        <Add sx={{ mr: isMobile ? 0 : 1 }} />
        {!isMobile && 'Adicionar'}
      </Fab>

      <TaskFormDialog
        open={formOpen}
        editTask={editTask}
        onSave={handleSave}
        onClose={() => setFormOpen(false)}
      />

      <DeleteConfirmDialog
        task={deleteTask_}
        onConfirm={deleteTask}
        onClose={() => setDeleteTask(null)}
      />
    </ThemeProvider>
  );
}
