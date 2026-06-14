# Enterprise API Docs

> Open-source API reference for the Enterprise platform, built with [Scalar Docs](https://scalar.com).

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![OpenAPI 3.1](https://img.shields.io/badge/OpenAPI-3.1-green.svg)](./docs/api-reference/openapi.all-modules.json)

## Overview

This repository is the source of truth for the Enterprise API documentation. It contains:

- **1,236 API operations** across **20 modules**
- Interactive [Scalar](https://scalar.com) API reference powered by the OpenAPI 3.1 spec
- Guide pages for authentication, getting started, and each module

## Project structure

```
enterprise-api-docs/
├── docs/
│   ├── api-reference/
│   │   ├── openapi.all-modules.json   # Aggregate OpenAPI 3.1 spec
│   │   └── *.json                     # Per-module spec files
│   └── guides/
│       ├── introduction.md
│       ├── getting-started.md
│       └── authentication.md
├── scalar.config.json                 # Scalar Docs 2.0 configuration
├── LICENSE                            # MIT
└── README.md
```

## Local development

### Prerequisites

- [Node.js](https://nodejs.org) 18+

### Start the local preview server

```bash
npx @scalar/cli project preview
```

The docs will be available at **http://localhost:7970** with live reload on every file change.

### Validate your config

```bash
npx @scalar/cli project check-config
```

## Self-hosting on Kubernetes

The Scalar API Reference is a standalone HTML widget with no server-side dependencies. The recommended self-hosted setup is a static NGINX container serving a single `index.html` that loads the spec from the same origin or a CDN.

### 1. Build a Docker image

```dockerfile
# Dockerfile
FROM nginx:alpine
COPY docs/api-reference/openapi.all-modules.json /usr/share/nginx/html/openapi.json
COPY k8s/nginx.conf /etc/nginx/conf.d/default.conf
COPY k8s/index.html /usr/share/nginx/html/index.html
```

`k8s/index.html` — minimal Scalar embed:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Enterprise API</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body>
    <script
      id="api-reference"
      data-url="/openapi.json"
      src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
  </body>
</html>
```

### 2. Kubernetes manifests

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: enterprise-api-docs
  labels:
    app: enterprise-api-docs
spec:
  replicas: 2
  selector:
    matchLabels:
      app: enterprise-api-docs
  template:
    metadata:
      labels:
        app: enterprise-api-docs
    spec:
      containers:
        - name: docs
          image: ghcr.io/thefuturebegins/enterprise-api-docs:latest
          ports:
            - containerPort: 80
          resources:
            requests:
              cpu: 50m
              memory: 64Mi
            limits:
              cpu: 200m
              memory: 128Mi
---
apiVersion: v1
kind: Service
metadata:
  name: enterprise-api-docs
spec:
  selector:
    app: enterprise-api-docs
  ports:
    - port: 80
      targetPort: 80
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: enterprise-api-docs
  annotations:
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  rules:
    - host: docs.enterprise.internal
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: enterprise-api-docs
                port:
                  number: 80
```

### 3. Build and push

```bash
docker build -t ghcr.io/thefuturebegins/enterprise-api-docs:latest .
docker push ghcr.io/thefuturebegins/enterprise-api-docs:latest
kubectl apply -f k8s/
```

## Contributing

1. Fork this repository
2. Make your changes in a new branch
3. Run `npx @scalar/cli project check-config` to validate
4. Open a pull request

## License

[MIT](./LICENSE)
