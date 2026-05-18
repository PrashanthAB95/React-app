/**
 * server.test.js
 * These tests already pass — run them with: npm test
 * SonarQube will pick up the coverage report on Day 3.
 */

const request = require('supertest');

jest.mock('pg', () => {
  const mockPool = { query: jest.fn() };
  return { Pool: jest.fn(() => mockPool) };
});

const { Pool } = require('pg');
const mockPool = new Pool();

let app;
beforeAll(() => {
  mockPool.query.mockResolvedValue({ rows: [] });
  app = require('./server');
});

afterEach(() => jest.clearAllMocks());

describe('GET /health', () => {
  it('returns 200 with status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('GET /ready', () => {
  it('returns ready when DB responds', async () => {
    mockPool.query.mockResolvedValueOnce({ rows: [{ '?column?': 1 }] });
    const res = await request(app).get('/ready');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ready');
  });

  it('returns 503 when DB is down', async () => {
    mockPool.query.mockRejectedValueOnce(new Error('connection refused'));
    const res = await request(app).get('/ready');
    expect(res.statusCode).toBe(503);
  });
});

describe('GET /api/tasks', () => {
  it('returns an array of tasks', async () => {
    mockPool.query.mockResolvedValueOnce({
      rows: [{ id: 1, title: 'Test task', completed: false }]
    });
    const res = await request(app).get('/api/tasks');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].title).toBe('Test task');
  });
});

describe('POST /api/tasks', () => {
  it('creates a task and returns 201', async () => {
    const newTask = { id: 2, title: 'New task', completed: false };
    mockPool.query.mockResolvedValueOnce({ rows: [newTask] });
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'New task', description: 'desc' });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('New task');
  });

  it('returns 400 when title is missing', async () => {
    const res = await request(app).post('/api/tasks').send({});
    expect(res.statusCode).toBe(400);
  });
});

describe('DELETE /api/tasks/:id', () => {
  it('returns 204 on success', async () => {
    mockPool.query.mockResolvedValueOnce({ rows: [] });
    const res = await request(app).delete('/api/tasks/1');
    expect(res.statusCode).toBe(204);
  });
});
