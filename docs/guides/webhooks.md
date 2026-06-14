# Webhooks

The Integrations module's `WebhookService` lets you register external HTTP endpoints to receive push notifications when Enterprise events occur. Unlike SSE (which requires a persistent open connection from the client), webhooks are server-to-server HTTP `POST` requests fired by Enterprise whenever a matching event is triggered.

## How webhooks work

1. You register a webhook with an endpoint URL and a list of event types to subscribe to.
2. Enterprise stores the registration and assigns it an ID and a signing secret.
3. When a matching event occurs, Enterprise sends a `POST` request to your endpoint with a JSON body and an `X-Enterprise-Signature` header.
4. Your endpoint verifies the signature and processes the payload.
5. Your endpoint returns a `2xx` response within **10 seconds** — otherwise Enterprise retries with exponential back-off (up to 5 attempts).

---

## Registering a webhook

```http
POST /api/integrations/webhooks
Content-Type: application/json
Authorization: Bearer <access_token>

{
  "url": "https://your-server.com/webhooks/enterprise",
  "events": ["contact.created", "opportunity.updated", "invoice.paid"],
  "description": "CRM sync endpoint",
  "active": true
}
```

**Response:**

```json
{
  "_id": "<webhook_id>",
  "url": "https://your-server.com/webhooks/enterprise",
  "events": ["contact.created", "opportunity.updated", "invoice.paid"],
  "secret": "whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "active": true,
  "createdAt": "2026-06-14T12:00:00Z"
}
```

Store the `secret` securely — it is only shown once at registration time and is used to verify incoming payloads.

---

## Managing webhooks

```http
GET    /api/integrations/webhooks           # list all registered webhooks
GET    /api/integrations/webhooks/{id}      # get a single webhook
PUT    /api/integrations/webhooks/{id}      # update URL, events, or active state
DELETE /api/integrations/webhooks/{id}      # permanently delete a webhook
```

### Pause and resume

Set `active: false` to pause delivery without deleting the registration:

```http
PUT /api/integrations/webhooks/{id}
{ "active": false }
```

---

## Payload format

Every webhook delivery is a `POST` request with the following structure:

```json
{
  "id": "<event_id>",
  "type": "contact.created",
  "timestamp": "2026-06-14T12:01:00Z",
  "accountKey": "acme-corp",
  "data": {
    "record": {
      "_id": "<contact_id>",
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane@example.com",
      "status": "active"
    }
  }
}
```

| Field | Description |
|---|---|
| `id` | Unique event ID — use for deduplication |
| `type` | The event type that triggered this delivery |
| `timestamp` | ISO 8601 timestamp of when the event occurred |
| `accountKey` | The tenant account that generated the event |
| `data.record` | The affected record (full object for creates/updates; `{_id}` for deletes) |

---

## Available event types

| Event | Triggered when |
|---|---|
| `{model}.created` | A record is created in any model |
| `{model}.updated` | A record is updated |
| `{model}.deleted` | A record is deleted |
| `finance.payment.completed` | A Stripe payment succeeds |
| `finance.payment.failed` | A Stripe payment fails |
| `sync.completed` | A vendor data sync finishes |
| `sync.failed` | A vendor data sync encounters an error |
| `import.completed` | An import job finishes |
| `export.completed` | An export job finishes |

Replace `{model}` with any registered model key — e.g. `contact.created`, `opportunity.updated`, `financeInvoice.created`.

---

## Verifying signatures

Enterprise signs every webhook payload using HMAC-SHA256 with your webhook's `secret`. Always verify the signature before processing.

### How to verify

The signature is sent in the `X-Enterprise-Signature` header as `sha256=<hex_digest>`.

```js
import crypto from 'crypto';

function verifyWebhook(payload, signature, secret) {
  const expected = 'sha256=' + crypto
    .createHmac('sha256', secret)
    .update(payload, 'utf8')
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected),
  );
}

// Express.js handler
app.post('/webhooks/enterprise', express.raw({ type: 'application/json' }), (req, res) => {
  const signature = req.headers['x-enterprise-signature'];
  const secret = process.env.ENTERPRISE_WEBHOOK_SECRET;

  if (!verifyWebhook(req.body, signature, secret)) {
    return res.status(401).send('Invalid signature');
  }

  const event = JSON.parse(req.body);
  console.log('Received event:', event.type, event.data.record);

  res.status(200).send('OK');
});
```

> **Important:** Parse the raw request body as bytes before JSON-decoding it. Parsing to JSON first and re-serialising will change whitespace and invalidate the signature.

---

## Retries and delivery guarantees

| Attempt | Delay |
|---|---|
| 1 (immediate) | — |
| 2 | 30 seconds |
| 3 | 5 minutes |
| 4 | 30 minutes |
| 5 | 2 hours |

After 5 failed attempts the webhook delivery is marked `failed`. You can inspect delivery history and manually retry:

```http
GET /api/integrations/webhooks/{id}/deliveries    # delivery log with status
POST /api/integrations/webhooks/{id}/retry/{delivery_id}  # retry a failed delivery
```

---

## Local development

Use a tunnelling tool like [ngrok](https://ngrok.com) or [cloudflared](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/) to expose your local server to the internet during development:

```bash
ngrok http 3000
# Forwarding: https://abc123.ngrok.io -> http://localhost:3000

# Register the ngrok URL as your webhook endpoint
curl -X POST https://your-instance.com/api/integrations/webhooks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://abc123.ngrok.io/webhooks/enterprise","events":["contact.created"]}'
```
