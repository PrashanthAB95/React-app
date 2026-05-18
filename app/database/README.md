# Database — PostgreSQL

The schema is in `init.sql`. PostgreSQL auto-runs any `.sql` file placed in `/docker-entrypoint-initdb.d/`.

---

## 🛠 Day 7 Task: StatefulSet + PVC

Write `kubernetes/base/database.yaml` containing:

### 1. StatefulSet
- Image: `postgres:15-alpine`
- 1 replica with `serviceName: taskmanager-db`
- Environment variables from **Secret** (db-user, db-password) and **ConfigMap** (DB_NAME)
- Volume mount: `postgres-data` → `/var/lib/postgresql/data`
- Volume mount: `db-init-sql` ConfigMap → `/docker-entrypoint-initdb.d`
- Liveness probe: `exec: [pg_isready, -U, taskuser]`
- Resource requests and limits

### 2. VolumeClaimTemplate
- `ReadWriteOnce`, 2Gi storage

### 3. Headless Service
- `clusterIP: None` (required for StatefulSet DNS)
- Port 5432

### 4. ConfigMap for init.sql
- Mount this `init.sql` file content into a ConfigMap named `db-init-sql`

Test it:
```bash
kubectl exec -it taskmanager-db-0 -n taskmanager-dev -- psql -U taskuser -d taskdb -c '\dt'
# Delete the pod — data should survive:
kubectl delete pod taskmanager-db-0 -n taskmanager-dev
kubectl exec -it taskmanager-db-0 -n taskmanager-dev -- psql -U taskuser -d taskdb -c 'SELECT * FROM tasks;'
```
