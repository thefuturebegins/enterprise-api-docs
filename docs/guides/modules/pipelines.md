# Pipelines

The Pipelines module provides pipeline orchestration infrastructure — defining, scheduling, and monitoring data processing pipelines that coordinate work across multiple modules. The module is in active development; the endpoint surface will expand in upcoming releases.

## What it covers

| Section | Description |
|---|---|
| **Pipelines** | Define and manage data processing pipeline configurations |

## Authentication

All Pipelines endpoints require a valid session with `system:admin` permission.

## Current endpoints

```http
GET  /api/pipelines/pipelines           # list pipeline definitions
POST /api/pipelines/pipelines           # create a pipeline definition
GET  /api/pipelines/pipelines/{id}      # get a pipeline
PUT  /api/pipelines/pipelines/{id}      # update a pipeline
DELETE /api/pipelines/pipelines/{id}    # delete a pipeline
```

## Planned capabilities

The Pipelines module is designed to handle:

- **ETL pipelines** — extract data from one model, transform it, and load into another
- **Cross-module orchestration** — coordinate sequences of actions across the Integrations, System, and Data modules
- **Scheduled batch processing** — run pipelines on a cron schedule using the Workflow module's `ScheduledEvents`
- **Pipeline monitoring** — execution logs, error reporting, and retry handling via System `JobHistories`

For time-based triggers today, use the Workflow module's `scheduledEvents`. For data import/export pipelines, use the Integrations module.
