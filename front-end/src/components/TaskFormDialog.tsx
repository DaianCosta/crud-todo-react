import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Close, Clear } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { type Dayjs } from 'dayjs';
import type { Task, CreateTaskInput, UpdateTaskInput } from '../api/types';

interface TaskFormDialogProps {
  open: boolean;
  editTask?: Task | null;
  onSave: (data: CreateTaskInput | UpdateTaskInput, id?: string) => void;
  onClose: () => void;
}

export function TaskFormDialog({ open, editTask, onSave, onClose }: TaskFormDialogProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reminder, setReminder] = useState<Dayjs | null>(null);
  const [titleError, setTitleError] = useState(false);

  useEffect(() => {
    if (open) {
      setTitle(editTask?.title ?? '');
      setDescription(editTask?.description ?? '');
      setReminder(editTask?.reminder ? dayjs(editTask.reminder) : null);
      setTitleError(false);
    }
  }, [open, editTask]);

  function handleSave() {
    if (!title.trim()) {
      setTitleError(true);
      return;
    }
    const reminderStr = reminder ? reminder.format('YYYY-MM-DD') : undefined;
    if (editTask) {
      const update: UpdateTaskInput = {
        title: title.trim(),
        description: description.trim() || undefined,
        reminder: reminder ? reminderStr : null,
      };
      onSave(update, editTask.id);
    } else {
      const create: CreateTaskInput = {
        title: title.trim(),
        description: description.trim() || undefined,
        reminder: reminderStr,
      };
      onSave(create);
    }
    onClose();
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        fullScreen={fullScreen}
        aria-labelledby="task-form-dialog-title"
      >
        <DialogTitle id="task-form-dialog-title" sx={{ pr: 6 }}>
          {editTask ? 'Editar tarefa' : 'Nova tarefa'}
          <IconButton
            aria-label="Fechar"
            onClick={onClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            label="Título"
            required
            fullWidth
            autoFocus
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (e.target.value.trim()) setTitleError(false);
            }}
            error={titleError}
            helperText={titleError ? 'O título é obrigatório.' : undefined}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            label="Descrição"
            fullWidth
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Box display="flex" alignItems="center" gap={1}>
            <DatePicker
              label="Data de lembrete"
              value={reminder}
              onChange={(val) => setReminder(val)}
              slotProps={{ textField: { fullWidth: true } }}
            />
            {reminder && (
              <IconButton
                aria-label="Remover lembrete"
                onClick={() => setReminder(null)}
                size="small"
              >
                <Clear />
              </IconButton>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!title.trim()}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}
