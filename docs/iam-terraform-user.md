# Minimal IAM policy for Terraform user (Option A)

PowerUserAccess does not allow `iam:CreateRole`. The Terraform user needs this policy to create and manage the Lambda execution role. The Terraform user also cannot run `iam:CreatePolicy`, so this policy must be created once by an admin (or root), then attached to the Terraform user.

**Steps (one-time, as admin or root):**

1. Get account ID: `aws sts get-caller-identity --query Account --output text` (or Console → top-right → Account ID).
2. IAM → Policies → Create policy → JSON. Paste the contents of `terraform/terraform-user-policy.json`, replace `ACCOUNT_ID` in `Resource` with your 12-digit account ID. Next → name the policy (e.g. `transcrip-tonic-terraform-lambda-role`) → Create.
3. IAM → Users → your Terraform user → Add permissions → Attach policies directly → select the policy → Add.

After that, the Terraform user can run `terraform apply` and manage the Lambda role.
