// EditTaskModal.tsx

import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

interface Task {
  id: number;
  name: string;
  category: string;
  status: number;
}

interface EditTaskModalProps {
  open: boolean;
  handleClose: () => void;
  editTask: (task: Task) => void;
  task: Task;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({
  open,
  handleClose,
  editTask,
  task,
}) => {
  const [updatedTask, setUpdatedTask] = useState<Task>(task);

  useEffect(() => {
    setUpdatedTask(task);
  }, [task]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'status') {
      // Allow the status to be empty or a number between 0 and 100
      const statusValue = value === '' ? '' : Math.min(Math.max(Number(value), 0), 100);
      setUpdatedTask({ ...updatedTask, [name]: statusValue as number });
    } else {
      setUpdatedTask({ ...updatedTask, [name]: value });
    }
  };

  const handleSubmit = () => {
    if (updatedTask.status === '') {
      setUpdatedTask({ ...updatedTask, status: 0 }); // Default to 0 if empty
    }
    editTask(updatedTask);
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" component="h2">
          Edit Task
        </Typography>
        <TextField
          label="Task Name"
          name="name"
          value={updatedTask.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Category"
          name="category"
          value={updatedTask.category}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Status"
          name="status"
          type="number"
          value={updatedTask.status}
          onChange={handleChange}
          fullWidth
          margin="normal"
          inputProps={{ min: 0, max: 100 }}
        />
        <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>
          Save Changes
        </Button>
      </Box>
    </Modal>
  );
};

export default EditTaskModal;
