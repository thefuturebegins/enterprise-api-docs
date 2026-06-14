# Authentication

The Enterprise API uses **Bearer token (JWT) authentication**. Your token identifies both you and your account — there is no account-specific subdomain or URL to configure. All API requests go to a single endpoint:

```
https://api.enterprisecrm.com
```

The API resolves your account automatically from your token on every request.

## Obtaining a token

Tokens are issued by the `identity/authentication` module. Log in with your credentials:

```bash
curl -X POST "https://api.enterprisecrm.com/api/identity/auth/login" \
  -H "Content-Type: application/json" \
  -d '{ "email": "you@yourcompany.com", "password": "your-password" }'
```

The response includes an access token:

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600
}
```

## Testing the API in this documentation

Scalar's **Try it** panel lets you authenticate once and test any endpoint live against `https://api.enterprisecrm.com`.

### Step 1 — Open the Authorize panel

Navigate to any module in the **API Reference** tab. Click the **Authorize** button in the top-right corner of the page.

### Step 2 — Enter your Bearer token

In the dialog that appears, paste your access token into the **Bearer** field — just the token string itself, without the `Bearer ` prefix. Click **Save**.

### Step 3 — Send a request

Open any endpoint, click **Try it**, fill in any required parameters, and click **Send**. Your token is automatically added as:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

The request goes directly to `https://api.enterprisecrm.com`. Responses appear inline — status codes, headers, and body.

## How multi-tenancy works

The Enterprise platform serves multiple accounts from a single API endpoint. You do **not** need a different URL per account. Your JWT encodes your account identity, and the API routes your request to the correct tenant automatically.

This means:
- One API URL for all customers: `https://api.enterprisecrm.com`
- One token = one account context, resolved server-side
- No subdomain configuration required in your HTTP client or API docs

## Sending requests in your own code

### curl

```bash
curl -X GET "https://api.enterprisecrm.com/api/sales/contacts" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### JavaScript (fetch)

```js
const response = await fetch('https://api.enterprisecrm.com/api/sales/contacts', {
  headers: {
    Authorization: `Bearer ${accessToken}`,
    Accept: 'application/json',
  },
})
const data = await response.json()
```

### Python (httpx)

```python
import httpx

client = httpx.Client(
    base_url="https://api.enterprisecrm.com",
    headers={"Authorization": f"Bearer {access_token}"}
)
contacts = client.get("/api/sales/contacts").json()
```

## Token expiry and refresh

Access tokens expire after 1 hour. When your token expires, re-authenticate via the login endpoint to get a new one. If a request returns `401 Unauthorized`, your token has likely expired.

## Rate limits

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 987
X-RateLimit-Reset: 1718400000
```

`429 Too Many Requests` is returned when the limit is exceeded. Use exponential back-off with jitter before retrying.
