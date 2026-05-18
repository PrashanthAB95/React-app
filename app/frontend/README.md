# Frontend — React App

## Run Locally

```bash
npm install
npm run dev    # dev server at http://localhost:5173
npm run build  # production build → dist/
```

The app calls `/api/tasks` — Vite proxies this to `http://localhost:3000` in dev.

---

## 🛠 Day 2 Task: Write the Dockerfile + nginx.conf

### Step 1 — nginx.conf

Create `app/frontend/nginx.conf` to:
- Serve the built React app from `/usr/share/nginx/html`
- Handle SPA routing with `try_files $uri $uri/ /index.html`
- Proxy `/api/` requests to `http://taskmanager-backend:3000` (Kubernetes service name)
- Expose a `/nginx-health` endpoint returning 200

### Step 2 — Dockerfile

Create `app/frontend/Dockerfile` with:
- Stage 1 `build`: `node:20-alpine`, install deps, run `npm run build`
  - Accept a build arg `VITE_API_URL` and pass it as ENV before build
- Stage 2 `runtime`: `nginx:1.25-alpine`
  - Copy `/app/dist` from build stage to `/usr/share/nginx/html`
  - Copy your `nginx.conf` to `/etc/nginx/conf.d/default.conf`
  - Expose port 80

Test it:
```bash
docker build -t taskmanager-frontend:local .
docker run -p 8080:80 taskmanager-frontend:local
curl http://localhost:8080/nginx-health
```
