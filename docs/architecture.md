# Architecture

Cloud layer: **webhook ingestion** (API first), then **Lambda**, **S3**, **Amazon Bedrock** (optional AI), **Amazon Cognito** (operator sign-in), **frontend** (HTML/CSS/JS). Infrastructure as code: Terraform.

```mermaid
flowchart LR
    A["TranscripTonic\n(Chrome Extension)"]
    B["API Gateway\n(HTTPS)"]
    C["Lambda"]
    D["S3\n(Transcripts, SSE)"]
    E["Amazon Bedrock"]
    F["Terraform"]
    G["Cognito"]
    H["frontend"]

    A -->|"Webhook POST"| B
    B --> C
    C --> D
    E -.->|"Invoke model"| C
    G -.->|"Auth"| H
    F -.->|"Provisions"| B
    F -.->|"Provisions"| C
    F -.->|"Provisions"| D
    F -.->|"Provisions"| E
    F -.->|"Provisions"| G
    F -.->|"Provisions"| H
```

| Area                | Role                                                    |
| ------------------- | ------------------------------------------------------- |
| **Extension → API** | Webhook POST with transcript payload; HTTPS in transit. |
| **Lambda**          | Parse, store, optionally call Bedrock.                  |
| **S3**              | Transcript objects; encryption at rest (SSE).           |
| **Bedrock**         | Model inference (region/model are deployment choices).  |
| **Cognito**         | Sign-in for the operator UI.                            |
| **frontend**        | Operator UI; host on S3/CloudFront or similar.          |

**Order:** API Gateway first so a webhook base URL exists; Lambda and integrations next.
