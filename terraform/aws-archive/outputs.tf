output "vpc_id" {
  description = "ID of the PulseBoard VPC"
  value       = aws_vpc.pulseboard.id
}
