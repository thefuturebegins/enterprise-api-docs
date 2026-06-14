# Communications

The Communications module handles all outbound and inbound messaging for the platform — transactional email, bulk campaigns, email scheduling, Gmail account synchronisation, file uploads, and conversation threading.

## What it covers

| Section | Description |
|---|---|
| **Send Email** | Single transactional email delivery |
| **Bulk Email** | High-volume batch sends |
| **Campaign Email** | Branded email sends tied to a marketing campaign |
| **Email Scheduling** | Queue emails for future delivery |
| **Email Analytics** | Open rates, click rates, and delivery stats |
| **Email Snapshots** | Point-in-time audience captures for email lists |
| **Email Templates** | Reusable HTML/text email templates |
| **Email Lists** | Mailing list management |
| **Conversations** | Threaded message conversations (inbox model) |
| **Comments** | In-thread comments on conversation records |
| **Gmail Connection** | Connect and disconnect Gmail accounts via OAuth |
| **Gmail Send** | Send emails through a connected Gmail account |
| **Gmail Sync** | Bidirectional sync of Gmail messages to conversation records |
| **File Upload** | Attach files to communication records |
| **Referrals** | Referral tracking and management |
| **Campaigns** | Communications-side campaign records |

## Authentication

All endpoints require a valid session. Gmail OAuth endpoints additionally require the user to have a Gmail connection configured.

## Core services

### Send Email

```http
POST /api/communications/send-email
Content-Type: application/json

{
  "to": "recipient@example.com",
  "subject": "Your order is confirmed",
  "html": "<h1>Thank you for your order</h1>",
  "from": "noreply@enterprise.internal"
}
```

### Bulk Email

For sending the same message to a large list. The service batches internally to respect provider rate limits.

```http
POST /api/communications/bulk-email/send
{
  "recipients": ["a@example.com", "b@example.com"],
  "subject": "Platform update — June 2026",
  "templateId": "<template_id>"
}
```

### Email Scheduling

Queue an email for future delivery. Uses the `EmailSchedulingService` to persist schedules and dispatch via the events system.

```http
POST /api/communications/email-scheduling/schedule
{
  "to": "user@example.com",
  "subject": "Your trial ends in 3 days",
  "templateId": "<template_id>",
  "sendAt": "2026-06-17T09:00:00Z"
}
```

### Gmail Integration

Connect a Gmail account using OAuth, then send and sync emails through it:

```http
# 1. Initiate Gmail OAuth
GET /api/communications/gmail-connection/connect

# 2. Check connection status
GET /api/communications/gmail-connection

# 3. Send via Gmail
POST /api/communications/gmail-send
{
  "connectionId": "<gmail_connection_id>",
  "to": "client@external.com",
  "subject": "Following up",
  "body": "Hi, just checking in on the proposal..."
}

# 4. Trigger inbox sync
POST /api/communications/gmail-sync/sync
{ "connectionId": "<gmail_connection_id>" }
```

Gmail sync writes incoming messages directly to `conversations` and `emails` records.

### Campaign Email

Sends a campaign-branded email and records delivery stats back to the campaign:

```http
POST /api/communications/campaign-email/send
{
  "campaignId": "<campaign_id>",
  "to": "contact@example.com",
  "subject": "Summer launch preview",
  "templateId": "<template_id>"
}
```

## Data models

All models at `/api/communications/{model}`:

| Model | Slug |
|---|---|
| Campaigns | `campaigns` |
| Campaign Files | `campaignFiles` |
| Campaign Notes | `campaignNotes` |
| Campaign Tasks | `campaignTasks` |
| Conversations | `conversations` |
| Comments | `comments` |
| Emails | `emails` |
| Email Files | `emailFiles` |
| Email Lists | `emailLists` |
| Email Snapshot Contacts | `emailSnapshotContacts` |
| Email Snapshots | `emailSnapshots` |
| Email Templates | `emailTemplates` |
| Referrals | `referrals` |

## Common patterns

### Scheduling a drip sequence email

```http
POST /api/communications/email-scheduling/schedule
{
  "to": "lead@example.com",
  "subject": "Day 3 — Tips for getting started",
  "templateId": "<onboarding_day3_template_id>",
  "sendAt": "2026-06-18T10:00:00Z",
  "metadata": { "leadId": "<lead_id>", "sequence": "onboarding" }
}
```

### Fetching email analytics for a campaign

```http
GET /api/communications/email-analytics?filter[campaignId]=<campaign_id>
```

<!-- api-sections-start -->
## API sections

These sections are available in the **Communications API Reference**:

- [Bulk Email](/api/communications)
- [Campaign Email](/api/communications)
- [Campaign Emails](/api/communications)
- [Campaign Files](/api/communications)
- [Campaign Notes](/api/communications)
- [Campaign Tasks](/api/communications)
- [Campaigns](/api/communications)
- [Comments](/api/communications)
- [Conversation](/api/communications)
- [Conversations](/api/communications)
- [Email Analytics](/api/communications)
- [Email Files](/api/communications)
- [Email Lists](/api/communications)
- [Email Scheduling](/api/communications)
- [Email Snapshot](/api/communications)
- [Email Snapshot Contacts](/api/communications)
- [Email Snapshots](/api/communications)
- [Email Templates](/api/communications)
- [Emails](/api/communications)
- [File Upload](/api/communications)
- [Gmail Connection](/api/communications)
- [Gmail Send](/api/communications)
- [Gmail Sync](/api/communications)
- [Referrals](/api/communications)
- [Send Email](/api/communications)
<!-- api-sections-end -->
