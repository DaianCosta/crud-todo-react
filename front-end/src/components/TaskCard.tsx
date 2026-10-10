import { useState } from 'react';
import {
  Card,
  CardContent,
  Checkbox,
  Typography,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Box,
  useTheme,
} from '@mui/material';
import {
  MoreVert,
  CheckCircle,
  RadioButtonUnchecked,
  NotificationsActive,
  Event,
  EventBusy,
} from '@mui/icons-material';
import type { Task } from '../api/types';
import { getTodayString } from '../hooks/useTasks';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

function getReminderState(reminder?: string): 'today' | 'future' | 'past' | 'none' {
  if (!reminder) return 'none';
  const today = getTodayString();
  if (reminder === today) return 'today';
  if (reminder > today) return 'future';
  return 'past';
}

export function TaskCard({ task, onToggle, onEdit, onDelete }: TaskCardProps) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const reminderState = getReminderState(task.reminder);
  const isToday = reminderState === 'today';
  const isDone = task.status === 'completed';

  const cardSx = isToday
    ? {
        border: `1.5px solid ${theme.palette.warning.main}`,
        elevation: 2,
        opacity: isDone ? 0.75 : 1,
      }
    : { opacity: isDone ? 0.75 : 1 };

  return (
    <Card elevation={isToday ? 2 : 1} sx={cardSx}>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box display="flex" alignItems="flex-start" gap={1}>
          <Checkbox
            checked={isDone}
            onChange={() => onToggle(task.id)}
            icon={<RadioButtonUnchecked />}
            checkedIcon={<CheckCircle />}
            color="success"
            inputProps={{ 'aria-label': 'Marcar como concluída' }}
            sx={{ mt: -0.5, ml: -1 }}
          />
          <Box flex={1} minWidth={0}>
            <Typography
              variant="subtitle1"
              fontWeight={500}
              sx={{
                textDecoration: isDone ? 'line-through' : 'none',
                color: isDone ? 'text.disabled' : 'text.primary',
              }}
            >
              {task.title}
            </Typography>
            {task.description && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  mt: 0.5,
                }}
              >
                {task.description}
              </Typography>
            )}
            <Box display="flex" gap={1} mt={1} flexWrap="wrap">
              <Chip
                size="small"
                label={isDone ? 'Concluída' : 'Pendente'}
                icon={isDone ? <CheckCircle /> : <RadioButtonUnchecked />}
                sx={
                  isDone
                    ? {
                        bgcolor: 'success.light',
                        color: 'success.main',
                        '& .MuiChip-icon': { color: 'success.main' },
                      }
                    : {
                        bgcolor: 'grey.100',
                        color: 'text.secondary',
                      }
                }
              />
              {task.reminder && (
                <Chip
                  size="small"
                  label={new Date(task.reminder + 'T12:00:00').toLocaleDateString('pt-BR')}
                  icon={
                    reminderState === 'today' ? (
                      <NotificationsActive />
                    ) : reminderState === 'future' ? (
                      <Event />
                    ) : (
                      <EventBusy />
                    )
                  }
                  sx={
                    reminderState === 'today'
                      ? {
                          bgcolor: 'warning.light',
                          color: 'warning.main',
                          '& .MuiChip-icon': { color: 'warning.main' },
                        }
                      : reminderState === 'past'
                        ? { bgcolor: 'grey.100', color: 'text.disabled' }
                        : { bgcolor: 'grey.100', color: 'text.secondary' }
                  }
                />
              )}
            </Box>
          </Box>
          <IconButton
            aria-label="Mais opções"
            size="small"
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            <MoreVert fontSize="small" />
          </IconButton>
        </Box>
      </CardContent>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        MenuListProps={{ role: 'menu' }}
      >
        <MenuItem
          role="menuitem"
          onClick={() => {
            setAnchorEl(null);
            onEdit(task);
          }}
        >
          Editar
        </MenuItem>
        <MenuItem
          role="menuitem"
          onClick={() => {
            setAnchorEl(null);
            onDelete(task);
          }}
        >
          Excluir
        </MenuItem>
      </Menu>
    </Card>
  );
}
