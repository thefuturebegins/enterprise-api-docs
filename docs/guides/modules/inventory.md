# Inventory

The Inventory module tracks physical assets — equipment, stock, and storage locations — for organisations that manage tangible goods alongside their CRM and financial records.

> **Note:** The Inventory module's service layer is in active development. The endpoints below reflect the current auto-CRUD surface.

## Authentication

All Inventory endpoints require a valid session.

## Data models

All Inventory models at `/api/inventory/{model}`:

```http
GET    /api/inventory/{model}
POST   /api/inventory/{model}
GET    /api/inventory/{model}/{id}
PUT    /api/inventory/{model}/{id}
DELETE /api/inventory/{model}/{id}
```

Use `GET /api/data/models?filter[moduleKey]=inventory` for the full current model list with field definitions.

## Common patterns

### Listing all inventory locations

```http
GET /api/inventory/inventoryLocations
```

### Creating an equipment record

```http
POST /api/inventory/equipment
{
  "name": "Dell Latitude 5530",
  "serialNumber": "CN-0ABCDE-12345",
  "locationId": "<location_id>",
  "assignedUserId": "<user_id>",
  "purchaseDate": "2025-03-15",
  "status": "in-use"
}
```
