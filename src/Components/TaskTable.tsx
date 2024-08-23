import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import frontendConfig from '../../frontendConfig.ts';

interface Task {
  id: number;
  name: string;
  category: string;
  status: number;
  created_at: string;
}

interface TaskTableProps {
  dateRange: {
    start: Date;
    end: Date;
  };
  onTaskUpdate: () => void;
  onTaskSelect: (task: Task) => void; 
  selectedTaskId: number | null;
}

const TaskTable: React.FC<TaskTableProps> = ({
  dateRange,
  onTaskUpdate,
  onTaskSelect,
  selectedTaskId,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetchTasks(dateRange);
  }, [dateRange, onTaskUpdate]);

  const fetchTasks = async (range: { start: Date; end: Date }) => {
    const start = range.start.toISOString().split('T')[0];
    const end = range.end.toISOString().split('T')[0];
    try {
      const response = await axios.get(
        `${frontendConfig.apiBaseUrl}/tasks-by-week?start=${start}&end=${end}`
      );
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleRowClick = (task: Task) => {
    onTaskSelect(task);
  };

  return (
    <TableContainer
      component={Paper}
      sx={{
        maxWidth: '90%',
        margin: 'auto',
        boxShadow: 3,
        borderRadius: 2,
        overflowX: 'auto',
      }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell align="center" sx={{ fontWeight: 'bold' }}>
              Task Name
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold' }}>
              Category
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold' }}>
              Status
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold' }}>
              Created At
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <TableRow
                key={task.id}
                onClick={() => handleRowClick(task)}
                selected={selectedTaskId === task.id}
                sx={{
                  cursor: 'pointer',
                  backgroundColor:
                    selectedTaskId === task.id ? '#e0f7fa' : 'inherit',
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                  },
                }}
              >
                <TableCell align="center" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {task.name}
                </TableCell>
                <TableCell align="center" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {task.category}
                </TableCell>
                <TableCell align="center">
                  {task.status}%
                </TableCell>
                <TableCell align="center">
                  {new Date(task.created_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} align="center">
                No tasks available for this week.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TaskTable;
