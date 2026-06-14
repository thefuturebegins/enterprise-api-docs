# Authentication

The Enterprise API uses **Bearer token authentication** on all endpoints.

## Obtaining an API key

API keys are issued through the admin dashboard. Contact your organization administrator to generate or rotate keys.

## Sending requests

Include your API key in the `Authorization` header on every request:

```http
Authorization: Bearer YOUR_API_KEY
```

### Example with curl

```bash
curl -X GET "https://api.enterprise.internal/api/sales/accounts" \
  -H "Authorization: Bearer ent_live_xxxxxxxxxxxxxxxx"
```

### Example with JavaScript (fetch)

```js
const response = await fetch('https://api.enterprise.internal/api/sales/accounts', {
  headers: {
    Authorization: 'Bearer ent_live_xxxxxxxxxxxxxxxx',
    Accept: 'application/json',
  },
})
const data = await response.json()
```

### Example with Python (httpx)

```python
import httpx

client = httpx.Client(headers={"Authorization": "Bearer ent_live_xxxxxxxxxxxxxxxx"})
response = client.get("https://api.enterprise.internal/api/sales/accounts")
data = response.json()
```

## Key types

| Prefix | Environment | Notes |
|---|---|---|
| `ent_live_` | Production | Treat as a secret; never commit to source control |
| `ent_test_` | Sandbox | Safe to use in development; no real data |

## Security best practices

- Store keys in environment variables or a secrets manager — never hard-code them
- Rotate keys regularly and immediately if one is compromised
- Use the least-privileged key that your integration requires
- Enable IP allowlisting in the dashboard for production keys

## Rate limits

Rate limit headers are returned on every response:

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 987
X-RateLimit-Reset: 1718400000
```

When you exceed the limit the API returns `429 Too Many Requests`. Implement exponential back-off with jitter before retrying.
