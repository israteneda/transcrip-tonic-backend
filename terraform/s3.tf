resource "aws_s3_bucket" "transcripts" {
  bucket = "${var.project_name}-transcripts-${data.aws_caller_identity.current.account_id}"
}

resource "aws_s3_bucket_versioning" "transcripts" {
  bucket = aws_s3_bucket.transcripts.id

  versioning_configuration {
    status = "Enabled"
  }
}
