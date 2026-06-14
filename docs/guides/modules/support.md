# Support

The Support module manages support documentation — articles, FAQs, and knowledge base content that can be surfaced to users within the application or via external help portals.

> **Note:** The Support module's service layer is in active development. The endpoints below reflect the current auto-CRUD surface. In-app support ticket management is handled by the UI module (`/api/ui/supportTickets`).

## Authentication

All Support endpoints require a valid session.

## Data models

All Support models at `/api/support/{model}`:

```http
GET    /api/support/{model}
POST   /api/support/{model}
GET    /api/support/{model}/{id}
PUT    /api/support/{model}/{id}
DELETE /api/support/{model}/{id}
```

Use `GET /api/data/models?filter[moduleKey]=support` for the full current model list.

## In-app support tickets

For creating and managing support tickets submitted by users from within the application, use the UI module:

```http
GET  /api/ui/supportTickets
POST /api/ui/supportTickets
{
  "subject": "Data export not completing",
  "description": "The CSV export spinner runs indefinitely.",
  "priority": "high"
}
```

Ticket resolution and notes are also managed via the UI module at `/api/ui/supportTicketResolutions` and `/api/ui/supportTicketNotes`.
