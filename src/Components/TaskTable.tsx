// TaskTable.tsx

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
  onTaskUpdate: () => void; // Callback to notify task updates
  onTaskSelect: (task: Task) => void; // Callback for handling task selection
  selectedTaskId: number | null; // ID of the selected task
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
        `http://127.0.0.1:5000/tasks-by-week?start=${start}&end=${end}`
      );
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleRowClick = (task: Task) => {
    onTaskSelect(task); // Notify parent component of the selected task
  };

  return (
    <TableContainer
      component={Paper}
      sx={{ maxWidth: '90%', margin: 'auto', boxShadow: 3 }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center">Task Name</TableCell>
            <TableCell align="center">Category</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="center">Created At</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((task) => (
            <TableRow
              key={task.id}
              onClick={() => handleRowClick(task)}
              selected={selectedTaskId === task.id} // Highlight the selected row
              sx={{
                cursor: 'pointer',
                backgroundColor: selectedTaskId === task.id ? '#f0f8ff' : 'inherit', // Change row background on selection
              }}
            >
              <TableCell align="center">{task.name}</TableCell>
              <TableCell align="center">{task.category}</TableCell>
              <TableCell align="center">{task.status}%</TableCell>
              <TableCell align="center">
                {new Date(task.created_at).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TaskTable;
