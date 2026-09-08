resource "kubernetes_service" "alert" {
  metadata {
    name      = "alert-service"
    namespace = kubernetes_namespace.pulseboard.metadata[0].name
  }

  spec {
    selector = {
      app = "alert-service"
    }

    port {
      port        = 8084
      target_port = 8084
    }

    type = "ClusterIP"
  }

  lifecycle {
    ignore_changes = [
      wait_for_load_balancer
    ]
  }
}

resource "kubernetes_deployment" "alert" {
  metadata {
    name      = "alert-service"
    namespace = kubernetes_namespace.pulseboard.metadata[0].name
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "alert-service"
      }
    }

    template {
      metadata {
        labels = {
          app = "alert-service"
        }
      }

      spec {
        automount_service_account_token = false
        enable_service_links             = false

        container {
          name              = "alert-service"
          image             = "pulseboard-alert-service:latest"
          image_pull_policy = "IfNotPresent"

          port {
            container_port = 8084
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
              port = 8084
            }

            initial_delay_seconds = 20
            period_seconds        = 10
          }

          liveness_probe {
            http_get {
              path = "/actuator/health/liveness"
              port = 8084
            }

            initial_delay_seconds = 30
            period_seconds        = 15
          }

          env {
            name  = "DB_URL"
            value = "jdbc:mysql://mysql:3306/pulseboard"
          }

          env {
            name = "DB_USERNAME"

            value_from {
              secret_key_ref {
                name = "alert-service-secret"
                key  = "DB_USERNAME"
              }
            }
          }

          env {
            name = "DB_PASSWORD"

            value_from {
              secret_key_ref {
                name = "alert-service-secret"
                key  = "DB_PASSWORD"
              }
            }
          }

          env {
            name = "JWT_SECRET"

            value_from {
              secret_key_ref {
                name = "alert-service-secret"
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
