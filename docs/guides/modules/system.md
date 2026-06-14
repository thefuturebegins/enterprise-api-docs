# System

The System module is the operational backbone of the platform. It provides tenant resolution, file management, background job execution, multi-tenant database provisioning, settings management, record history, PDF generation, and the shared event bus used by other modules.

## What it covers

| Section | Description |
|---|---|
| **Tenant Resolution** | Resolve tenant context from subdomain, header, or API key |
| **Settings** | Per-account configuration key/value store |
| **Jobs** | Background job definitions, scheduling, and execution history |
| **Multi-Tenant Database** | Provision and manage per-tenant database schemas |
| **Record History** | Immutable audit log of all record changes |
| **File Management** | File upload, storage, and retrieval |
| **Export Job Execution** | Run export jobs triggered by the Integrations module |
| **Import Job Execution** | Run import jobs triggered by the Integrations module |
| **PDF Preview** | Generate PDF previews of records and documents |
| **Events** | Internal pub/sub event bus (shared singleton used by all modules) |
| **Record Summary** | AI-generated summaries of any record using the AI module |

## Authentication

All System endpoints require a valid session. Database provisioning and job management endpoints require `system:admin` permission.

## Core services

### Tenant Resolution

Resolves the active tenant account from the incoming request. Used internally by every authenticated request; also exposed for external tooling.

```http
GET /api/system/tenant-resolution/resolve
# Headers: X-Account-Key: acme-corp (or resolved from subdomain)

# Response:
{ "accountKey": "acme-corp", "databaseName": "origin_acme_corp" }
```

### Settings

Per-account key/value configuration. Used by AI (LLM API keys), Communications (SMTP config), and others:

```http
GET  /api/system/settings                          # list all settings for account
GET  /api/system/settings?filter[key]=openai.key   # get specific setting
POST /api/system/settings
{
  "key": "openai.key",
  "value": "sk-...",
  "isSecret": true
}
PUT  /api/system/settings/{id}
```

Secret settings have their `value` masked in list responses.

### Job Management

Background jobs are registered via `JobManagementService` and executed asynchronously:

```http
GET  /api/system/jobs                              # list job definitions
POST /api/system/jobs                              # register a new job type
GET  /api/system/job-histories                     # list execution records
GET  /api/system/job-histories?filter[status]=failed  # filter by status

# Job types
GET  /api/system/job-types
```

### Multi-Tenant Database

Provision a new tenant database or run migrations:

```http
POST /api/system/multi-tenant-database/provision
{
  "accountKey": "new-client",
  "plan": "enterprise"
}

POST /api/system/multi-tenant-database/migrate
{
  "accountKey": "new-client"
}
```

### Record History

Immutable audit trail — every create, update, and delete on any model is logged:

```http
GET /api/system/record-history
  ?filter[modelKey]=opportunities
  &filter[recordId]=<opp_id>
  &sort=-timestamp
```

Each history entry includes `operation`, `before`, `after`, `changedBy`, and `timestamp`.

### PDF Preview

Generate a PDF rendering of a record or document template. Routes are registered in `setup()` directly on the Express app:

```http
POST /api/system/pdf/preview
{
  "templateId": "<template_id>",
  "recordId": "<record_id>",
  "modelKey": "financeInvoices"
}
# Returns: PDF binary (Content-Type: application/pdf)
```

## Data models

| Model | Slug | Description |
|---|---|---|
| Jobs | `jobs` | Background job definitions |
| Job Types | `jobTypes` | Job type catalogue |
| Job Histories | `jobHistories` | Execution records with status and output |
| Settings | `settings` | Per-account key/value configuration |
| Multi-Tenant Database | `multiTenantDatabase` | Provisioned tenant database records |

## The event bus

`eventsService` is a singleton exported from this module and consumed by the Workflow, Notifications, and Scheduled Events services:

```ts
import { eventsService } from '@thefuturebegins/enterprise-module-system';

// Publish an event
eventsService.publish('contact.created', { contactId: '...' });

// Subscribe to events
eventsService.on('contact.created', async (payload) => {
  await notificationsService.send({ ... });
});
```

This is an in-process pub/sub bus — not a message queue. For durable event processing across restarts, use Scheduled Events (Workflow module).

## Common patterns

### Auditing changes to a record

```http
GET /api/system/record-history
  ?filter[recordId]=<contact_id>
  &filter[modelKey]=contacts
  &sort=-timestamp
  &limit=20
```

### Reading a secret setting

```http
GET /api/system/settings?filter[key]=stripe.secret_key
# value is masked unless you have system:admin permission
```
