# Getting Started

This guide walks you through making your first request to the Enterprise API.

## Prerequisites

- An API key (see [Authentication](./authentication.md))
- `curl`, an HTTP client like [Scalar API Client](https://scalar.com), or your language's HTTP library

## Base URL

```
https://api.enterprise.internal
```

All endpoints use the `/api` prefix. For example:

```
GET https://api.enterprise.internal/api/analytics/reporting/by-category/{category}
```

## Your first request

### 1. Get a report by category

```bash
curl -X GET "https://api.enterprise.internal/api/analytics/reporting/by-category/sales" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Accept: application/json"
```

### 2. List cache entries

```bash
curl -X GET "https://api.enterprise.internal/api/cache/cache" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### 3. Send a notification

```bash
curl -X POST "https://api.enterprise.internal/api/notifications/send-notification" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "recipient": "user@example.com", "message": "Hello" }'
```

## Response format

All responses return JSON. Successful responses use `2xx` status codes. Errors follow a standard shape:

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "The requested resource does not exist."
  }
}
```

## Explore interactively

Use the **[API Reference](/api)** tab to browse all endpoints, read parameter docs, and send live test requests directly from the browser — no separate client needed.
