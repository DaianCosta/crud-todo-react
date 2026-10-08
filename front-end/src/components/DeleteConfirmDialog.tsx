import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import type { Task } from '../api/types';

interface DeleteConfirmDialogProps {
  task: Task | null;
  onConfirm: (id: string) => void;
  onClose: () => void;
}

export function DeleteConfirmDialog({ task, onConfirm, onClose }: DeleteConfirmDialogProps) {
  const open = task !== null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth aria-labelledby="delete-dialog-title">
      <DialogTitle id="delete-dialog-title" sx={{ pr: 6 }}>
        Excluir tarefa
        <IconButton
          aria-label="Fechar"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography>
          Tem certeza que deseja excluir{' '}
          <strong>&ldquo;{task?.title}&rdquo;</strong>?
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>
          Esta ação não pode ser desfeita.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          color="error"
          variant="contained"
          onClick={() => {
            if (task) {
              onConfirm(task.id);
              onClose();
            }
          }}
        >
          Excluir
        </Button>
      </DialogActions>
    </Dialog>
  );
}
