# Introduction

Welcome to the **Future Begins Enterprise API** — the backend platform powering the full Future Begins product suite.

This reference covers **150 API operations** across **9 modules**, all described with [OpenAPI 3.1](https://spec.openapis.org/oas/v3.1.0) and rendered interactively so you can explore and test every endpoint directly from the browser.

## API Modules

| Module | Operations | Description |
|---|---|---|
| **analytics** | 5 | Reporting and data aggregation |
| **cache** | 13 | Cache management and invalidation |
| **finance** | 15 | Contractor payments, customer payments, Stripe integration |
| **integrations** | 34 | Conflict resolution, data sync, field mapping, import management, sync engine |
| **notifications** | 21 | Notification scheduling and sending |
| **permissions** | 3 | Authorization and access control |
| **pipelines** | 1 | Pipeline orchestration |
| **sales** | 32 | Account management, Google Business Profiles, LinkedIn Profiles, opportunities, workspace management |
| **ui** | 26 | Components, dashboards, screens, user screens, workspaces |

## Base URL

All paths in this API are fully qualified with the `/api` prefix:

```
https://api.futurebeg.in/api/...
```

## OpenAPI Document

The full machine-readable OpenAPI document is available at:

- [openapi.all-modules.json](https://github.com/future-begins/enterprise-api-docs/blob/main/docs/api-reference/openapi.all-modules.json)

## Open Source

This documentation is published under the [MIT License](https://github.com/future-begins/enterprise-api-docs/blob/main/LICENSE) and is open to contributions. See the [README](https://github.com/future-begins/enterprise-api-docs#contributing) for details.
