resource "kubernetes_horizontal_pod_autoscaler_v2" "chat" {
  metadata {
    name      = "chat-service-hpa"
    namespace = kubernetes_namespace.pulseboard.metadata[0].name
  }

  spec {
    min_replicas = 1
    max_replicas = 3

    behavior {
      scale_up {
        stabilization_window_seconds = 0
        select_policy               = "Max"

        policy {
          type           = "Percent"
          value          = 100
          period_seconds = 60
        }
      }

      scale_down {
        stabilization_window_seconds = 60
        select_policy               = "Max"

        policy {
          type           = "Percent"
          value          = 50
          period_seconds = 60
        }
      }
    }

    scale_target_ref {
      api_version = "apps/v1"
      kind        = "Deployment"
      name        = "chat-service"
    }

    metric {
      type = "Resource"

      resource {
        name = "cpu"

        target {
          type               = "Utilization"
          average_utilization = 70
        }
      }
    }
  }
}
