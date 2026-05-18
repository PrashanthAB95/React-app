import React, { useEffect, useState } from 'react';

const API = '/api/tasks';

export default function App() {
  const [tasks, setTasks]   = useState([]);
  const [title, setTitle]   = useState('');
  const [desc,  setDesc]    = useState('');
  const [error, setError]   = useState('');

  const load = async () => {
    const res = await fetch(API);
    if (res.ok) setTasks(await res.json());
  };

  useEffect(() => { load(); }, []);

  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return setError('Title is required');
    setError('');
    await fetch(API, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ title, description: desc }),
    });
    setTitle(''); setDesc('');
    load();
  };

  const toggleDone = async (task) => {
    await fetch(`${API}/${task.id}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ completed: !task.completed }),
    });
    load();
  };

  const deleteTask = async (id) => {
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', fontFamily: 'sans-serif', padding: '0 1rem' }}>
      <h1 style={{ fontSize: 24, marginBottom: 24 }}>TaskManager</h1>

      <form onSubmit={addTask} style={{ marginBottom: 32 }}>
        <input
          placeholder="Task title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{ width: '100%', padding: 8, marginBottom: 8, boxSizing: 'border-box' }}
        />
        <input
          placeholder="Description (optional)"
          value={desc}
          onChange={e => setDesc(e.target.value)}
          style={{ width: '100%', padding: 8, marginBottom: 8, boxSizing: 'border-box' }}
        />
        {error && <p style={{ color: 'red', margin: '4px 0' }}>{error}</p>}
        <button type="submit" style={{ padding: '8px 20px' }}>Add Task</button>
      </form>

      {tasks.length === 0 && <p style={{ color: '#888' }}>No tasks yet. Add one above.</p>}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.map(task => (
          <li key={task.id} style={{
            display: 'flex', alignItems: 'flex-start', gap: 12,
            padding: '12px 0', borderBottom: '1px solid #eee'
          }}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleDone(task)}
              style={{ marginTop: 3 }}
            />
            <div style={{ flex: 1, opacity: task.completed ? 0.5 : 1 }}>
              <div style={{ fontWeight: 500, textDecoration: task.completed ? 'line-through' : 'none' }}>
                {task.title}
              </div>
              {task.description && (
                <div style={{ fontSize: 13, color: '#666', marginTop: 2 }}>{task.description}</div>
              )}
            </div>
            <button onClick={() => deleteTask(task.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#999' }}>✕</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
