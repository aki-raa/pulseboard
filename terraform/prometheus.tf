resource "kubernetes_config_map" "prometheus" {
  metadata {
    name      = "prometheus-config"
    namespace = kubernetes_namespace.pulseboard.metadata[0].name
  }

  data = {
    "prometheus.yml" = <<-EOT
      global:
        scrape_interval: 15s
        evaluation_interval: 15s

      scrape_configs:

        - job_name: "auth-service"
          metrics_path: "/actuator/prometheus"
          static_configs:
            - targets: ["auth-service:8080"]

        - job_name: "location-service"
          metrics_path: "/actuator/prometheus"
          static_configs:
            - targets: ["location-service:8082"]

        - job_name: "chat-service"
          metrics_path: "/actuator/prometheus"
          static_configs:
            - targets: ["chat-service:8083"]

        - job_name: "alert-service"
          metrics_path: "/actuator/prometheus"
          static_configs:
            - targets: ["alert-service:8084"]
    EOT
  }

  lifecycle {
    ignore_changes = [
      metadata[0].annotations
    ]
  }
}

resource "kubernetes_deployment" "prometheus" {
  metadata {
    name      = "prometheus"
    namespace = kubernetes_namespace.pulseboard.metadata[0].name
  }

  spec {
    replicas = 1

    selector {
      match_labels = {
        app = "prometheus"
      }
    }

    template {
      metadata {
        labels = {
          app = "prometheus"
        }
      }

      spec {
        automount_service_account_token = false
        enable_service_links             = false

        container {
          name              = "prometheus"
          image             = "prom/prometheus:v3.5.0"
          image_pull_policy = "IfNotPresent"

          port {
            container_port = 9090
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

          volume_mount {
            name       = "prometheus-config"
            mount_path = "/etc/prometheus/prometheus.yml"
            sub_path   = "prometheus.yml"
          }
        }

        volume {
          name = "prometheus-config"

          config_map {
            name = "prometheus-config"
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

resource "kubernetes_service" "prometheus" {
  metadata {
    name      = "prometheus"
    namespace = kubernetes_namespace.pulseboard.metadata[0].name
  }

  spec {
    selector = {
      app = "prometheus"
    }

    port {
      port        = 9090
      target_port = 9090
    }

    type = "ClusterIP"
  }

  lifecycle {
    ignore_changes = [
      wait_for_load_balancer
    ]
  }
}
