resource "kubernetes_service" "mysql" {
  metadata {
    name      = "mysql"
    namespace = kubernetes_namespace.pulseboard.metadata[0].name
  }

  spec {
    selector = {
      app = "mysql"
    }

    port {
      port        = 3306
      target_port = 3306
    }

    type = "ClusterIP"
  }

  lifecycle {
    ignore_changes = [
      wait_for_load_balancer
    ]
  }
}

resource "kubernetes_persistent_volume_claim" "mysql" {
  metadata {
    name      = "mysql-pvc"
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

resource "kubernetes_deployment" "mysql" {

  metadata {
    name      = "mysql"
    namespace = kubernetes_namespace.pulseboard.metadata[0].name
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "mysql"
      }
    }

    template {
      metadata {
        labels = {
          app = "mysql"
        }
      }

      spec {
        automount_service_account_token = false
        enable_service_links = false

        container {
          name  = "mysql"
          image = "mysql:8.4"

          port {
            container_port = 3306
          }

          env {
            name = "MYSQL_ROOT_PASSWORD"

            value_from {
              secret_key_ref {
                name = "mysql-secret"
                key  = "MYSQL_ROOT_PASSWORD"
              }
            }
          }

          env {
            name  = "MYSQL_DATABASE"
            value = "pulseboard"
          }

          volume_mount {
            name       = "mysql-storage"
            mount_path = "/var/lib/mysql"
          }
        }

        volume {
          name = "mysql-storage"

          persistent_volume_claim {
            claim_name = "mysql-pvc"
          }
        }
      }
    }
  }

  lifecycle {
    ignore_changes = [
      wait_for_rollout
    ]
  }
}

resource "kubernetes_secret" "mysql" {
  metadata {
    name      = "mysql-secret"
    namespace = kubernetes_namespace.pulseboard.metadata[0].name
  }

  lifecycle {
    ignore_changes = [
      data,
      wait_for_service_account_token
    ]
  }
}
