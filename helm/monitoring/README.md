# Monitoring — Prometheus + Grafana

---

## 🛠 Day 13 Task: Install the observability stack

### Step 1 — Add Helm repo and install

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

helm install monitoring prometheus-community/kube-prometheus-stack \
  -n monitoring \
  -f helm/monitoring/kube-prometheus-values.yaml
```

### Step 2 — Write kube-prometheus-values.yaml

Create `helm/monitoring/kube-prometheus-values.yaml` and configure:

**Grafana:**
```yaml
grafana:
  enabled: true
  adminPassword: "changeme"
  service:
    type: NodePort
    nodePort: 32000
  dashboards:
    default:
      kubernetes-cluster:
        gnetId: 7249       # Import from grafana.com
        datasource: Prometheus
```

**Prometheus:**
```yaml
prometheus:
  service:
    type: NodePort
    nodePort: 32001
  prometheusSpec:
    retention: 7d
```

**Custom alert rules:**
```yaml
additionalPrometheusRulesMap:
  taskmanager-rules:
    groups:
      - name: taskmanager
        rules:
          - alert: PodRestartingTooMuch
            expr: rate(kube_pod_container_status_restarts_total{namespace=~"taskmanager.*"}[15m]) > 0.2
            for: 5m
            labels:
              severity: warning
            annotations:
              summary: "Pod restarting frequently"
```

Write at least 2 more alert rules of your own.

### Step 3 — Install Loki for logs

```bash
helm repo add grafana https://grafana.github.io/helm-charts
helm install loki grafana/loki-stack -n monitoring \
  --set grafana.enabled=false \
  --set prometheus.enabled=false
```

Then add Loki as a datasource in Grafana and explore pod logs.

### Step 4 — Access dashboards

```bash
# Grafana (admin / your-password)
open http://DESKTOP_IP:32000

# Prometheus
open http://DESKTOP_IP:32001

# If you installed Istio addons:
istioctl dashboard kiali
istioctl dashboard grafana
```

---

## Things to explore

- Query: `rate(http_requests_total[5m])` — request rate per service
- Query: `container_memory_usage_bytes{namespace="taskmanager-dev"}` — memory by pod
- Create a dashboard panel for pod count, CPU, memory for your app namespace
- Trigger an alert: restart a pod 5 times quickly, wait for Alertmanager to fire
