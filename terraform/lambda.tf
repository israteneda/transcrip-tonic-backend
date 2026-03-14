data "archive_file" "lambda" {
  type        = "zip"
  source_dir  = "${path.module}/../dist"
  output_path = "${path.module}/lambda.zip"
}

resource "aws_lambda_function" "webhook" {
  filename         = data.archive_file.lambda.output_path
  function_name   = "${var.project_name}-webhook"
  role            = aws_iam_role.lambda.arn
  handler         = "handler.handler"
  runtime         = "nodejs20.x"
  source_code_hash = data.archive_file.lambda.output_base64sha256

  environment {
    variables = {
      TRANSCRIPTS_BUCKET = aws_s3_bucket.transcripts.id
    }
  }
}
