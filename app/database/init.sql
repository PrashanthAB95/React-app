-- Database schema for TaskManager
-- This file runs automatically when PostgreSQL container starts
-- (mount it at /docker-entrypoint-initdb.d/init.sql)

CREATE TABLE IF NOT EXISTS tasks (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    completed   BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tasks_completed ON tasks(completed);

-- Sample data so you have something to see on Day 1
INSERT INTO tasks (title, description) VALUES
  ('Write my first Jenkinsfile',    'Declarative pipeline with Checkout, Build, Test stages'),
  ('Dockerize the backend',         'Multi-stage build with test stage'),
  ('Deploy to Kubernetes',          'Deployment + Service + Ingress'),
  ('Set up Helm chart',             'Package all manifests into a reusable chart'),
  ('Install Istio service mesh',    'Enable mTLS between services');
