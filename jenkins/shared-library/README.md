# Jenkins Shared Library

Write reusable Groovy pipeline steps here. Each file in `vars/` becomes a callable step.

---

## 🛠 Day 4 Task: Write 3 shared steps

### vars/buildAndPush.groovy

```
def call(Map config) { ... }
```

Accepts: `image`, `context`, `tag`

Should run:
1. `docker build -t IMAGE:TAG CONTEXT`
2. `docker tag IMAGE:TAG IMAGE:latest`
3. `docker push IMAGE:TAG`
4. `docker push IMAGE:latest`

---

### vars/helmDeploy.groovy

```
def call(Map config) { ... }
```

Accepts: `release`, `chart`, `namespace`, `values` (optional), `set` (optional)

Should run:
1. `kubectl get namespace ... || kubectl create namespace ...`
2. `helm upgrade --install RELEASE CHART --namespace NS -f VALUES --set KEY=VAL --wait --atomic`

---

### vars/notifySlack.groovy

```
def call(Map config) { ... }
```

Accepts: `color` (good/danger/warning), `message`

Should:
- Use `withCredentials([string(credentialsId: 'slack-webhook', variable: 'SLACK_URL')])` 
- POST a JSON payload to the Slack webhook URL using `curl`
- Include job name and build number in the footer

---

## Testing a Shared Library Step

In any Jenkinsfile where the library is loaded:
```groovy
@Library('cicd-shared-lib') _

pipeline {
    agent any
    stages {
        stage('Test Shared Step') {
            steps {
                script {
                    notifySlack(color: 'good', message: 'Library works!')
                }
            }
        }
    }
}
```
