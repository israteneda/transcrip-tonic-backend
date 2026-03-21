variable "aws_region" {
  type        = string
  description = "AWS region for API Gateway and related resources."
  default     = "us-east-1"
}

variable "project_name" {
  type        = string
  description = "Prefix for resource names."
  default     = "transcrip-tonic"
}
