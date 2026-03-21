# Webhook endpoint (TranscripTonic)

Initial endpoint to receive transcript payloads from the extension.

| Item             | Value                                                                                                  |
| ---------------- | ------------------------------------------------------------------------------------------------------ |
| Path             | `POST /webhook`                                                                                        |
| Full URL         | `{api_gateway_endpoint}/webhook`                                                                       |
| Request          | JSON preferred; accept `text/plain`. Max body size 1 MB.                                               |
| Success response | `200` or `202`.                                                                                        |
| Failure          | `400` if body is not valid JSON or missing required TranscripTonic fields. `413` if body exceeds 1 MB. |

TranscripTonic sends POST with `Content-Type: application/json` only; no custom headers. Configure the extension with Terraform output `webhook_url`. Auth when needed: Cognito or API Gateway authorizer.
