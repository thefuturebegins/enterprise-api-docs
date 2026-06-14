# Forms

The Forms module manages form definitions and their field configurations, enabling the platform to render dynamic data-entry forms tied to any Enterprise model.

> **Note:** The Forms module's service layer is in active development. The endpoints below reflect the current auto-CRUD surface.

## Authentication

All Forms endpoints require a valid session.

## Data models

All Forms models at `/api/forms/{model}`:

```http
GET    /api/forms/{model}
POST   /api/forms/{model}
GET    /api/forms/{model}/{id}
PUT    /api/forms/{model}/{id}
DELETE /api/forms/{model}/{id}
```

Use `GET /api/data/models?filter[moduleKey]=forms` to retrieve the full current model list.

## Common patterns

### Fetching all form definitions

```http
GET /api/forms/forms
```

### Creating a form definition

```http
POST /api/forms/forms
{
  "name": "New Contact Intake",
  "modelKey": "contacts",
  "fields": ["firstName", "lastName", "email", "phone", "accountId"],
  "submitAction": "create"
}
```

<!-- api-sections-start -->
## API sections

This module's service layer is in active development. Use the [Data module](/api/data) model registry to explore its current models:

- [Browse Forms models via the Query API](/api/data)
<!-- api-sections-end -->
