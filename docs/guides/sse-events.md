# Real-time Updates (SSE)

Enterprise exposes Server-Sent Events (SSE) endpoints for receiving live record changes and AI response streams without polling. SSE uses a persistent HTTP connection where the server pushes `data:` lines to the client as events occur.

## Data streaming — record changes

The Data module's `StreamService` pushes a change event every time a record is created, updated, or deleted, across any registered model.

### Connect

```http
GET /api/data/stream?models=contacts,accounts,opportunities
Accept: text/event-stream
Authorization: Bearer <access_token>
```

The `models` query parameter accepts a comma-separated list of model keys. Omit it to receive events for all models.

### Event format

Each SSE event is a JSON object:

```
data: {"operation":"insert","model":"contacts","record":{"_id":"...","firstName":"Jane","lastName":"Smith",...}}

data: {"operation":"update","model":"opportunities","record":{"_id":"...","stage":"proposal",...}}

data: {"operation":"delete","model":"accounts","recordId":"..."}
```

| Field | Values | Description |
|---|---|---|
| `operation` | `insert` \| `update` \| `delete` | Type of change |
| `model` | e.g. `contacts` | Model key of the affected record |
| `record` | object | Full record (insert/update) or just `recordId` (delete) |

### Browser example

```js
const token = '<your_access_token>';
const url = '/api/data/stream?models=contacts,opportunities';

const source = new EventSource(url, {
  // EventSource doesn't support custom headers natively — use a cookie session
  // or a library like `eventsource` (Node) that supports Authorization headers.
});

source.onmessage = (event) => {
  const { operation, model, record } = JSON.parse(event.data);
  console.log(`${operation} on ${model}:`, record);
};

source.onerror = () => {
  console.warn('SSE connection lost — will auto-reconnect');
};
```

### Node.js / server-side example

```js
import { EventSource } from 'eventsource'; // npm install eventsource

const source = new EventSource('https://your-instance.com/api/data/stream?models=contacts', {
  headers: { Authorization: `Bearer ${token}` },
});

source.onmessage = ({ data }) => {
  const event = JSON.parse(data);
  // handle the change event
};
```

### Reconnection

The browser's `EventSource` API reconnects automatically after a dropped connection using the `retry:` field sent by the server. The server sends this every 30 seconds to keep the connection alive.

---

## AI chat streaming

The AI module's `ChatStreamService` streams language model responses token by token so your UI can render text progressively as it arrives.

### Connect

```http
POST /api/ai/chat/stream
Content-Type: application/json
Accept: text/event-stream
Authorization: Bearer <access_token>

{
  "model": "claude-sonnet-4",
  "message": "Summarise the top 5 open opportunities this quarter",
  "accountKey": "your-account-key"
}
```

> Note: This endpoint uses `POST` with an SSE response. Use `fetch` with a `ReadableStream` reader rather than `EventSource` (which only supports `GET`).

### Event format

```
data: {"type":"text","text":"Here are "}
data: {"type":"text","text":"the top 5 "}
data: {"type":"text","text":"open opportunities..."}
data: [DONE]
```

### Browser example

```js
const response = await fetch('/api/ai/chat/stream', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'Accept': 'text/event-stream',
  },
  body: JSON.stringify({ model: 'gpt-4o', message: 'Hello!', accountKey: 'acme' }),
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  const lines = decoder.decode(value).split('\n');
  for (const line of lines) {
    if (!line.startsWith('data: ')) continue;
    const payload = line.slice(6);
    if (payload === '[DONE]') return;
    const { text } = JSON.parse(payload);
    process.stdout.write(text ?? '');
  }
}
```

---

## Tips

- **Authentication**: Data stream uses cookie-based sessions by default. If you need `Authorization` header support, use a server-side proxy or the `eventsource` npm package.
- **Filtering**: Always pass a `models=` list to the data stream endpoint to avoid receiving events for every model in the system.
- **Abort**: Pass an `AbortController` signal to `fetch()` to cancel a stream cleanly when the user navigates away.
