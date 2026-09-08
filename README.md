# PulseBoard

PulseBoard is a microservices-based application built to demonstrate practical backend, DevOps, cloud-native infrastructure, monitoring, autoscaling, and CI/CD skills.

## Architecture

PulseBoard consists of four Spring Boot microservices and a React dashboard.

- Auth Service — port 8080
- Location Service — port 8082
- Chat Service — port 8083
- Alert Service — port 8084
- MySQL — database
- Apache Kafka — messaging
- Prometheus — metrics
- Grafana — monitoring
- React Dashboard — frontend

## Technology Stack

### Backend

- Java 21
- Spring Boot
- Spring Security
- JWT authentication
- Spring Data JPA
- MySQL
- Apache Kafka
- Spring Boot Actuator
- Micrometer
- Prometheus

### Frontend

- React
- Axios

### DevOps

- Docker
- Docker Compose
- Kubernetes
- Kind
- Terraform
- Prometheus
- Grafana
- Kubernetes Metrics Server
- Horizontal Pod Autoscaler
- GitHub Actions
- GitHub Container Registry

## Kubernetes

PulseBoard runs on a local Kind Kubernetes cluster.

Implemented Kubernetes resources include:

- Namespace
- MySQL Deployment, Service and PVC
- Kafka Deployment and Service
- Auth Service Deployment and Service
- Location Service Deployment and Service
- Chat Service Deployment and Service
- Alert Service Deployment and Service
- Prometheus Deployment, Service and ConfigMap
- Grafana Deployment, Service and PVC
- Chat Service Horizontal Pod Autoscaler

The application services also use:

- Readiness probes
- Liveness probes
- CPU requests and limits
- Memory requests and limits

## Horizontal Pod Autoscaling

The Chat Service uses Kubernetes HPA.

Configuration:

- Minimum replicas: 1
- Maximum replicas: 3
- CPU target: 70%

The HPA was tested using CPU load.

During testing:

1. Chat Service started with 1 replica.
2. CPU load increased.
3. Kubernetes scaled the service to 2 replicas.
4. Continued load caused scaling to 3 replicas.
5. After the load stopped, CPU usage decreased.
6. Kubernetes scaled the service back to 1 replica.

## Monitoring

Prometheus collects metrics from all four Spring Boot services.

Metrics are exposed through:

    /actuator/prometheus

Prometheus monitors:

- Auth Service
- Location Service
- Chat Service
- Alert Service

Grafana is connected to Prometheus and provides dashboards for:

- Service availability
- JVM CPU usage
- JVM heap memory
- HTTP request rate
- HTTP request latency

## Infrastructure as Code

Terraform manages the Kubernetes infrastructure.

Terraform manages:

- Namespace
- MySQL
- Kafka
- Auth Service
- Location Service
- Chat Service
- Alert Service
- Chat Service HPA
- Prometheus
- Grafana

The existing Kubernetes resources were imported into Terraform.

The infrastructure was verified with:

    terraform plan

The final plan returned:

    No changes. Your infrastructure matches the configuration.

## Docker

Each Spring Boot microservice has its own multi-stage Dockerfile.

The Docker images use:

- Maven for the build stage
- Eclipse Temurin Java 21 JRE for the runtime stage

The project also includes Docker Compose for running the supporting infrastructure and microservices together.

Start the Docker environment with:

    docker compose --env-file .env.docker up -d

Check running containers with:

    docker compose ps

## CI/CD

GitHub Actions is configured to run on pushes and pull requests targeting main.

For each microservice, the workflow:

1. Checks out the repository.
2. Sets up Java 21.
3. Runs Maven build and tests.
4. Builds the Docker image.
5. Logs in to GitHub Container Registry.
6. Pushes the Docker image.

Images are tagged with:

- latest
- Git commit SHA

The current workflow publishes container images to GHCR.

It does not automatically deploy the application to Kubernetes or AWS.

## Running with Kubernetes

Create the Kind cluster:

    kind create cluster --name pulseboard

Apply the Kubernetes manifests:

    kubectl apply -f k8s/

Check the pods:

    kubectl get pods -n pulseboard

Check the services:

    kubectl get services -n pulseboard

Check the HPA:

    kubectl get hpa -n pulseboard

## Running Terraform

    cd terraform
    terraform init
    terraform plan

Terraform is configured to use the local Kind cluster.

## Security

The repository ignores:

- Environment files
- Terraform state files
- Terraform variable files
- Node dependencies
- Java build output
- IDE configuration

The Kubernetes manifests currently contain development-only demo credentials for local testing.

These credentials must be replaced with secure secret management before production use.

No AWS credentials or production secrets are included in this repository.

## Project Status

### Implemented

- Spring Boot microservices
- JWT authentication
- MySQL
- Kafka
- Docker
- Docker Compose
- Kubernetes
- Terraform
- Prometheus
- Grafana
- Kubernetes HPA
- Health probes
- Resource requests and limits
- GitHub Actions CI/CD
- React dashboard

### Not Currently Implemented

- AWS deployment
- Cloud-hosted Kubernetes
- Automated production deployment
- Production-grade secret management
- Kubernetes Ingress

This project focuses on demonstrating practical DevOps and cloud-native infrastructure skills using a reproducible local Kubernetes environment.

## Repository

GitHub:

https://github.com/aki-raa/pulseboard
