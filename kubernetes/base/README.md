# Kubernetes Manifests — Base

Write all your Kubernetes YAML files here. Apply them with:
```bash
kubectl apply -f kubernetes/base/
# or with Kustomize (Day 8+):
kubectl apply -k kubernetes/overlays/dev/
```

---

## 🛠 Day 5 — backend.yaml (Deployment + Service)

Create `kubernetes/base/backend.yaml`

**Deployment** requirements:
- 2 replicas
- Image: `localhost:5000/taskmanager-backend:latest`
- Labels: `app: taskmanager-backend`, `tier: backend`, `version: v1`
- Environment variables from **ConfigMap** (`DB_HOST`, `DB_NAME`) and **Secret** (`db-user`, `db-password`)
- Resource requests: `100m CPU`, `128Mi memory` / limits: `500m`, `256Mi`
- **Liveness probe**: `httpGet /health :3000`, initialDelay 15s, period 10s
- **Readiness probe**: `httpGet /ready :3000`, initialDelay 5s, period 5s
- Rolling update strategy: `maxSurge: 1, maxUnavailable: 0`

**Service**: ClusterIP, port 3000

**Experiments after creating it:**
```bash
# Force a bad image to watch rollout fail then recover
kubectl set image deployment/taskmanager-backend backend=localhost:5000/taskmanager-backend:BADTAG -n taskmanager-dev
kubectl rollout status deployment/taskmanager-backend -n taskmanager-dev
kubectl rollout undo deployment/taskmanager-backend -n taskmanager-dev

# Watch probes in action
kubectl describe pod <name> -n taskmanager-dev | grep -A5 Liveness
```

---

## 🛠 Day 6 — frontend.yaml + ingress.yaml

**frontend.yaml**: Deployment (2 replicas) + ClusterIP Service for Nginx on port 80
- Liveness probe: `httpGet /nginx-health :80`

**ingress.yaml**: NGINX Ingress with:
- Host: `taskmanager.local`
- Path `/api/` → backend service port 3000
- Path `/` → frontend service port 80
- Use `nginx.ingress.kubernetes.io/rewrite-target` annotation

Add to `/etc/hosts` on your laptop:
```
DESKTOP_IP  taskmanager.local
```

---

## 🛠 Day 7 — config.yaml (ConfigMap + Secret)

Create `kubernetes/base/config.yaml` with:
- **ConfigMap** `taskmanager-config`: `DB_HOST`, `DB_NAME`, `DB_PORT`
- **Secret** `taskmanager-secrets`: `db-user`, `db-password` (base64 encoded)
  - `echo -n 'taskuser' | base64` → put the output as the value
- **ConfigMap** `db-init-sql`: paste the content of `app/database/init.sql` under a key `init.sql`

> ⚠️ Never commit real secrets to Git. In production use Sealed Secrets or Vault.

---

## 🛠 Day 7 — database.yaml (StatefulSet)

See `app/database/README.md` for full requirements.

---

## 🛠 Day 8 — hpa.yaml

Create `kubernetes/base/hpa.yaml`:
- Target: `taskmanager-backend` Deployment
- Min replicas: 2, Max: 10
- CPU target: 60% utilization
- Scale-up: max 2 pods per 60s
- Scale-down: max 1 pod per 120s, stabilization 300s

---

## 🛠 Day 8 — kustomization.yaml

Create `kubernetes/base/kustomization.yaml` listing all your resource files.
Then create overlays (see `kubernetes/overlays/`).

---

## 🛠 Day 14 — rbac.yaml

Create roles:
- `developer` (read-only: pods, services, deployments, logs)
- `deployer` (can patch deployments, read everything)
- `jenkins-deployer` ServiceAccount bound to deployer role

---

## 🛠 Day 14 — network-policy.yaml

Enforce:
1. Only `taskmanager-backend` pods can reach `taskmanager-db` on port 5432
2. `taskmanager-frontend` can only egress to `taskmanager-backend` on port 3000 (+ DNS port 53)
3. Backend can ingress from frontend and ingress-nginx namespace

Test it:
```bash
# Should succeed (backend → db):
kubectl exec -it <backend-pod> -n taskmanager-dev -- nc -zv taskmanager-db 5432

# Should fail (frontend → db):
kubectl exec -it <frontend-pod> -n taskmanager-dev -- nc -zv taskmanager-db 5432
```
