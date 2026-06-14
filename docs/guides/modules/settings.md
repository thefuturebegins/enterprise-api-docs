# Settings

The Settings module stores per-account configuration for platform behaviour — notification preferences, security policies, and feature-scoping rules. Settings are key/value pairs resolved at runtime by modules that need tenant-specific configuration.

> **Note:** The Settings module's service layer is in active development. The endpoints below reflect the current auto-CRUD surface. For reading and writing settings programmatically today, the System module's `settings` model is the primary interface.

## Authentication

All Settings endpoints require a valid session. Security-related settings require `system:admin` permission.

## Data models

All Settings models at `/api/settings/{model}`:

```http
GET    /api/settings/{model}
POST   /api/settings/{model}
GET    /api/settings/{model}/{id}
PUT    /api/settings/{model}/{id}
DELETE /api/settings/{model}/{id}
```

Use `GET /api/data/models?filter[moduleKey]=settings` for the full current model list.

## Settings vs System settings

Two settings surfaces exist:

| Surface | Path | Use case |
|---|---|---|
| **System settings** | `/api/system/settings` | General key/value config (API keys, SMTP, etc.) — managed by the System module |
| **Settings models** | `/api/settings/{model}` | Structured configuration records (notification rules, security policies, scope definitions) — managed by this module |

## Common patterns

### Reading notification settings

```http
GET /api/settings/notificationSettings?filter[accountKey]=acme-corp
```

### Updating a security setting

```http
PUT /api/settings/securitySettings/<id>
{
  "mfaRequired": true,
  "sessionTimeoutMinutes": 60,
  "allowedIpRanges": ["10.0.0.0/8"]
}
```
