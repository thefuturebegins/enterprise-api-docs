# Analytics

The Analytics module provides a configurable reporting engine for surfacing business metrics from any Enterprise data model. It supports categorised report libraries, saved report definitions, shareable report views, and a component allow-list for controlling which chart and table components are available in report builders.

## What it covers

| Section | Description |
|---|---|
| **Reporting** | Execute reports and return aggregated result sets |
| **Reports** | Saved report definitions (model, filters, grouping, chart type) |
| **Report Categories** | Organise reports into labelled groups (Sales, Finance, etc.) |
| **Report Shares** | Control which users or teams can access a saved report |
| **Components Allowed in Reports Selection** | Allowlist of UI components eligible for use in report builders |

## Authentication

All Analytics endpoints require a valid session. Report sharing endpoints additionally require the originating user to own or administer the report.

## Core service

`ReportingService` is the single service powering the entire module. It accepts a report definition (or a saved report ID) and executes an aggregation pipeline against the configured model.

## Core endpoints

### Running a report

```http
POST /api/analytics/reporting/run
Content-Type: application/json

{
  "modelKey": "opportunities",
  "filter": { "stage": { "$ne": "closed-lost" } },
  "groupBy": "stage",
  "aggregation": "count",
  "dateRange": {
    "field": "createdAt",
    "from": "2026-01-01",
    "to": "2026-06-30"
  }
}
```

**Response:**

```json
{
  "rows": [
    { "stage": "prospect", "count": 42 },
    { "stage": "proposal", "count": 18 },
    { "stage": "negotiation", "count": 7 }
  ],
  "total": 67,
  "generatedAt": "2026-06-14T12:00:00Z"
}
```

### Running a saved report

```http
POST /api/analytics/reporting/run
{ "reportId": "<saved_report_id>" }
```

## Data models

All Analytics models at `/api/analytics/{model}`:

| Model | Slug | Description |
|---|---|---|
| Reports | `reports` | Saved report definitions |
| Report Categories | `reportCategories` | Grouping labels for the report library |
| Report Shares | `reportShares` | User/team access grants for a report |
| Components Allowed in Reports Selection | `componentsAllowedInReportsSelection` | Allowlisted report UI components |

## Common patterns

### Creating and saving a report

```http
# 1. Create a category
POST /api/analytics/reportCategories
{ "name": "Sales Performance", "icon": "chart-line" }

# 2. Save the report definition
POST /api/analytics/reports
{
  "name": "Open Opportunities by Stage",
  "categoryId": "<category_id>",
  "modelKey": "opportunities",
  "filter": { "stage": { "$nin": ["closed-won", "closed-lost"] } },
  "groupBy": "stage",
  "aggregation": "count",
  "chartType": "bar"
}

# 3. Share with a team
POST /api/analytics/reportShares
{
  "reportId": "<report_id>",
  "teamId": "<sales_team_id>",
  "permission": "view"
}
```

### Fetching all reports in a category

```http
GET /api/analytics/reports?filter[categoryId]=<category_id>&sort=name
```
