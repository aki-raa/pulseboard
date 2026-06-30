# PulseBoard Monitoring
Prometheus + Grafana observability setup for all 4 PulseBoard microservices.
## Stack
- **Prometheus** — scrapes JVM and HTTP metrics from auth, location, chat, and alert services via Spring Boot Actuator
- **Grafana** — visualizes heap memory usage and HTTP request rate per service
## Setup
1. Add Spring Boot Actuator + Micrometer Prometheus dependency to each service `pom.xml`
2. Expose metrics in `application.properties`:
management.endpoints.web.exposure.include=health,prometheus management.endpoint.prometheus.enabled=true
3. Run Prometheus pointing to `monitoring/prometheus.yml`
4. Run Grafana and add Prometheus as a data source
5. Import `monitoring/grafana/dashboards/pulseboard-monitoring.json`
## Metrics Tracked
- JVM heap memory usage per service
- HTTP request rate per service
## Ports
| Service | Port |
|---|---|
| auth-service | 8080 |
| location-service | 8082 |
| chat-service | 8083 |
| alert-service | 8084 |
