# Notifications

The Notifications module handles delivery and scheduling of in-app and push notifications. It supports immediate sends, future-scheduled dispatches, and a persistent notification inbox per user.

## What it covers

| Section | Description |
|---|---|
| **Send Notification** | Dispatch a notification immediately to one or more users |
| **Notification Scheduling** | Queue a notification for future delivery |
| **Notifications** | Persistent notification records (the user inbox) |

## Authentication

All Notifications endpoints require a valid session.

## Core services

### Send Notification

`SendNotificationService` dispatches notifications immediately and writes a record to the `notifications` model for each recipient:

```http
POST /api/notifications/send-notification/send
Content-Type: application/json

{
  "userId": "<user_id>",
  "title": "New opportunity assigned to you",
  "body": "Acme Corp — Enterprise Licence has been assigned to your pipeline.",
  "type": "opportunity",
  "referenceId": "<opportunity_id>",
  "referenceModel": "opportunities"
}
```

To send to multiple users at once, pass an array:

```http
POST /api/notifications/send-notification/send
{
  "userIds": ["<user_id_1>", "<user_id_2>"],
  "title": "Team meeting in 30 minutes",
  "body": "Join the standup at 9:00 AM.",
  "type": "reminder"
}
```

### Notification Scheduling

`NotificationSchedulingService` queues notifications for future delivery. The scheduler integrates with the platform event system for reliable dispatch.

```http
POST /api/notifications/notification-scheduling/schedule
{
  "userId": "<user_id>",
  "title": "Follow up with Acme Corp",
  "body": "It has been 7 days since your last contact.",
  "type": "follow-up",
  "sendAt": "2026-06-21T09:00:00Z",
  "referenceId": "<contact_id>",
  "referenceModel": "contacts"
}
```

Cancel a scheduled notification:

```http
DELETE /api/notifications/notification-scheduling/{scheduleId}
```

## Data models

All Notifications models at `/api/notifications/{model}`:

| Model | Slug | Description |
|---|---|---|
| Notifications | `notifications` | Persistent per-user notification inbox |

Each notification record includes:

| Field | Description |
|---|---|
| `userId` | The recipient |
| `title` | Short notification heading |
| `body` | Full notification text |
| `type` | Category (e.g. `opportunity`, `reminder`, `system`) |
| `referenceId` | ID of the related record |
| `referenceModel` | Model key of the related record |
| `readAt` | Timestamp when the user acknowledged the notification |
| `createdAt` | When the notification was created |

## Common patterns

### Fetching unread notifications for the current user

```http
GET /api/notifications/notifications?filter[userId]=<user_id>&filter[readAt][$exists]=false&sort=-createdAt
```

### Marking a notification as read

```http
PUT /api/notifications/notifications/<notification_id>
{ "readAt": "2026-06-14T10:30:00Z" }
```

### Sending a task-due reminder

```http
POST /api/notifications/notification-scheduling/schedule
{
  "userId": "<assigned_user_id>",
  "title": "Task due today: Call Acme Corp",
  "body": "Your task 'Follow-up call with procurement' is due today.",
  "type": "task",
  "sendAt": "2026-06-14T08:00:00Z",
  "referenceId": "<task_id>",
  "referenceModel": "tasks"
}
```

<!-- api-sections-start -->
## API sections

These sections are available in the **Notifications API Reference**:

- [Notification Scheduling](/api/notifications)
- [Notifications](/api/notifications)
- [Send Notification](/api/notifications)
<!-- api-sections-end -->
