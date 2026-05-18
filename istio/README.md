# Istio — Service Mesh

---

## 🛠 Day 12 Task: Install Istio and write traffic rules

### Step 1 — Install Istio

```bash
# Download
curl -L https://istio.io/downloadIstio | ISTIO_VERSION=1.20.0 sh -
export PATH="$PWD/istio-1.20.0/bin:$PATH"

# Install with demo profile (includes all addons)
istioctl install --set profile=demo -y

# Enable sidecar injection on your namespaces
kubectl label namespace taskmanager-dev  istio-injection=enabled --overwrite
kubectl label namespace taskmanager-prod istio-injection=enabled --overwrite

# Restart pods so they get the Envoy sidecar injected
kubectl rollout restart deployment -n taskmanager-dev

# Verify: each pod should now have 2 containers (app + istio-proxy)
kubectl get pods -n taskmanager-dev
```

### Step 2 — Write virtual-service.yaml

Create `istio/virtual-service.yaml` with:

**VirtualService** for `taskmanager-backend`:
- Default route: 80% to `subset: v1`, 20% to `subset: v2`
- Header-based route: if `x-canary: "true"` → always go to `subset: v2`

**DestinationRule** for `taskmanager-backend`:
- Define subsets `v1` (label `version: v1`) and `v2` (label `version: v2`)
- Traffic policy: connection pool max 100, HTTP/2 upgrade
- Outlier detection: eject after 3 consecutive 5xx errors

```bash
kubectl apply -f istio/virtual-service.yaml
```

Test traffic splitting:
```bash
# Send 10 requests and observe which version responds
for i in $(seq 1 10); do
  curl -s http://taskmanager.local/api/tasks | grep -o '"version":"[^"]*"' || echo "no version header"
done

# Force canary
curl -H "x-canary: true" http://taskmanager.local/api/tasks
```

### Step 3 — Write peer-auth.yaml

Create `istio/peer-auth.yaml` with:

**PeerAuthentication**: Enforce `STRICT` mTLS for all pods in `taskmanager-dev` namespace

**AuthorizationPolicy** for the backend:
- Only allow requests from pods with serviceaccount `taskmanager-sa`
- Only allow methods: GET, POST, PATCH, DELETE on paths `/api/*`, `/health`, `/ready`

**Gateway**: Istio Gateway resource for external traffic on port 80, host `taskmanager.local`

```bash
kubectl apply -f istio/peer-auth.yaml

# Verify mTLS is working
istioctl x authz check <backend-pod-name> -n taskmanager-dev
```

### Step 4 — Explore Kiali

```bash
# Install Kiali + addons
kubectl apply -f istio-1.20.0/samples/addons/kiali.yaml
kubectl apply -f istio-1.20.0/samples/addons/jaeger.yaml

istioctl dashboard kiali
```

In Kiali, navigate to the Graph view and watch traffic flow between your services in real time.

---

## Concepts to understand by end of Day 12

- Why does mTLS need sidecars?
- What is the difference between VirtualService and DestinationRule?
- How does Istio intercept traffic without changing application code?
- What is the Envoy proxy doing?
