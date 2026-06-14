# Introduction

Welcome to the **Enterprise API** — the backend platform powering the full product suite.

This reference covers **1,236 API operations** across **20 modules**, all described with [OpenAPI 3.1](https://spec.openapis.org/oas/v3.1.0) and rendered interactively so you can explore and test every endpoint directly from the browser.

## API modules

- [Sales](/api/sales) — Contacts, accounts, opportunities, leads, organizations, quotes, and orders
- [Marketing](/api/marketing) — Campaigns, segments, workflows, social publishing, and web content
- [Customer success](/api/customerSuccess) — Renewals and customer success management
- [Analytics](/api/analytics) — Reporting and data aggregation
- [Communications](/api/communications) — Email, conversations, Gmail sync, and referrals
- [Workflow](/api/workflow) — Scheduled events and workflow status pipelines
- [Finance](/api/finance) — Payments, invoices, estimates, and Stripe integration
- [Identity](/api/identity) — Authentication, users, roles, teams, and departments
- [Data](/api/data) — Models, fields, layouts, and navigation
- [Integrations](/api/integrations) — Sync, imports, exports, and field mapping
- [Notifications](/api/notifications) — Notification scheduling and sending
- [UI](/api/ui) — Screens, components, dashboards, and workspaces
- [Forms](/api/forms) — Form and field management
- [Inventory](/api/inventory) — Equipment and inventory locations
- [Permissions](/api/permissions) — Authorization and access control
- [Cache](/api/cache) — Cache management and invalidation
- [Pipelines](/api/pipelines) — Pipeline orchestration
- [Settings](/api/settings) — Notification, security, and scope settings
- [Support](/api/support) — Support documentation
- [System](/api/system) — Jobs, settings, and tenant resolution

## Base URL

All paths are fully qualified with the `/api` prefix:

```
https://api.enterprise.internal/api/...
```

## OpenAPI Document

The full machine-readable OpenAPI document is available at:

- [openapi.all-modules.json](https://github.com/thefuturebegins/enterprise-api-docs/blob/main/docs/api-reference/openapi.all-modules.json)

## Legal

This documentation is proprietary and confidential. Copyright © 2026 Enterprise Marketplace Ltd. All rights reserved.

Use of this documentation and the APIs described herein is governed by the [Enterprise Master Services Agreement](https://enterprisecrm.com/legal/msa). Unauthorized reproduction, distribution, or disclosure is strictly prohibited.
