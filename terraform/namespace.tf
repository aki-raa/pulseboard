resource "kubernetes_namespace" "pulseboard" {
  metadata {
    name = "pulseboard"
  }
}
