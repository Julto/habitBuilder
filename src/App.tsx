import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Button, Stack, Grid } from '@mui/material';
import TaskTable from './Components/TaskTable';
import ProgressChart from './Components/ProgressChart';
import CalendarPage from './Components/CalendarPage';
import AddTaskModal from './Components/AddTaskModal';
import EditTaskModal from './Components/EditTaskModal';
import axios from 'axios';
import { startOfWeek, endOfWeek } from 'date-fns';
import frontendConfig from '../frontendConfig.ts';

interface Task {
  id: number;
  name: string;
  category: string;
  status: number;
  created_at?: string;
}

const App: React.FC = () => {
  const [dateRange, setDateRange] = useState<{
    start: Date;
    end: Date;
  }>({
    start: startOfWeek(new Date(), { weekStartsOn: 0 }),
    end: endOfWeek(new Date(), { weekStartsOn: 0 }),
  });

  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  });
  const [taskUpdated, setTaskUpdated] = useState<boolean>(false);
  const [addTaskOpen, setAddTaskOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    setSelectedDate(new Date());
  }, []);

  const handleTaskUpdate = () => {
    setTaskUpdated((prev) => !prev);
  };

  const handleAddTaskOpen = () => setAddTaskOpen(true);
  const handleAddTaskClose = () => setAddTaskOpen(false);

  const handleAddTask = async (newTask: Omit<Task, 'id' | 'created_at'> & { created_at?: string }) => {
    try {
  
      const createdAt = newTask.created_at ? newTask.created_at : selectedDate.toISOString().split('T')[0];
  
      const response = await axios.post(`${frontendConfig.apiBaseUrl}/tasks`, {
        ...newTask,
        created_at: createdAt,
      });
  
      handleTaskUpdate(); 
      handleAddTaskClose(); 
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleEditTask = async (updatedTask: Task) => {
    try {
      await axios.put(`${frontendConfig.apiBaseUrl}/tasks/${updatedTask.id}`, updatedTask);
      handleTaskUpdate();
      setEditModalOpen(false);
      setSelectedTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async () => {
    if (!selectedTask) return;

    try {
      await axios.delete(`${frontendConfig.apiBaseUrl}/tasks/${selectedTask.id}`);
      handleTaskUpdate();
      setSelectedTask(null);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleTaskSelect = (task: Task) => {
    setSelectedTask(task); 
  };

  return (
    <Container maxWidth="lg" sx={{ marginTop: 4, overflow: 'hidden' }}>
      <Grid container spacing={4}>
        {/* Left Column: Dashboard */}
        <Grid item xs={12} md={6}>
          <Box>
            <Typography variant="h4" component="h2" align="center" gutterBottom>
              Dashboard
            </Typography>
            <TaskTable
              dateRange={dateRange}
              onTaskUpdate={handleTaskUpdate}
              onTaskSelect={handleTaskSelect}
              selectedTaskId={selectedTask ? selectedTask.id : null}
            />

            {/* Button Group */}
            <Stack
              direction="row"
              spacing={2}
              justifyContent="center"
              sx={{ marginTop: 2 }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddTaskOpen}
              >
                Add Task
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setEditModalOpen(true)}
                disabled={!selectedTask}
              >
                Edit Task
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleDeleteTask}
                disabled={!selectedTask}
              >
                Delete Task
              </Button>
            </Stack>
          </Box>
        </Grid>

        {/* Right Column: Calendar above Progress Chart */}
        <Grid item xs={12} md={6}>
          <Box sx={{ marginBottom: 2 }}>
            <CalendarPage 
              setDateRange={setDateRange} 
              setSelectedDate={setSelectedDate} 
              selectedDate={selectedDate}
            />
          </Box>

          <Box sx={{ alignItems: 'center' }}>
            <Typography variant="h4" component="h2" align="center" gutterBottom>
              Progress
            </Typography>
            <ProgressChart dateRange={dateRange} taskUpdated={taskUpdated} />
          </Box>
        </Grid>
      </Grid>

      <AddTaskModal
        open={addTaskOpen}
        handleClose={handleAddTaskClose}
        addTask={handleAddTask}
        selectedDate={selectedDate} 
      />

      {editModalOpen && selectedTask && (
        <EditTaskModal
          open={editModalOpen}
          handleClose={() => setEditModalOpen(false)}
          editTask={handleEditTask}
          task={selectedTask}
        />
      )}
    </Container>
  );
};

export default App;
