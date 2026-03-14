# TranscripTonic Backend

> **Backend infrastructure for [TranscripTonic](https://chromewebstore.google.com/detail/transcriptonic/ciepnfnceimjehngolkijpnbappkkiag?hl=en)** — Simple Google Meet transcripts. Private and open source.

[TranscripTonic](https://chromewebstore.google.com/detail/transcriptonic/ciepnfnceimjehngolkijpnbappkkiag?hl=en) extends the open-source extension with a cloud layer (webhooks, storage, optional AI). Extension defaults stay on-device; cloud is optional.

**Stack:** TypeScript, Node 20, AWS Lambda, API Gateway (HTTP), S3, Terraform. Tests: Node built-in test runner.

**Docs:** [Architecture](./docs/architecture.md) · [AWS and Terraform](./docs/aws-and-terraform.md) · [Webhook](./docs/webhook-endpoint.md) · [IAM (Terraform user)](./docs/iam-terraform-user.md).

| Command                              | Description                                                                                |
| ------------------------------------ | ------------------------------------------------------------------------------------------ |
| `make install`                       | Install dependencies (src + root for format/lint).                                         |
| `make build`                         | Build Lambda bundle.                                                                       |
| `make typecheck`                     | TypeScript check.                                                                          |
| `make format`                        | Format code (Prettier).                                                                    |
| `make lint`                          | Lint code (ESLint).                                                                        |
| `make test`                          | Unit tests.                                                                                |
| `make test-local`                    | Run handler locally (optional S3 if TRANSCRIPTS_BUCKET set).                               |
| `make test-webhook`                  | POST to deployed API Gateway webhook.                                                      |
| `make list-transcripts`              | List transcript objects in S3 (uses .env or terraform output).                             |
| `make get-transcript KEY=file.json`  | Stream one transcript from S3 to stdout.                                                   |
| `make chat-transcript KEY=file.json` | Fetch transcript to .transcript.json and open Claude CLI with it in context (interactive). |

**Test webhook (after deploy):** `cp .env.example .env`, set `WEBHOOK_URL` (e.g. `cd terraform && terraform output -raw webhook_url`), then `make test-webhook`.

Terraform (run from `terraform/` or prefix with `cd terraform &&`):

| Command                             | Description             |
| ----------------------------------- | ----------------------- |
| `terraform output`                  | View URLs and bucket.   |
| `terraform output -raw webhook_url` | Webhook URL only.       |
| `terraform state list`              | List managed resources. |
| `terraform plan`                    | Show planned changes.   |
| `terraform apply`                   | Apply changes.          |

| Command                                    | Description                                                              |
| ------------------------------------------ | ------------------------------------------------------------------------ |
| `make list-transcripts`                    | List transcript objects (sources .env or terraform output).              |
| `make get-transcript KEY=file.json`        | Stream one transcript to stdout.                                         |
| `aws s3 cp s3://BUCKET/webhook/KEY.json -` | Get one transcript (BUCKET from .env / terraform output; KEY from list). |

**Transcript + Claude:** One-shot: `make get-transcript KEY=file.json | claude -p "Summarize this meeting transcript."` Interactive: `make chat-transcript KEY=file.json` (requires [Claude CLI](https://docs.anthropic.com/en/docs/claude-code/cli-usage)).

---

## Related links

- [TranscripTonic Chrome Extension](https://chromewebstore.google.com/detail/transcriptonic/ciepnfnceimjehngolkijpnbappkkiag?hl=en)
- [TranscripTonic source](https://github.com/vivek-nexus/transcriptonic)
- [Webhook docs](https://github.com/vivek-nexus/transcriptonic/wiki)
- [Amazon Bedrock](https://docs.aws.amazon.com/bedrock/)
- [Amazon Cognito](https://docs.aws.amazon.com/cognito/)

---

## License

See [LICENSE](./LICENSE).
