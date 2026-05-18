# Helm Chart

Build a Helm chart for the entire TaskManager application from scratch.

---

## 🛠 Day 9 — Create the chart structure

```bash
# Scaffold it (then replace with your own templates)
helm create app-chart
```

Or create manually:
```
helm/app-chart/
├── Chart.yaml
├── values.yaml
├── values-dev.yaml
├── values-prod.yaml
└── templates/
    ├── _helpers.tpl
    ├── backend-deployment.yaml
    ├── backend-service.yaml
    ├── frontend-deployment.yaml
    ├── frontend-service.yaml
    ├── configmap.yaml
    ├── secret.yaml
    └── ingress.yaml
```

### Chart.yaml

```yaml
apiVersion: v2
name: taskmanager
description: 3-tier task management app
type: application
version: 0.1.0
appVersion: "1.0.0"
```

### values.yaml

Define all configurable values:
```yaml
replicaCount:
  backend:  2
  frontend: 2

backend:
  image:
    repository: localhost:5000/taskmanager-backend
    tag: latest
  port: 3000
  resources: { ... }

frontend:
  image:
    repository: localhost:5000/taskmanager-frontend
    tag: latest
  port: 80

database:
  host: taskmanager-db
  name: taskdb

ingress:
  enabled: true
  host: taskmanager.local
```

### _helpers.tpl

Define at minimum:
- `taskmanager.name`
- `taskmanager.fullname`
- `taskmanager.labels` (standard Helm labels)

### Templates

Convert your `kubernetes/base/backend.yaml` into a template.
Replace hardcoded values with `{{ .Values.backend.image.repository }}:{{ .Values.backend.image.tag }}` etc.

---

## Day 9 Commands

```bash
helm lint ./helm/app-chart                    # validate
helm template ./helm/app-chart               # render to stdout
helm install taskapp-dev ./helm/app-chart \
  -n taskmanager-dev \
  -f helm/app-chart/values-dev.yaml          # install
helm list -n taskmanager-dev                  # verify
helm upgrade taskapp-dev ./helm/app-chart \
  --set backend.image.tag=42-abc1234 \
  -n taskmanager-dev                          # upgrade
helm rollback taskapp-dev 1 -n taskmanager-dev # rollback
helm history taskapp-dev -n taskmanager-dev   # history
```

---

## 🛠 Day 10 — Advanced: Dependencies + Hooks

### Add PostgreSQL dependency

In `Chart.yaml`:
```yaml
dependencies:
  - name: postgresql
    version: "12.x.x"
    repository: https://charts.bitnami.com/bitnami
    condition: postgresql.enabled
```

```bash
helm dependency update ./helm/app-chart
```

### Add a pre-install migration hook

Create `helm/app-chart/templates/db-migrate-hook.yaml`

It should be a Kubernetes **Job** with annotations:
```yaml
annotations:
  "helm.sh/hook": pre-install,pre-upgrade
  "helm.sh/hook-weight": "-1"
  "helm.sh/hook-delete-policy": before-hook-creation,hook-succeeded
```

The job should:
1. Wait for DB to be ready (`pg_isready` loop)
2. Run `psql` to create the tasks table if it doesn't exist

### values-dev.yaml and values-prod.yaml

- `values-dev.yaml`: replica count 1, HPA disabled, dev hostname
- `values-prod.yaml`: replica count 3+, HPA enabled, prod hostname, higher resource limits

---

## 🛠 Day 11 — Connect Jenkins to Helm

In `Jenkinsfile.full`, your Deploy stage should call the `helmDeploy` shared library step.
It should pass the Docker image tag from the Build stage using `--set backend.image.tag=${BUILD_TAG}`.

Test the full loop:
1. Push a code change to Git
2. Jenkins triggers automatically
3. Tests pass, SonarQube passes
4. Image built and pushed to local registry
5. Helm upgrades the deployment in Kubernetes
6. New pods come up with the new image tag
