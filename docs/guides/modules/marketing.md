# Marketing

The Marketing module powers multi-channel campaign execution and digital presence management. It covers the full journey from audience segmentation through email drip sequences, social publishing, web content, and campaign performance analytics.

## What it covers

| Section | Description |
|---|---|
| **Campaigns** | Multi-channel campaign containers with stakeholder tracking |
| **Campaign Channels** | Per-channel execution: Email, SMS, Ads, PPC, Social, Web Content |
| **Segments** | Dynamic audience lists used for targeting |
| **Email Drip Campaigns** | Automated multi-step email sequences |
| **Email Sequence Workflows** | Branching logic that drives drip campaign execution |
| **Social Publishing** | Connect social accounts, schedule and publish posts, monitor inbox |
| **Social Analytics** | Engagement metrics per social connection |
| **Web Publishing & Websites** | Manage web properties, pages, and publish jobs |
| **Workflow Enrollments** | Enrol contacts into marketing workflows |
| **Send Marketing Email** | One-off transactional sends triggered from campaign logic |

## Authentication

All Marketing endpoints require a valid session token or cookie (same as all modules). Campaign management endpoints additionally require the `marketing:write` permission scope.

## Core services

### Send Marketing Email

Delegates to the Communications module's `SendEmailService` under the hood. Use this endpoint when you want to send an email in the context of a marketing campaign (tracks opens, clicks, and links back to a campaign record).

```http
POST /api/marketing/send-marketing-email
Content-Type: application/json

{
  "to": "contact@example.com",
  "subject": "Your Q3 offer",
  "templateId": "<template_id>",
  "campaignId": "<campaign_id>"
}
```

### Social Connection

Connect and disconnect social media accounts. Supported platforms are configured per-tenant.

```http
GET    /api/marketing/social-connection           # list connected accounts
POST   /api/marketing/social-connection/connect   # initiate OAuth connect
DELETE /api/marketing/social-connection/{id}      # disconnect
```

### Social Publishing

Schedule and publish posts across connected social accounts.

```http
POST /api/marketing/social-publishing
{
  "connectionId": "<id>",
  "content": "Excited to announce our new product line! #Enterprise",
  "scheduledAt": "2026-07-01T09:00:00Z"
}
```

### Web Publishing

Manage web pages and trigger publish jobs for connected web properties.

```http
GET  /api/marketing/web-pages
POST /api/marketing/web-pages
POST /api/marketing/web-publishing/publish
```

## Data models

All Marketing models support the standard CRUD envelope at `/api/marketing/{model}`.

| Model | Slug | Notes |
|---|---|---|
| Campaign Channel — Ads | `campaignChannelAds` | Display/programmatic ad placements |
| Campaign Channel — Email | `campaignChannelEmails` | Email channel configuration per campaign |
| Campaign Channel — PPC | `campaignChannelPpc` | Pay-per-click channel settings |
| Campaign Channel — SMS | `campaignChannelSms` | SMS channel configuration |
| Campaign Channel — Social | `campaignChannelSocial` | Social channel configuration |
| Campaign Channel — Web Content | `campaignChannelWebContent` | Web content channel settings |
| Campaign Sequences | `campaignSequences` | Ordered email step containers |
| Campaign Sequence Snapshots | `campaignSequenceSnapshots` | Point-in-time audience captures |
| Segments | `segments` | Dynamic audience lists |
| Email Drip Campaigns | `emailDripCampaigns` | Multi-step automated email campaigns |
| Email Sequence Workflows | `emailSequenceWorkflows` | Branching workflow definitions |
| Websites | `websites` | Managed web properties |
| Web Pages | `webPages` | Individual pages within a website |
| Workflow Enrollments | `workflowEnrollments` | Contact → workflow enrolment records |
| Workflow Steps | `workflowSteps` | Individual steps in a workflow |
| Workflows | `workflows` | Marketing automation workflow definitions |

Each channel model also has associated `files`, `notes`, and `tasks` sub-resources following the standard naming pattern (e.g. `campaignChannelAdsTasks`).

## Common patterns

### Creating a campaign with an email channel

```http
# 1. Create the campaign container
POST /api/marketing/campaigns
{ "name": "Summer 2026 Launch", "startDate": "2026-07-01" }

# 2. Add an email channel
POST /api/marketing/campaignChannelEmails
{
  "campaignId": "<campaign_id>",
  "fromName": "Enterprise Team",
  "fromEmail": "hello@enterprise.internal",
  "subject": "Introducing our Summer 2026 line"
}
```

### Enrolling a contact in a workflow

```http
POST /api/marketing/workflowEnrollments
{
  "workflowId": "<workflow_id>",
  "contactId": "<contact_id>",
  "enrolledAt": "2026-06-15T00:00:00Z"
}
```

<!-- api-sections-start -->
## API sections

These sections are available in the **Marketing API Reference**:

- [Campaign Channel Ads](/api/marketing)
- [Campaign Channel Ads Files](/api/marketing)
- [Campaign Channel Ads Notes](/api/marketing)
- [Campaign Channel Ads Tasks](/api/marketing)
- [Campaign Channel Emails](/api/marketing)
- [Campaign Channel Emails Files](/api/marketing)
- [Campaign Channel Emails Notes](/api/marketing)
- [Campaign Channel Emails Tasks](/api/marketing)
- [Campaign Channel Ppc](/api/marketing)
- [Campaign Channel Ppc Files](/api/marketing)
- [Campaign Channel Ppc Notes](/api/marketing)
- [Campaign Channel Ppc Tasks](/api/marketing)
- [Campaign Channel Sms](/api/marketing)
- [Campaign Channel Sms Files](/api/marketing)
- [Campaign Channel Sms Notes](/api/marketing)
- [Campaign Channel Sms Tasks](/api/marketing)
- [Campaign Channel Social](/api/marketing)
- [Campaign Channel Social Files](/api/marketing)
- [Campaign Channel Social Notes](/api/marketing)
- [Campaign Channel Social Tasks](/api/marketing)
- [Campaign Channel Web Content](/api/marketing)
- [Campaign Channel Web Content Files](/api/marketing)
- [Campaign Channel Web Content Notes](/api/marketing)
- [Campaign Channel Web Content Tasks](/api/marketing)
- [Campaign Sequence Snapshot Contacts](/api/marketing)
- [Campaign Sequence Snapshots](/api/marketing)
- [Campaign Sequences](/api/marketing)
- [Campaign Stakeholder Users](/api/marketing)
- [Email Drip Campaign Notes](/api/marketing)
- [Email Drip Campaigns](/api/marketing)
- [Email Sequence Workflows](/api/marketing)
- [Segment Files](/api/marketing)
- [Segment Notes](/api/marketing)
- [Segments](/api/marketing)
- [Send Marketing Email](/api/marketing)
- [Social Analytics](/api/marketing)
- [Social Connection](/api/marketing)
- [Social Inbox](/api/marketing)
- [Social Publish Job](/api/marketing)
- [Social Publishing](/api/marketing)
- [Web Pages](/api/marketing)
- [Web Publishing](/api/marketing)
- [Website Statuses](/api/marketing)
- [Website Types](/api/marketing)
- [Websites](/api/marketing)
- [Workflow Enrollments](/api/marketing)
- [Workflow Steps](/api/marketing)
- [Workflows](/api/marketing)
<!-- api-sections-end -->
