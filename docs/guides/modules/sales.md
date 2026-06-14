# Sales

The Sales module is the primary CRM surface of the Enterprise platform. It manages the complete revenue lifecycle — from initial lead capture through opportunity management, quoting, and order fulfilment — and provides the data models and business-logic services that sales teams interact with every day.

## What it covers

| Section | Description |
|---|---|
| **Contacts** | Individual people: contact details, status, files, notes, and tasks |
| **Accounts** | Companies or organisations: types, sources, statuses, ownerships, and linked products |
| **Leads** | Unqualified inbound prospects before conversion |
| **Opportunities** | Qualified deals with a pipeline stage, products, and close probability |
| **Quotes & Orders** | Formal commercial proposals and confirmed purchase orders |
| **Products** | Product catalogue with statuses, files, notes, and task tracking |
| **Organizations** | External company intelligence: board meetings, news, contacts, and org types |
| **Insights & Filters** | Saved data-analysis views and reusable filter sets |
| **Campaigns** | Sales-side campaign tracking (distinct from Marketing campaigns) |
| **Tasks & Notes** | Cross-record activity log |
| **Google Business Profiles** | Linked GBP data for account enrichment |
| **LinkedIn Profiles** | Linked LinkedIn identity data for contacts and accounts |

## Authentication

All Sales endpoints require a valid session. Include either:

```http
Authorization: Bearer <access_token>
```

or the `enterprise_access` HttpOnly cookie set by the Identity module on login.

## Core services

### Account Management

Handles enterprise account (tenant) lifecycle — provisioning, suspension, trial management, and feature flags. This is distinct from the `accounts` CRUD model; it manages the tenancy layer.

```http
POST /api/sales/account-management/provision
POST /api/sales/account-management/suspend
POST /api/sales/account-management/reactivate
POST /api/sales/account-management/validate-key
```

### Lead Management & Nurturing

`LeadManagementService` handles lead intake, scoring, and routing. `LeadNurturingService` manages time-based follow-up sequences and re-engagement logic.

```http
GET  /api/sales/leads
POST /api/sales/leads
GET  /api/sales/leads/{id}
PUT  /api/sales/leads/{id}
```

### Workspace Management

Controls per-account workspace configuration — the visible modules, default views, and user preferences scoped to a sales workspace.

## Data models

All Sales models support the standard CRUD envelope:

```http
GET    /api/sales/{model}           # list (supports ?filter, ?sort, ?page)
POST   /api/sales/{model}           # create
GET    /api/sales/{model}/{id}       # get by id
PUT    /api/sales/{model}/{id}       # full update
DELETE /api/sales/{model}/{id}       # delete
```

Key models and their slugs:

| Model | Slug | Notes |
|---|---|---|
| Contacts | `contacts` | People records; link to accounts |
| Accounts | `accounts` | Company/org records |
| Leads | `leads` | Pre-qualified prospects |
| Opportunities | `opportunities` | Open deals |
| Quotes | `quotes` | Formal proposals |
| Orders | `orders` | Confirmed purchases |
| Products | `products` | Product catalogue |
| Organizations | `organizations` | External company intelligence |
| Insights | `insights` | Saved analysis views |
| Tasks | `tasks` | Activity records |
| Notes | `notes` | Freeform notes |
| Regions | `regions` | Geographic territory definitions |
| Sales Targets | `salesTargets` | Revenue quota records |
| Industries | `industries` | Industry taxonomy |

## Common patterns

### Listing contacts with a filter

```http
GET /api/sales/contacts?filter[status]=active&sort=-createdAt&page=1&limit=25
```

### Creating an opportunity

```http
POST /api/sales/opportunities
Content-Type: application/json

{
  "name": "Acme Corp — Enterprise Licence",
  "accountId": "<account_id>",
  "contactId": "<contact_id>",
  "value": 48000,
  "stage": "proposal",
  "closeDate": "2026-09-30"
}
```

### Attaching a note to a record

Notes, files, and tasks follow a consistent sub-resource pattern:

```http
POST /api/sales/contactNotes
{ "contactId": "<id>", "content": "Spoke with procurement — budget approved." }
```
