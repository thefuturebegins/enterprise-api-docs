# AI

The AI module provides a unified interface for language model completions, streaming chat, image generation, and image search. It routes requests across multiple LLM providers (OpenAI, Anthropic, Gemini) based on the requested model, logs every completion for auditability, and injects a suite of Enterprise CRM tools that allow the model to query live platform data.

## What it covers

| Section | Description |
|---|---|
| **Text Completion** | Single-turn completions with optional tool use |
| **Chat** | Multi-turn conversational completions |
| **Chat Stream (SSE)** | Streaming chat responses via Server-Sent Events |
| **Image Generation** | Generate images from text prompts (Stable Diffusion) |
| **Image Request / Search** | Search for images using natural language (Serper) |

## Supported LLM providers

| Provider | Models |
|---|---|
| **OpenAI** | `gpt-4o`, `gpt-4o-mini`, `o1`, `o3-mini`, and others |
| **Anthropic** | `claude-opus-4`, `claude-sonnet-4`, `claude-haiku-3-5`, and others |
| **Google Gemini** | `gemini-2.5-pro`, `gemini-2.5-flash`, and others |

Provider credentials are resolved per-account from the `settings` model — each tenant can supply their own API keys.

## Authentication

All AI endpoints require a valid session. The underlying LLM provider API keys are stored in the account's settings and resolved server-side; clients never need to supply them.

## Core services

### Text Completion

Single-turn completions. Include `model` to target a specific provider.

```http
POST /api/ai/text-completion/complete
Content-Type: application/json

{
  "model": "claude-sonnet-4",
  "messages": [
    { "role": "user", "content": "Summarise the latest notes for contact {contactId}" }
  ],
  "context": {
    "accountKey": "acme-corp"
  }
}
```

Enterprise CRM tools are injected automatically (`includeEnterpriseTools: true`), so the model can query contacts, accounts, opportunities, and other live records by calling the registered tool functions. Up to **8 tool call iterations** are executed per request before the loop terminates.

### Chat (multi-turn)

Maintains conversation history across multiple turns. Credentials are resolved per-account.

```http
POST /api/ai/chat/message
{
  "model": "gpt-4o",
  "conversationId": "<optional — omit to start a new conversation>",
  "message": "What opportunities are closing this month?",
  "accountKey": "acme-corp"
}
```

### Chat Stream (SSE)

For real-time streaming responses — connect via EventSource or `fetch` with streaming:

```http
POST /api/ai/chat/stream
Accept: text/event-stream

{
  "model": "gemini-2.5-pro",
  "message": "Draft a follow-up email for the Acme Corp opportunity",
  "accountKey": "acme-corp"
}
```

The SSE stream emits `data:` events containing `TextStreamChunk` JSON objects. The stream closes with a `[DONE]` sentinel.

```js
const es = new EventSource('/api/ai/chat/stream', { method: 'POST', ... });
es.onmessage = ({ data }) => {
  if (data === '[DONE]') return es.close();
  const chunk = JSON.parse(data);
  process.stdout.write(chunk.text ?? '');
};
```

### Image Generation

Generates images from a text prompt using Stable Diffusion.

```http
POST /api/ai/image/generate
{
  "prompt": "A futuristic enterprise dashboard, dark mode, clean UI",
  "width": 1024,
  "height": 1024
}
```

### Image Search

Natural-language image search powered by the Serper image search API.

```http
POST /api/ai/image-request/search
{
  "query": "professional headshot placeholder"
}
```

## Enterprise CRM tools

When the LLM is given a task involving platform data, it automatically has access to these built-in tools:

| Tool | What it does |
|---|---|
| `queryRecords` | Query any Enterprise model with filters and pagination |
| `getRecord` | Fetch a single record by ID |
| `createRecord` | Create a new record in any model |
| `updateRecord` | Update fields on an existing record |

These tools allow prompts like _"Find all leads from last week and summarise their industries"_ or _"Create a follow-up task for contact X"_ to be executed directly without client-side orchestration.

## Completion logging

Every completion — successful or failed — is recorded in the `aiCompletionLogs` model with:
- Model ID and provider
- Request/response timing
- Finish reason
- Token usage
- Error details (if any)

Use these logs for cost tracking, debugging, and compliance.

## Configuration

| Environment variable | Description |
|---|---|
| `OPENAI_API_KEY` | Default OpenAI key (overridden by per-account settings) |
| `ANTHROPIC_API_KEY` | Default Anthropic key |
| `GOOGLE_AI_API_KEY` | Default Gemini key |
| `STABLE_DIFFUSION_API_KEY` | Stable Diffusion image generation key |
| `SERPER_API_KEY` | Serper image search key |
