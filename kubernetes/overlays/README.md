# Kubernetes Overlays (Kustomize)

Use Kustomize overlays to customize the base manifests per environment without duplicating YAML.

---

## 🛠 Day 8 Task: Write dev and prod overlays

### kubernetes/overlays/dev/kustomization.yaml

```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

namespace: taskmanager-dev

resources:
  - ../../base

patches:
  # Override replicas to 1 for dev (saves resources)
  - patch: ...
    target:
      kind: Deployment
      name: taskmanager-backend

images:
  - name: localhost:5000/taskmanager-backend
    newTag: latest
```

### kubernetes/overlays/prod/kustomization.yaml

Same structure but:
- `namespace: taskmanager-prod`
- Patch replicas to 3 for backend, 2 for frontend

---

## Apply and verify

```bash
# Preview what will be applied (dry run)
kubectl kustomize kubernetes/overlays/dev/

# Apply dev
kubectl apply -k kubernetes/overlays/dev/

# Apply prod
kubectl apply -k kubernetes/overlays/prod/

# Verify namespace is set correctly
kubectl get all -n taskmanager-dev
kubectl get all -n taskmanager-prod
```

---

## Namespace manifest

Create `kubernetes/namespaces/namespaces.yaml` with:
- `taskmanager-dev` namespace — label `istio-injection: enabled`
- `taskmanager-prod` namespace — label `istio-injection: enabled`
- `monitoring` namespace

Apply it first, before everything else:
```bash
kubectl apply -f kubernetes/namespaces/namespaces.yaml
```
