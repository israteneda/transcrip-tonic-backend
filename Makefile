.PHONY: build typecheck test test-local test-webhook install format lint list-transcripts get-transcript chat-transcript

# Override webhook URL: make test-webhook WEBHOOK_URL=https://...
WEBHOOK_URL ?=

install:
	cd src && npm install
	npm install

build:
	cd src && npm run build

typecheck:
	cd src && npm run typecheck

format:
	npm run format

lint:
	npm run lint

test: build
	cd src && npx tsx ../scripts/handler.test.ts

test-local: build
	@if [ -f .env ]; then set -a && . ./.env && set +a; fi; \
	cd src && npx tsx ../scripts/invoke-local.ts

test-webhook:
	@if [ -f .env ]; then set -a && . ./.env && set +a; fi; \
	URL="$(WEBHOOK_URL)"; [ -z "$$URL" ] && URL="$${WEBHOOK_URL}"; \
	if [ -z "$$URL" ]; then URL=$$(cd terraform && terraform output -raw webhook_url 2>/dev/null); fi; \
	if [ -z "$$URL" ]; then echo "Run terraform apply first, or set WEBHOOK_URL in .env (see .env.example), or: make test-webhook WEBHOOK_URL=<url>"; exit 1; fi; \
	sh scripts/test-webhook.sh "$$URL"

list-transcripts:
	@if [ -f .env ]; then set -a && . ./.env && set +a; fi; \
	B="$${TRANSCRIPTS_BUCKET}"; [ -z "$$B" ] && B=$$(cd terraform && terraform output -raw transcripts_bucket 2>/dev/null); \
	if [ -z "$$B" ]; then echo "Set TRANSCRIPTS_BUCKET in .env or run from terraform dir."; exit 1; fi; \
	aws s3 ls "s3://$$B/webhook/"

get-transcript:
	@if [ -f .env ]; then set -a && . ./.env && set +a; fi; \
	B="$${TRANSCRIPTS_BUCKET}"; [ -z "$$B" ] && B=$$(cd terraform && terraform output -raw transcripts_bucket 2>/dev/null); \
	if [ -z "$$B" ]; then echo "Set TRANSCRIPTS_BUCKET in .env or run from terraform dir."; exit 1; fi; \
	KEY="$(KEY)"; if [ -z "$$KEY" ]; then echo "Usage: make get-transcript KEY=filename.json"; exit 1; fi; \
	aws s3 cp "s3://$$B/webhook/$$KEY" - | node -e "const d=require('fs').readFileSync(0,'utf8'); try { console.log(JSON.stringify(JSON.parse(d), null, 2)); } catch(e) { process.stdout.write(d); }"

chat-transcript:
	@if [ -f .env ]; then set -a && . ./.env && set +a; fi; \
	B="$${TRANSCRIPTS_BUCKET}"; [ -z "$$B" ] && B=$$(cd terraform && terraform output -raw transcripts_bucket 2>/dev/null); \
	if [ -z "$$B" ]; then echo "Set TRANSCRIPTS_BUCKET in .env or run from terraform dir."; exit 1; fi; \
	KEY="$(KEY)"; if [ -z "$$KEY" ]; then echo "Usage: make chat-transcript KEY=filename.json"; exit 1; fi; \
	aws s3 cp "s3://$$B/webhook/$$KEY" .transcript.json && \
	claude --append-system-prompt-file .transcript.json "Transcript is in context. Let's discuss."
