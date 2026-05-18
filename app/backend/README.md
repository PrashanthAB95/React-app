# Backend — Node.js API

## The App

```
GET    /health          → liveness probe
GET    /ready           → readiness probe (checks DB)
GET    /api/tasks       → list all tasks
POST   /api/tasks       → create task  { title, description }
PATCH  /api/tasks/:id   → update task  { completed: true/false }
DELETE /api/tasks/:id   → delete task
```

## Run Locally

```bash
npm install
npm start        # needs a running PostgreSQL on localhost:5432
npm test         # runs Jest — no DB needed (mocked)
```

Environment variables the app reads:
```
DB_HOST      (default: localhost)
DB_PORT      (default: 5432)
DB_NAME      (default: taskdb)
DB_USER      (default: taskuser)
DB_PASSWORD  (default: taskpass)
PORT         (default: 3000)
```

---

## 🛠 Day 2 Task: Write the Dockerfile

Create `app/backend/Dockerfile`.

Requirements:
- Use `node:20-alpine` as base
- Use a multi-stage build (deps → test → runtime)
- Run `npm test` in a test stage so a failed test fails the Docker build
- Final image should NOT contain devDependencies or test files
- App should run as a non-root user (`USER node`)
- Expose port 3000

Hint — multi-stage structure:
```
FROM node:20-alpine AS deps      # install prod deps only
FROM node:20-alpine AS test      # install all deps, run npm test
FROM node:20-alpine AS runtime   # copy from deps, copy source, run
```

When your Dockerfile works:
```bash
docker build -t taskmanager-backend:local .
docker run -p 3000:3000 taskmanager-backend:local
curl http://localhost:3000/health
```
