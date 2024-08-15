import React, { useState } from 'react';
import { Button } from '@mui/material';
import AddTaskModal from './AddTaskModal';

const AddTaskButton: React.FC<{ addTask: (task: any) => void }> = ({ addTask }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleAddTask = (task: any) => {
    console.log('Adding task:', task); // Debugging log
    addTask(task);
    handleClose();
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Add Task
      </Button>
      <AddTaskModal open={open} handleClose={handleClose} addTask={handleAddTask} />
    </div>
  );
};

export default AddTaskButton;
