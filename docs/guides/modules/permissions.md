# Permissions

The Permissions module provides the authorisation layer for the platform. It evaluates whether a user has the required permission to perform an action, based on their assigned roles and any explicit grants.

## What it covers

| Section | Description |
|---|---|
| **Authorization** | Check and enforce permission rules |

## Authentication

All Permissions endpoints require a valid session.

## Core service

`AuthorizationService` is the single service in this module. It exposes three endpoints for checking and managing access.

## Endpoints

### Check permission

Verify whether the current user holds a given permission:

```http
POST /api/permissions/authorization/check
Content-Type: application/json

{
  "permission": "finance:write",
  "resourceId": "<optional_resource_id>"
}
```

**Response:**

```json
{ "allowed": true }
```

A `403 Forbidden` response is returned if the permission check fails and the endpoint is configured to enforce (rather than just report).

### Grant a permission to a role

```http
POST /api/permissions/authorization/grant
{
  "roleId": "<role_id>",
  "permission": "integrations:write"
}
```

### Revoke a permission from a role

```http
DELETE /api/permissions/authorization/grant
{
  "roleId": "<role_id>",
  "permission": "integrations:write"
}
```

## Permission naming convention

Permissions follow a `{module}:{action}` format:

| Permission | Who needs it |
|---|---|
| `finance:write` | Billing administrators |
| `integrations:write` | Integration managers |
| `cache:write` | System administrators |
| `system:admin` | Platform administrators |
| `marketing:write` | Marketing team members |
| `ai:use` | Users allowed to invoke AI features |

Role assignments are managed via the Identity module (`roles`, `teamUsers`, `departmentUsers`). The Permissions module evaluates the accumulated permissions from all roles assigned to a user.

## Common patterns

### Guard a custom action in a client

```ts
const { allowed } = await fetch('/api/permissions/authorization/check', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({ permission: 'finance:write' })
}).then(r => r.json());

if (!allowed) {
  showAccessDeniedMessage();
  return;
}

// Proceed with the finance action
```
