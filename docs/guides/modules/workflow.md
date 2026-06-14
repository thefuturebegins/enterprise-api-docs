# Workflow

The Workflow module provides automation infrastructure for the platform — scheduled event execution, status pipeline management, and a rule-based workflow engine that can trigger cross-module actions based on record changes.

## What it covers

| Section | Description |
|---|---|
| **Scheduled Events** | Time-based event records that fire at a configured time |
| **Workflow Status Pipelines** | Named stage sequences for tracking record progress |
| **Workflow Status Pipeline Record States** | Current pipeline stage for individual records |

## Authentication

All Workflow endpoints require a valid session. Pipeline management endpoints require administrative permissions.

## Core services

### Scheduled Events

`ScheduledEventsService` persists scheduled event records and integrates with the platform-wide `eventsService` singleton (from the System module) to dispatch events at their scheduled time.

```http
# List upcoming scheduled events
GET /api/workflow/scheduledEvents?filter[status]=pending&sort=scheduledAt

# Create a scheduled event
POST /api/workflow/scheduledEvents
{
  "type": "follow-up-reminder",
  "payload": {
    "contactId": "<id>",
    "message": "Check in on proposal status"
  },
  "scheduledAt": "2026-06-20T09:00:00Z"
}

# Cancel a scheduled event
DELETE /api/workflow/scheduledEvents/{id}
```

### Workflow Status Pipelines

Define custom stage sequences for any model. Pipelines let you model progress through multi-step processes — deal stages, support ticket statuses, onboarding steps, etc.

```http
# Create a pipeline
POST /api/workflow/workflowStatusPipelines
{
  "name": "Opportunity Pipeline",
  "modelKey": "opportunities",
  "stages": [
    { "key": "prospect", "label": "Prospect", "order": 1 },
    { "key": "qualified", "label": "Qualified", "order": 2 },
    { "key": "proposal", "label": "Proposal Sent", "order": 3 },
    { "key": "negotiation", "label": "Negotiation", "order": 4 },
    { "key": "closed-won", "label": "Closed Won", "order": 5, "terminal": true },
    { "key": "closed-lost", "label": "Closed Lost", "order": 6, "terminal": true }
  ]
}

# List pipelines
GET /api/workflow/workflowStatusPipelines
```

### Record Pipeline States

Track an individual record's position within a pipeline:

```http
# Get the current pipeline state for a record
GET /api/workflow/workflowStatusPipelineRecordStates?filter[recordId]=<id>&filter[pipelineId]=<pipeline_id>

# Advance a record to the next stage
PUT /api/workflow/workflowStatusPipelineRecordStates/{state_id}
{
  "stage": "proposal",
  "movedAt": "2026-06-14T14:30:00Z",
  "movedByUserId": "<user_id>"
}
```

### Workflow Engine

The `WorkflowEngineService` is bootstrapped separately from the main module (via `workflow-engine/bootstrap.ts`) because it carries cross-module dependencies including `EmailSender` from Communications. It evaluates condition trees and executes actions (send email, create task, update record, fire notification) when triggered by record change events.

Workflow definitions are managed via the Marketing module's `workflows` and `workflowSteps` models, and enrolments via `workflowEnrollments`.

## Data models

| Model | Slug | Description |
|---|---|---|
| Scheduled Events | `scheduledEvents` | Time-triggered event records |
| Workflow Status Pipelines | `workflowStatusPipelines` | Named stage sequence definitions |
| Workflow Status Pipeline Record States | `workflowStatusPipelineRecordStates` | Per-record pipeline position |

## Common patterns

### Moving an opportunity through stages

```http
# 1. Find the state record
GET /api/workflow/workflowStatusPipelineRecordStates
  ?filter[recordId]=<opportunity_id>&filter[pipelineId]=<pipeline_id>

# 2. Advance the stage
PUT /api/workflow/workflowStatusPipelineRecordStates/<state_id>
{ "stage": "negotiation" }
```

### Scheduling a delayed follow-up

```http
POST /api/workflow/scheduledEvents
{
  "type": "lead-nurture-reminder",
  "payload": { "leadId": "<id>", "sequence": 3 },
  "scheduledAt": "2026-06-21T10:00:00Z"
}
```
