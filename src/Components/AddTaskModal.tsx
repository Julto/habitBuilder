import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography, Checkbox, FormControlLabel } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, addWeeks, isBefore, isSameDay } from 'date-fns';

interface Task {
  id?: number;
  name: string;
  category: string;
  status: number;
  created_at?: string;
}

interface AddTaskModalProps {
  open: boolean;
  handleClose: () => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  selectedDate: Date;
}

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const AddTaskModal: React.FC<AddTaskModalProps> = ({ open, handleClose, addTask, selectedDate }) => {
  const [task, setTask] = useState<Omit<Task, 'id'>>({ name: '', category: '', status: 0 });
  const [errors, setErrors] = useState({ name: false, category: false, status: false, endDate: false });
  const [isRoutine, setIsRoutine] = useState<boolean>(false);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'status') {
      const statusValue = value === '' ? '' : Math.min(Number(value), 100);
      setTask({ ...task, [name]: statusValue });
    } else {
      setTask({ ...task, [name]: value });
    }
    setErrors({ ...errors, [name]: false });
  };

  const handleSubmit = async () => {
    const newErrors = {
      name: task.name === '',
      category: task.category === '',
      status: task.status === '',
      endDate: isRoutine && !endDate,
    };

    if (Object.values(newErrors).some((error) => error)) {
      setErrors(newErrors);
    } else {
      try {
        if (isRoutine && endDate) {
          const tasksToAdd = [];
          let currentDate = selectedDate; 

          while (isBefore(currentDate, endDate) || isSameDay(currentDate, endDate)) {
            const newTask = {
              ...task,
              created_at: format(currentDate, 'yyyy-MM-dd'),
              status: 0,
            };
            tasksToAdd.push(newTask);
            currentDate = addWeeks(currentDate, 1);
          }

          for (const taskToAdd of tasksToAdd) {
            addTask(taskToAdd);
          }
        } else {
          const newTask = { 
            ...task, 
            created_at: format(selectedDate, 'yyyy-MM-dd') 
          };
          addTask(newTask);
        }

        handleClose();
        setTask({ name: '', category: '', status: 0 });
        setIsRoutine(false);
        setEndDate(null);
      } catch (error) {
        console.error('Error adding task:', error);
      }
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2">
            Add New Task
          </Typography>
          <TextField
            label="Task Name"
            name="name"
            value={task.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={errors.name}
            helperText={errors.name ? "Task Name is required" : ""}
          />
          <TextField
            label="Category"
            name="category"
            value={task.category}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={errors.category}
            helperText={errors.category ? "Category is required" : ""}
          />
          <TextField
            label="Status"
            name="status"
            type="number"
            value={task.status}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={errors.status}
            helperText={errors.status ? "Status is required and must be between 0 and 100" : ""}
            inputProps={{ min: 0, max: 100 }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isRoutine}
                onChange={(e) => setIsRoutine(e.target.checked)}
                name="isRoutine"
                color="primary"
              />
            }
            label="Make this a routine task"
          />
          {isRoutine && (
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  margin: 'normal',
                  error: errors.endDate,
                  helperText: errors.endDate ? "End Date is required" : "",
                },
              }}
            />
          )}
          <Box sx={{ mt: 3 }}>
            <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>
              Add Task
            </Button>
          </Box>
        </Box>
      </Modal>
    </LocalizationProvider>
  );
};

export default AddTaskModal;
