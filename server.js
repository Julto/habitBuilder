// server.js

import express from 'express';  // Use import instead of require
import mysql from 'mysql2/promise';  // Use import instead of require
import cors from 'cors';  // Use import instead of require

const app = express();
app.use(cors());
app.use(express.json());

// MySQL database connection
const db = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'test123',
  database: 'habitbuilder',
  port: 3306,
});

// Endpoint to fetch tasks by week
app.get('/tasks-by-week', async (req, res) => {
  const { start, end } = req.query;

  try {
    const [results] = await db.query(
      `SELECT * FROM tasks WHERE created_at BETWEEN ? AND ?`,
      [start, end]
    );
    res.json(results);
  } catch (err) {
    console.error('Error fetching tasks by week:', err);
    res.status(500).send(err);
  }
});

// Endpoint to add a new task
app.post('/tasks', async (req, res) => {
  console.log('POST /tasks called');
  const { name, category, status, created_at } = req.body;
  const query = 'INSERT INTO tasks (name, category, status, created_at) VALUES (?, ?, ?, ?)';
  
  try {
    const [result] = await db.query(query, [name, category, status, created_at]);
    res.json({ id: result.insertId, name, category, status, created_at });
  } catch (err) {
    console.error('Error adding task:', err);
    res.status(500).send(err);
  }
});

// Endpoint to update a task by id
app.put('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { name, category, status } = req.body;
  const query = 'UPDATE tasks SET name = ?, category = ?, status = ? WHERE id = ?';

  try {
    const [result] = await db.query(query, [name, category, status, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task updated successfully' });
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).send(err);
  }
});

// Endpoint to delete a task by id
app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM tasks WHERE id = ?';

  try {
    const [result] = await db.query(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).send(err);
  }
});

// New endpoint to fetch average status by category for a specified date range
app.get('/average-status', async (req, res) => {
  const { start, end } = req.query;

  if (!start || !end) {
    return res.status(400).json({ error: 'Start and end dates are required' });
  }

  const query = `
    SELECT category, AVG(status) AS averageStatus
    FROM tasks
    WHERE created_at BETWEEN ? AND ?
    GROUP BY category
  `;

  try {
    const [results] = await db.query(query, [start, end]);
    res.json(results);
  } catch (err) {
    console.error('Error fetching average status:', err);
    res.status(500).json({ error: 'Server error while fetching data' });
  }
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
