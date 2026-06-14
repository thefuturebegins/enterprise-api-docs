# Integrations

The Integrations module provides a unified data exchange layer — synchronising records between Enterprise and external systems (ERPs, CRMs, data warehouses), managing import/export pipelines, handling conflict resolution, and exposing a field-mapping engine that normalises data across vendor schemas.

## What it covers

| Section | Description |
|---|---|
| **Data Sync** | Bidirectional record synchronisation with external systems |
| **Sync Engine** | Low-level sync orchestration and scheduling |
| **Sync Vendors** | Registered third-party system connectors |
| **Sync Vendor Model Field Mappings** | Per-vendor field translation rules |
| **Synchronizations** | Individual sync job execution records |
| **Import Management** | Configure and trigger data imports |
| **Import Profiles** | Saved import configurations |
| **Import Schedules** | Recurring import schedules |
| **Import Field Mappings** | Column/field mapping for import files |
| **Export Management** | Configure and trigger data exports |
| **Export Profiles** | Saved export configurations |
| **Export Schedules** | Recurring export schedules |
| **Export Field Mappings** | Field selection and transformation for exports |
| **Field Mapping** | General field-mapping rules across models |
| **Conflict Resolution** | Rules for handling record conflicts during sync |

## Authentication

All Integrations endpoints require authentication. Sync and import/export management endpoints require the `integrations:write` permission.

## Core services

### Data Sync

`DataSyncService` manages bidirectional record synchronisation between Enterprise models and external system APIs. Each sync operation is tracked as a `synchronizations` record.

```http
# List configured sync connections
GET /api/integrations/synchronizations

# Trigger an on-demand sync
POST /api/integrations/data-sync/trigger
{
  "vendorId": "<sync_vendor_id>",
  "direction": "pull",
  "modelKey": "contacts"
}
```

### Sync Engine

`SyncEngineService` handles scheduling, retry logic, and rate-limit back-off for vendor sync operations.

```http
GET  /api/integrations/sync-engine/status
POST /api/integrations/sync-engine/pause
POST /api/integrations/sync-engine/resume
```

### Import Management

Configure and execute file-based imports (CSV, JSON, XLSX):

```http
# 1. Create an import profile
POST /api/integrations/importProfiles
{
  "name": "Salesforce contact export",
  "modelKey": "contacts",
  "format": "csv"
}

# 2. Create field mappings for the profile
POST /api/integrations/importFieldMappings
{
  "profileId": "<profile_id>",
  "sourceField": "Email Address",
  "targetField": "email"
}

# 3. Run the import
POST /api/integrations/import-management/run
{
  "profileId": "<profile_id>",
  "fileUrl": "https://storage.example.com/export.csv"
}
```

### Export Management

```http
# Create an export profile
POST /api/integrations/exportProfiles
{
  "name": "Weekly leads export",
  "modelKey": "leads",
  "format": "csv"
}

# Schedule a recurring export
POST /api/integrations/exportSchedules
{
  "profileId": "<profile_id>",
  "cron": "0 8 * * 1",
  "destination": "s3://bucket/exports/"
}

# Run on demand
POST /api/integrations/export-management/run
{ "profileId": "<profile_id>" }
```

### Conflict Resolution

When sync pulls a record that conflicts with local changes, `ConflictResolutionService` applies the configured strategy:

```http
GET  /api/integrations/conflict-resolution        # list pending conflicts
POST /api/integrations/conflict-resolution/resolve
{
  "conflictId": "<id>",
  "resolution": "keep_local"   # or "keep_remote" | "merge"
}
```

## Data models

| Model | Slug |
|---|---|
| Sync Vendors | `syncVendors` |
| Sync Vendor Model Field Mappings | `syncVendorModelFieldMappings` |
| Synchronizations | `synchronizations` |
| Import Profiles | `importProfiles` |
| Import Schedules | `importSchedules` |
| Import Field Mappings | `importFieldMappings` |
| Export Profiles | `exportProfiles` |
| Export Schedules | `exportSchedules` |
| Export Field Mappings | `exportFieldMappings` |

## Common patterns

### Setting up a Salesforce sync

```http
# 1. Register the vendor
POST /api/integrations/syncVendors
{
  "name": "Salesforce",
  "type": "salesforce",
  "credentials": { "instanceUrl": "https://myorg.salesforce.com", "token": "••••" }
}

# 2. Map Salesforce Contact → Enterprise contact fields
POST /api/integrations/syncVendorModelFieldMappings
{
  "vendorId": "<vendor_id>",
  "vendorModel": "Contact",
  "enterpriseModel": "contacts",
  "mappings": [
    { "vendorField": "Email", "enterpriseField": "email" },
    { "vendorField": "FirstName", "enterpriseField": "firstName" },
    { "vendorField": "LastName", "enterpriseField": "lastName" }
  ]
}

# 3. Trigger initial pull
POST /api/integrations/data-sync/trigger
{ "vendorId": "<vendor_id>", "direction": "pull", "modelKey": "contacts" }
```
