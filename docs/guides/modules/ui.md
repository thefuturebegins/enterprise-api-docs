# UI

The UI module manages the application shell — screens, workspaces, dashboards, and reusable components. It controls what each user sees, tracks recently viewed records, and provides the support ticket and product announcement systems that surface inside the application.

## What it covers

| Section | Description |
|---|---|
| **Screens** | Configurable application views (list, detail, form, dashboard) |
| **User Screens** | Per-user screen assignments and preferences |
| **Workspaces** | Named collections of screens and settings for a team or role |
| **Components** | Registered reusable UI components |
| **Dashboards** | Widget-based summary views |
| **Record Recent Views** | Per-user recently accessed record history |
| **Screen Actions** | Custom action buttons registered to screens |
| **Support Tickets** | In-app support request management |
| **Product Announcements** | In-app product update and announcement records |
| **Drafts** | Auto-saved draft state for in-progress form edits |
| **Settings** | UI-level configuration (theme, density, language) |

## Authentication

All UI endpoints require a valid session. Screen and workspace management endpoints require administrative permissions.

## Core services

### Screens

Screens are the primary configurable view unit. `ScreensService` resolves the screen definition (model, fields, layout, filters) for rendering, using `UIDataProvider` to abstract the underlying `DataClient`.

```http
GET  /api/ui/screens                    # list all screens
POST /api/ui/screens                    # create a new screen
GET  /api/ui/screens/{id}               # get a screen definition
PUT  /api/ui/screens/{id}               # update screen configuration
```

A screen definition includes:
- `modelKey` — the data model being displayed
- `layout` — list, detail, kanban, calendar, etc.
- `columns` — visible fields and their order
- `defaultFilter` — pre-applied filter expression
- `actions` — registered action buttons

### User Screens

`UserScreensService` controls which screens are visible to a given user and in what order:

```http
GET  /api/ui/user-screens               # screens assigned to current user
POST /api/ui/user-screens               # assign screen to user
PUT  /api/ui/user-screens/{id}          # update position or visibility
```

### Workspaces

Workspaces group screens and settings into a named environment (e.g. "Sales Rep", "Finance Admin"):

```http
GET  /api/ui/workspaces
POST /api/ui/workspaces
{
  "name": "Sales Rep",
  "screenIds": ["<id1>", "<id2>"],
  "defaultScreenId": "<id1>"
}
```

### Dashboards

Dashboards combine multiple widget types (charts, KPI tiles, record lists) into a single view:

```http
GET  /api/ui/dashboards
POST /api/ui/dashboards
{
  "name": "Sales Overview",
  "widgets": [
    { "type": "kpi", "metric": "openOpportunities", "period": "month" },
    { "type": "chart", "chartType": "bar", "model": "leads", "groupBy": "source" }
  ]
}
```

### Record Recent Views

Tracks the last N records a user has accessed for quick navigation:

```http
GET  /api/ui/record-recent-views            # get current user's history
POST /api/ui/record-recent-views            # record a view event
{
  "modelKey": "contacts",
  "recordId": "<contact_id>"
}
```

### Support Tickets

In-app support request system:

```http
GET  /api/ui/supportTickets
POST /api/ui/supportTickets
{
  "subject": "Cannot export to CSV",
  "description": "The export button shows a spinner but never completes.",
  "priority": "high"
}
```

## Data models

All UI models at `/api/ui/{model}`:

| Model | Slug |
|---|---|
| Screens | `screens` |
| Screen Statuses | `screenStatuses` |
| Screen Actions | `screenActions` |
| Screen Components | `screenComponents` |
| Screen Files | `screenFiles` |
| Screen Notes | `screenNotes` |
| Screen Tasks | `screenTasks` |
| User Screens | `userScreens` |
| Workspaces | `workspaces` |
| Components | `components` |
| Registered Components | `registeredComponents` |
| Dashboards | `dashboards` |
| Drafts | `drafts` |
| Record Recent Views | `recordRecentViews` |
| Support Tickets | `supportTickets` |
| Support Ticket Files | `supportTicketFiles` |
| Support Ticket Notes | `supportTicketNotes` |
| Support Ticket Resolutions | `supportTicketResolutions` |
| Support Ticket Tasks | `supportTicketTasks` |
| Enterprise Product Announcements | `enterpriseProductAnnouncements` |
| Enterprise Product Announcement Files | `enterpriseProductAnnouncementFiles` |
| Enterprise Product Announcement Notes | `enterpriseProductAnnouncementNotes` |
| Enterprise Product Announcement Tasks | `enterpriseProductAnnouncementTasks` |
| Settings | `settings` |

## Common patterns

### Setting up a screen for a model

```http
# 1. Create the screen
POST /api/ui/screens
{
  "name": "Active Contacts",
  "modelKey": "contacts",
  "layout": "list",
  "columns": ["firstName", "lastName", "email", "status", "accountId"],
  "defaultFilter": { "status": "active" },
  "defaultSort": { "lastName": 1 }
}

# 2. Assign it to a workspace
PUT /api/ui/workspaces/<workspace_id>
{ "screenIds": ["<existing_ids>", "<new_screen_id>"] }
```

### Tracking a record view

```http
POST /api/ui/record-recent-views
{ "modelKey": "opportunities", "recordId": "<opp_id>" }
```

<!-- api-sections-start -->
## API sections

These sections are available in the **Ui API Reference**:

- [Components](/api/ui)
- [Dashboards](/api/ui)
- [Drafts](/api/ui)
- [Enterprise Product Announcement Files](/api/ui)
- [Enterprise Product Announcement Notes](/api/ui)
- [Enterprise Product Announcement Tasks](/api/ui)
- [Enterprise Product Announcements](/api/ui)
- [Record Recent Views](/api/ui)
- [Registered Components](/api/ui)
- [Screen Actions](/api/ui)
- [Screen Components](/api/ui)
- [Screen Files](/api/ui)
- [Screen Notes](/api/ui)
- [Screen Statuses](/api/ui)
- [Screen Tasks](/api/ui)
- [Screens](/api/ui)
- [Settings](/api/ui)
- [Support Ticket Files](/api/ui)
- [Support Ticket Notes](/api/ui)
- [Support Ticket Resolutions](/api/ui)
- [Support Ticket Tasks](/api/ui)
- [Support Tickets](/api/ui)
- [User Screens](/api/ui)
- [Workspaces](/api/ui)
<!-- api-sections-end -->
