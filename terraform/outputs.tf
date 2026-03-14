output "api_gateway_id" {
  description = "HTTP API identifier."
  value       = aws_apigatewayv2_api.main.id
}

output "api_gateway_endpoint" {
  description = "Base URL for the HTTP API."
  value       = aws_apigatewayv2_api.main.api_endpoint
}

output "webhook_url" {
  description = "Full URL for TranscripTonic webhook (POST)."
  value       = "${aws_apigatewayv2_api.main.api_endpoint}/webhook"
}

output "transcripts_bucket" {
  description = "S3 bucket for transcript objects."
  value       = aws_s3_bucket.transcripts.id
}
