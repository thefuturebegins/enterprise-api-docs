# Customer Success

The Customer Success module manages post-sale customer relationships — tracking renewals, health scores, success plans, and escalation records to help customer success teams retain and grow accounts.

> **Note:** The Customer Success module's service layer is in active development. The endpoints listed here reflect the current model-level CRUD surface available through the Data module's auto-CRUD system.

## Authentication

All Customer Success endpoints require a valid session.

## Data models

All Customer Success models at `/api/customerSuccess/{model}`:

```http
GET    /api/customerSuccess/{model}           # list
POST   /api/customerSuccess/{model}           # create
GET    /api/customerSuccess/{model}/{id}       # get by ID
PUT    /api/customerSuccess/{model}/{id}       # update
DELETE /api/customerSuccess/{model}/{id}       # delete
```

The available models include renewal tracking, customer health records, success plans, and escalation logs. Use `GET /api/data/models?filter[moduleKey]=customerSuccess` to retrieve the full current model list with field definitions.

## Common patterns

### Listing all models in this module

```http
GET /api/data/models?filter[moduleKey]=customerSuccess
```

### Querying records with filtering

```http
GET /api/customerSuccess/{model}?filter[status]=active&sort=-createdAt&limit=50
```
