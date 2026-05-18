const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     process.env.DB_PORT     || 5432,
  database: process.env.DB_NAME     || 'taskdb',
  user:     process.env.DB_USER     || 'taskuser',
  password: process.env.DB_PASSWORD || 'taskpass',
});

// Health probe — used by Kubernetes liveness check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Readiness probe — checks DB connection before accepting traffic
app.get('/ready', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ready' });
  } catch (err) {
    res.status(503).json({ status: 'not ready', error: err.message });
  }
});

// List all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM tasks ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a task
app.post('/api/tasks', async (req, res) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ error: 'title is required' });
  try {
    const { rows } = await pool.query(
      'INSERT INTO tasks (title, description) VALUES ($1, $2) RETURNING *',
      [title, description]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update task (toggle complete)
app.patch('/api/tasks/:id', async (req, res) => {
  const { completed } = req.body;
  try {
    const { rows } = await pool.query(
      'UPDATE tasks SET completed=$1, updated_at=NOW() WHERE id=$2 RETURNING *',
      [completed, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM tasks WHERE id=$1', [req.params.id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`TaskManager API running on port ${PORT}`);
  console.log(`DB: ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}`);
});

module.exports = app;
