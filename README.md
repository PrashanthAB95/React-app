# cicd-k8s-practice

Your 15-day hands-on CI/CD + Kubernetes practice lab.

The application code is ready. Everything DevOps is yours to build.

## Your Lab

```
Laptop  → Jenkins (CI server, port 8080)
Desktop → Docker + Kubernetes + SonarQube + Local Registry
```

## App: TaskManager

A 3-tier task management app you will containerize, pipeline, and deploy.

- **Frontend** — React (Vite), served via Nginx
- **Backend**  — Node.js + Express REST API
- **Database** — PostgreSQL

## Repository Layout

```
cicd-k8s-practice/
├── app/
│   ├── backend/          ← Node.js API (code is ready, you Dockerize it)
│   ├── frontend/         ← React app  (code is ready, you Dockerize it)
│   └── database/         ← SQL schema (you write the K8s StatefulSet)
├── jenkins/
│   ├── pipelines/        ← YOU write Jenkinsfiles here
│   └── shared-library/   ← YOU write shared Groovy steps here
├── kubernetes/
│   ├── base/             ← YOU write all manifests here
│   └── overlays/         ← YOU write Kustomize overlays here
├── helm/
│   ├── app-chart/        ← YOU build the Helm chart here
│   └── monitoring/       ← YOU write Prometheus/Grafana values here
├── istio/                ← YOU write VirtualService, PeerAuth here
├── scripts/              ← YOU write helper shell scripts here
└── docs/                 ← YOUR notes go here
```

## 15-Day Plan

| Days  | Phase                       | What you build                                       |
|-------|-----------------------------|------------------------------------------------------|
| 1     | Jenkins basics              | Declarative pipeline, webhook, stages                |
| 2     | Docker in Jenkins           | Build + push images from pipeline                    |
| 3     | SonarQube                   | Quality gate stage, coverage reports                 |
| 4     | Shared library              | Reusable Groovy steps, multibranch pipeline          |
| 5     | K8s workloads               | Deployments, probes, rolling updates                 |
| 6     | Services + Ingress          | ClusterIP, NodePort, NGINX Ingress, TLS              |
| 7     | Config + Storage            | ConfigMap, Secrets, PVC, StatefulSet                 |
| 8     | Multi-tier app              | Full 3-tier stack on Kubernetes                      |
| 9     | Helm basics                 | Chart from scratch, values, install/upgrade/rollback |
| 10    | Helm advanced               | Dependencies, hooks, multi-env values                |
| 11    | Jenkins + Helm              | Deploy stage in pipeline, image tag passing          |
| 12    | Istio                       | Sidecar injection, mTLS, traffic splitting           |
| 13    | Observability               | Prometheus, Grafana, Loki, alert rules               |
| 14    | HPA + RBAC + NetworkPolicy  | Autoscaling, roles, network isolation                |
| 15    | Capstone                    | Everything running together, break + fix exercises   |

## How to Use This Repo

1. Read the `README.md` inside each folder — it tells you exactly what to build that day
2. Build it. Run it. Break it on purpose. Fix it.
3. Write your notes in `docs/my-notes.md`
4. Reference the hints in each README only when truly stuck

## First Commands

```bash
# Verify your desktop tools
docker version
kubectl cluster-info
helm version
sonar-scanner --version

# Start the app locally to understand what you're deploying
cd app/backend && npm install && npm start
# In another terminal:
cd app/frontend && npm install && npm run dev
```
