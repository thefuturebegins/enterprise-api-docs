# Data

The Data module is the foundation of the Enterprise platform. It owns the model registry — the source of truth for every data structure in the system — and automatically exposes CRUD endpoints for all 192+ registered models. It also provides avatar generation, image preview, a generic query API, and real-time change streaming via Server-Sent Events.

## What it covers

| Section | Description |
|---|---|
| **Models** | Registry of all data models (schema definitions) |
| **Model Fields** | Field definitions for each model |
| **Model Layouts** | View layout configurations per model |
| **Field Types** | Supported field type catalogue |
| **Navigation Items** | Module navigation structure |
| **Query** | Generic cross-model query endpoint |
| **Avatar** | AI-generated avatar images for records |
| **Preview Image** | Generate preview images for file attachments |
| **Features** | Registered platform feature flags |
| **Icons** | Icon library metadata |
| **Data Service** | Health, datasource info, and live model reload |

## How auto-CRUD works

Every model registered in the `models` collection automatically receives six REST endpoints at the path `/{moduleKey}/{modelKey}`:

```
GET    /api/{moduleKey}/{modelKey}           list (paginated, filterable)
POST   /api/{moduleKey}/{modelKey}           create
GET    /api/{moduleKey}/{modelKey}/{id}       get by ID
PUT    /api/{moduleKey}/{modelKey}/{id}       full update
PATCH  /api/{moduleKey}/{modelKey}/{id}       partial update
DELETE /api/{moduleKey}/{modelKey}/{id}       delete
```

For example, the `contacts` model (owned by the `sales` module) is served at `/api/sales/contacts`. The `data` module itself handles the routing — the owning module only needs to declare the model.

## Authentication

All Data endpoints require a valid session.

## Core endpoints

### Health and status

```http
GET /api/data/health       # returns { status: "ok" }
GET /api/data/datasources  # lists active database connections
GET /api/data/routes/info  # lists all registered CRUD routes
```

### Model registry

```http
GET  /api/data/models              # list all registered models
POST /api/data/models/reload       # hot-reload model definitions from the database
```

The reload endpoint is useful after adding or modifying model definitions without restarting the server.

### Generic query API

Run a structured query across any model:

```http
POST /api/data/query
Content-Type: application/json

{
  "model": "contacts",
  "filter": { "status": "active" },
  "sort": { "createdAt": -1 },
  "page": 1,
  "limit": 50,
  "fields": ["firstName", "lastName", "email", "accountId"]
}
```

### Avatar generation

Generate an AI avatar image for a record (e.g. a contact without a profile photo):

```http
POST /api/data/avatar/generate
{
  "name": "Jane Smith",
  "size": 256
}
```

Returns a `{ url: "..." }` pointing to the generated image.

### Preview images

Generate a preview thumbnail for a stored file:

```http
POST /api/data/preview/generate
{
  "fileId": "<file_id>",
  "width": 400,
  "height": 300
}
```

## Data models (system)

These models are managed by the Data module itself (served at `/api/data/{model}`):

| Model | Slug | Description |
|---|---|---|
| Models | `models` | Model schema definitions |
| Model Fields | `modelFields` | Field definitions per model |
| Model Layouts | `modelLayouts` | UI layout configs per model |
| Model Files | `modelFiles` | Files attached to model records |
| Model Notes | `modelNotes` | Notes on model records |
| Model Tasks | `modelTasks` | Tasks linked to model records |
| Field Types | `fieldTypes` | Supported field type catalogue |
| Navigation Items | `navigationItems` | Navigation structure definitions |
| Features | `features` | Platform feature flags |
| Icons | `icons` | Icon library entries |

## Database architecture

The Data module connects to **two MongoDB databases**:

| Database | Purpose | Env var |
|---|---|---|
| **Core** | Static/system data (field types, industries, global settings) | `MONGODB_DATABASE_NAME` |
| **Origin** (tenant) | All tenant model data | `MONGODB_ACCOUNT_DATABASE_NAME` |

All CRUD routes operate on the tenant (Origin) database. Core data is read-only via the system.

## Real-time streaming

The `StreamService` registers SSE endpoints for live record change events. Connect to receive real-time updates as records are created, updated, or deleted:

```http
GET /api/data/stream?models=contacts,accounts
Accept: text/event-stream
```

Each SSE event contains the operation type (`insert`, `update`, `delete`) and the affected record.

## Projection queries

For complex reporting and aggregated views, projection endpoints are registered per model:

```http
GET  /api/{moduleKey}/{projectionKey}
POST /api/{moduleKey}/{projectionKey}/query
GET  /api/{moduleKey}/{projectionKey}/{id}
```

Projections are defined in model configuration and can combine data from multiple collections.
