# Scripts

Write your helper shell scripts here. These are tools you will need repeatedly.

---

## 🛠 Scripts to write (one per need)

### scripts/setup-registry.sh

Run on your **desktop** to start a local Docker registry.

Should:
1. Run `docker run -d --name local-registry --restart=always -p 5000:5000 -v registry-data:/var/lib/registry registry:2`
2. If the cluster uses containerd, patch `/etc/containerd/config.toml` to allow insecure registry at `localhost:5000` and restart containerd
3. Print a test command at the end

```bash
chmod +x scripts/setup-registry.sh
./scripts/setup-registry.sh
```

---

### scripts/setup-jenkins-agent.sh

Run on your **desktop** to register it as a Jenkins JNLP agent.

Should:
1. Print instructions for creating the agent node in Jenkins UI
2. Download `agent.jar` from `http://LAPTOP_IP:8080/jnlpJars/agent.jar`
3. Print the `java -jar agent.jar ...` command to run

---

### scripts/load-test.sh

Simulate traffic to trigger HPA scaling (Day 14).

Should:
- Accept `URL`, `REQUESTS`, and `CONCURRENCY` as arguments
- Use `hey`, `ab`, or fallback to a `curl` loop
- Print HPA watch command at the end

```bash
./scripts/load-test.sh http://taskmanager.local/api/tasks 500 20
```

---

### scripts/install-istio.sh

Automate the Istio installation from Day 12:
- Download Istio
- Run `istioctl install --set profile=demo -y`
- Label namespaces for sidecar injection
- Install Kiali, Jaeger addons
- Print access commands

---

## Useful Aliases

Add these to `~/.bashrc` on your desktop:

```bash
alias k=kubectl
alias kgp='kubectl get pods'
alias kgpa='kubectl get pods --all-namespaces'
alias kgpw='kubectl get pods -w'
alias kd='kubectl describe'
alias kl='kubectl logs'
alias klf='kubectl logs -f'
alias kaf='kubectl apply -f'
alias kak='kubectl apply -k'
alias kdelf='kubectl delete -f'
alias kns='kubectl config set-context --current --namespace'
```
