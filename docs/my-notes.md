# My Notes

Use this file to record what you build, what broke, and what you learned each day.

---

## Day 1 — Jenkins Pipeline Basics

**What I built:**


**What broke and how I fixed it:**


**Commands I want to remember:**
```bash

```

**What I learned:**


---

## Day 2 — Docker Integration

**What I built:**


**What broke and how I fixed it:**


**Commands I want to remember:**
```bash

```

**What I learned:**


---

## Day 3 — SonarQube

**What I built:**


**What broke and how I fixed it:**


**What I learned:**


---

## Day 4 — Shared Library + Multibranch

**What I built:**


**What broke and how I fixed it:**


**What I learned:**


---

## Day 5 — K8s Deployments + Probes

**What I built:**


**Break exercises I tried:**
- [ ] Set a bad image tag → watched rollout fail → rolled back
- [ ] Set readiness probe to a wrong path → watched pod stay unready
- [ ] Set memory limit very low → watched OOMKilled

**What I learned:**


---

## Day 6 — Services + Ingress

**What I built:**


**What I learned:**


---

## Day 7 — ConfigMap, Secrets, PVC

**What I built:**


**Data persistence test:** deleted pod, data survived? Y / N

**What I learned:**


---

## Day 8 — Full 3-Tier App

**Status:** All 3 tiers running? Y / N

**What I learned:**


---

## Day 9 — Helm Basics

**Commands I ran:**
```bash

```

**What I learned:**


---

## Day 10 — Helm Advanced

**What I built:**


**What I learned:**


---

## Day 11 — Jenkins + Helm Full Pipeline

**Full loop working?** git push → K8s deploy: Y / N

**What broke:**


**What I learned:**


---

## Day 12 — Istio

**Sidecar injection working?** (each pod has 2 containers): Y / N

**mTLS verified?** Y / N

**Traffic split tested?** Y / N

**What I learned:**


---

## Day 13 — Observability

**Stack installed:** Prometheus Y/N  Grafana Y/N  Loki Y/N

**Alert fired successfully?** Y / N

**What I learned:**


---

## Day 14 — HPA + RBAC + NetworkPolicy

**HPA scaled up under load?** Y / N  (scaled to ___ pods)

**NetworkPolicy blocked frontend→DB?** Y / N

**What I learned:**


---

## Day 15 — Capstone

**Everything running together?** Y / N

**Failure scenarios I tested:**
- [ ] Killed all backend pods — traffic resumed in ___ seconds
- [ ] Deployed bad image — Helm rolled back automatically
- [ ] Hit the API under load — HPA scaled from ___ to ___ pods

**What this lab taught me:**


---

## Questions for Later (cloud phase)

- 
- 
- 
