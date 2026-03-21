# AWS account and Terraform (single environment)

**Current Terraform:** HTTP API + `$default` stage. Default **region:** `us-east-1` (`terraform/variables.tf`). **State:** local `terraform/terraform.tfstate` after apply (gitignored). One AWS account.

## 1. AWS account

Use one account where API Gateway is allowed and billing is active.

## 2. IAM user for Terraform

Console access is optional. Terraform uses access keys only; enable console only if you want to sign in to the AWS Console with this user.

1. **IAM** → **Users** → **Create user**. User name e.g. `terraform-transcrip-tonic`. Do not provide console access unless you need it.
2. **Set permissions:** choose **Attach policies directly**. Search and select **PowerUserAccess**. Then add the [minimal IAM policy](./iam-terraform-user.md) (Option A) so Terraform can create the Lambda role.
3. Open the new user → **Security credentials** → **Create access key** → use case **Command Line Interface (CLI)**. Ignore the recommended alternatives (e.g. aws login, CloudShell); for a programmatic-only user you need the key. Optional: set description tag (e.g. `Terraform and AWS CLI for transcrip-tonic backend (local)`). Store Access key ID and Secret access key; secret is shown once.

## 3. AWS CLI

```bash
aws configure --profile transcrip-tonic
```

When prompted:

| Prompt                | Value                                         |
| --------------------- | --------------------------------------------- |
| AWS Access Key ID     | Paste from console (or CSV).                  |
| AWS Secret Access Key | Paste from console (or CSV).                  |
| Default region name   | `us-east-1` (match `terraform/variables.tf`). |
| Default output format | `json`.                                       |

For every apply:

```bash
export AWS_PROFILE=transcrip-tonic
```

## 4. Deploy

```bash
cd terraform
terraform init
terraform plan
terraform apply
```

## 5. Smoke check

```bash
curl -s -o /dev/null -w "%{http_code}" "$(terraform output -raw api_gateway_endpoint)/"
```

Expect **404**, not 403 (auth failure).

## 6. Destroy

```bash
cd terraform && terraform destroy
```

## Multi-account later

Separate profiles, state, and backends per account; same Terraform modules, different `tfvars` or workspaces.
