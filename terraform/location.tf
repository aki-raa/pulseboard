resource "kubernetes_service" "location" {
  metadata {
    name      = "location-service"
    namespace = kubernetes_namespace.pulseboard.metadata[0].name
  }

  spec {
    selector = {
      app = "location-service"
    }

    port {
      port        = 8082
      target_port = 8082
    }

    type = "ClusterIP"
  }

  lifecycle {
    ignore_changes = [
      wait_for_load_balancer
    ]
  }
}

resource "kubernetes_deployment" "location" {
  metadata {
    name      = "location-service"
    namespace = kubernetes_namespace.pulseboard.metadata[0].name
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "location-service"
      }
    }

    template {
      metadata {
        labels = {
          app = "location-service"
        }
      }

      spec {
        automount_service_account_token = false
        enable_service_links             = false

        container {
          name              = "location-service"
          image             = "pulseboard-location-service:latest"
          image_pull_policy = "IfNotPresent"

          port {
            container_port = 8082
          }

          resources {
            requests = {
              cpu    = "100m"
              memory = "256Mi"
            }

            limits = {
              cpu    = "500m"
              memory = "512Mi"
            }
          }

          readiness_probe {
            http_get {
              path = "/actuator/health/readiness"
              port = 8082
            }

            initial_delay_seconds = 60
            period_seconds        = 10
            timeout_seconds       = 5
            failure_threshold     = 6
          }

          liveness_probe {
            http_get {
              path = "/actuator/health/liveness"
              port = 8082
            }

            initial_delay_seconds = 90
            period_seconds        = 15
            timeout_seconds       = 5
            failure_threshold     = 3
          }

          env {
            name  = "DB_URL"
            value = "jdbc:mysql://mysql:3306/pulseboard"
          }

          env {
            name = "DB_USERNAME"

            value_from {
              secret_key_ref {
                name = "location-service-secret"
                key  = "DB_USERNAME"
              }
            }
          }

          env {
            name = "DB_PASSWORD"

            value_from {
              secret_key_ref {
                name = "location-service-secret"
                key  = "DB_PASSWORD"
              }
            }
          }

          env {
            name = "JWT_SECRET"

            value_from {
              secret_key_ref {
                name = "location-service-secret"
                key  = "JWT_SECRET"
              }
            }
          }

          env {
            name  = "KAFKA_BOOTSTRAP_SERVERS"
            value = "kafka:9092"
          }
        }
      }
    }
  }

  lifecycle {
    ignore_changes = [
      wait_for_rollout,
      spec[0].template[0].metadata[0].annotations
    ]
  }
}
