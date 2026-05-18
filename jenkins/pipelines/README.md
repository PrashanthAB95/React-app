# Jenkins Pipelines

Write your Jenkinsfiles here. Create one file per phase as you progress.

---

## 🛠 Day 1 — Jenkinsfile.phase1 (Basic Pipeline)

Create `jenkins/pipelines/Jenkinsfile.phase1`

Requirements:
- Agent: `label 'desktop-agent'`
- Environment block: define `REGISTRY`, `IMAGE_BACKEND`, `IMAGE_FRONTEND`, `BUILD_TAG`
  - `BUILD_TAG` should combine build number + short git commit hash
- Stages:
  1. **Checkout** — `checkout scm`, print last 5 git log lines
  2. **Test Backend** — `cd app/backend && npm ci && npm test`
     - Publish JUnit results with the `junit` step
  3. **Build Images** — parallel stage building backend and frontend Docker images
  4. **Push Images** — push both images with the build tag AND `:latest`
- Post block: print success/failure message

Connect it:
- In Jenkins UI → New Item → Pipeline → "Pipeline script from SCM"
- Set script path: `jenkins/pipelines/Jenkinsfile.phase1`
- Add a GitHub webhook: `http://LAPTOP_IP:8080/github-webhook/`

---

## 🛠 Day 3 — Jenkinsfile.phase2 (+ SonarQube)

Create `jenkins/pipelines/Jenkinsfile.phase2`

Add these stages after Test, before Build:
1. **SonarQube Analysis**
   - Use `withSonarQubeEnv('SonarQube')` wrapper
   - Run `sonar-scanner` with `-Dsonar.projectKey`, `-Dsonar.sources`, `-Dsonar.javascript.lcov.reportPaths`
2. **Quality Gate**
   - Use `waitForQualityGate abortPipeline: true` inside a 5-minute `timeout`

Setup checklist:
- SonarQube at `http://DESKTOP_IP:9000` (default login: admin/admin — change it)
- Create a project token in SonarQube, add to Jenkins credentials as `sonar-token`
- Install "SonarQube Scanner" plugin in Jenkins
- Configure SonarQube server in Jenkins → Manage Jenkins → System

---

## 🛠 Day 4 — Jenkinsfile.full (+ Shared Library + Notifications)

Create `jenkins/pipelines/Jenkinsfile.full`

Add at the top: `@Library('cicd-shared-lib') _`

Use these shared steps (which you will write in `jenkins/shared-library/`):
- `buildAndPush(image, context, tag)` instead of raw docker commands
- `helmDeploy(release, chart, namespace, values, set)` for deployment
- `notifySlack(color, message)` in the post block

Add pipeline parameters:
- `DEPLOY_ENV` — choice: dev / prod
- `SKIP_TESTS` — boolean

Add an approval gate before prod deploy:
```groovy
input message: "Deploy ${BUILD_TAG} to PRODUCTION?", ok: 'Deploy'
```

---

## Shared Library Setup in Jenkins

1. Jenkins → Manage Jenkins → System → Global Pipeline Libraries
2. Name: `cicd-shared-lib`
3. Source: point to your repo, `jenkins/shared-library` as library root
4. Default version: `main`
