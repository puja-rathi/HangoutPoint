# 🚀 HangoutPoint – CI/CD Pipeline with Monitoring

This project demonstrates a complete DevOps pipeline for a Node.js application using:

- Jenkins for Continuous Integration
- Docker for containerization
- Docker Compose for multi-container orchestration
- Prometheus & Grafana for real-time application monitoring

---

## 📁 Project Structure
```
HangoutPoint/
├── nodejs_app_code/
│   ├── Dockerfile
│   ├── index.js
│   ├── package.json
│   └── test.js
│
├── monitoring/
│   ├── docker-compose.yml
│   └── prometheus/
│       └── prometheus.yml
│
├── Jenkinsfile
└── README.md
```

## ⚙️ Features
- CI/CD using Jenkins pipeline
- Build & run Docker container for Node.js app
- Unit testing using `npm test`
- Monitoring app metrics using Prometheus + Grafana
- Custom `/metrics` endpoint to expose Prometheus metrics
- Docker Compose used for running Prometheus and Grafana

## 🛠️ Prerequisites
- Docker & Docker Compose
- Jenkins installed with Docker permissions
- Node.js & npm installed (if running locally)
- Git & GitHub account
- Prometheus & Grafana Docker images (pulled automatically)

## 🧪 Node.js App with Prometheus Metrics
Install dependencies:
```
  npm install express prom-client
```
In index.js, the app exposes a /metrics endpoint:
```
const express = require('express');
const client = require('prom-client');
const app = express();
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

app.get('/metrics', async (req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
});
```
## 🧩 Jenkins Pipeline Stages
```
pipeline {
    agent any
    environment {
        IMAGE_NAME = "hangout-app"
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'dev', url: 'https://github.com/puja-rathi/HangoutPoint.git'
            }
        }
        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${IMAGE_NAME} nodejs_app_code/."
            }
        }
        stage('Run Container') {
            steps {
                sh 'docker run -d -p 3000:3000 --name test-app $IMAGE_NAME'
                sh 'sleep 5'
            }
        }
        stage('Test') {
            steps {
                sh 'docker exec test-app npm test'
            }
        }
        stage('Start Monitoring Stack') {
            steps {
                sh 'docker-compose -f monitoring/docker-compose.yml up -d'
            }
        }
    }
}
```

## 📊 Monitoring Stack

🔧 Prometheus Configuration (prometheus.yml)
```
global:
  scrape_interval: 5s

scrape_configs:
  - job_name: 'nodejs-app'
    static_configs:
      - targets: ['<ec2 public ip of nodejs app runs>:3000']
```

🧱 Docker Compose (for Prometheus & Grafana)
```
version: '3.7'
services:
  prometheus:
    image: prom/prometheus
    volumes:
      - ./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"

  grafana:
    image: grafana/grafana
    ports:
      - "3001:3000"
```

Check prometheus on <ec2 public ip>:9090

## 📈 Grafana Setup
- Login to Grafana (admin / admin)
- Add Prometheus as data source:
- URL: http://localhost:9090
- Import or create dashboard to view metrics

## 🔍 For Access
- Open security port of ec2 for node.js app: 3000 or 3001
- Open security port of ec2 for Prometheus: 9090
- Open security port of ec2 for Grafana: 3000

## 🧹 Cleanup
```
docker stop test-app
docker rm test-app
docker-compose -f monitoring/docker-compose.yml down
```
