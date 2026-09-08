resource "kubernetes_persistent_volume_claim" "grafana" {
  metadata {
    name      = "grafana-pvc"
    namespace = kubernetes_namespace.pulseboard.metadata[0].name
  }

  spec {
    access_modes = ["ReadWriteOnce"]

    resources {
      requests = {
        storage = "2Gi"
      }
    }
  }

  lifecycle {
    ignore_changes = [
      spec[0].storage_class_name
    ]
  }
}

resource "kubernetes_deployment" "grafana" {
  metadata {
    name      = "grafana"
    namespace = kubernetes_namespace.pulseboard.metadata[0].name
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "grafana"
      }
    }

    template {
      metadata {
        labels = {
          app = "grafana"
        }
      }

      spec {
        automount_service_account_token = false
        enable_service_links            = false

        container {
          name              = "grafana"
          image             = "grafana/grafana:12.1.1"
          image_pull_policy = "IfNotPresent"

          port {
            container_port = 3000
          }

          resources {
            requests = {
              cpu    = "100m"
              memory = "128Mi"
            }

            limits = {
              cpu    = "500m"
              memory = "512Mi"
            }
          }

          env {
            name  = "GF_SECURITY_ADMIN_USER"
            value = "admin"
          }

          env {
            name = "GF_SECURITY_ADMIN_PASSWORD"

            value_from {
              secret_key_ref {
                name = "grafana-secret"
                key  = "GF_SECURITY_ADMIN_PASSWORD"
              }
            }
          }

          volume_mount {
            name       = "grafana-storage"
            mount_path = "/var/lib/grafana"
          }
        }

        volume {
          name = "grafana-storage"

          persistent_volume_claim {
            claim_name = "grafana-pvc"
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

resource "kubernetes_service" "grafana" {
  metadata {
    name      = "grafana"
    namespace = kubernetes_namespace.pulseboard.metadata[0].name
  }

  spec {
    selector = {
      app = "grafana"
    }

    port {
      port        = 3000
      target_port = 3000
    }

    type = "ClusterIP"
  }

  lifecycle {
    ignore_changes = [
      wait_for_load_balancer
    ]
  }
}
