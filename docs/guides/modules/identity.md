# Identity

The Identity module manages authentication, authorisation, and the full user lifecycle — from account signup and OAuth login through role-based access control, team management, and multi-tenant provisioning.

## What it covers

| Section | Description |
|---|---|
| **Authentication** | Login, logout, JWT issuance, OAuth 2.0, password management |
| **User Management** | Create, update, deactivate, and search users |
| **Roles** | Define permission sets and assign them to users |
| **Teams** | Group users into teams; manage team membership |
| **Departments** | Organisational unit definitions and department membership |
| **Employees & Contractors** | HR-adjacent staff records linked to identity users |
| **OAuth Handlers** | Callback endpoints for Google, Facebook, Microsoft, Twitter, and Apple |
| **Account Provisioning** | Tenant account creation and initial setup |

## Authentication flows

### Email / password login

```http
POST /api/identity/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "••••••••",
  "accountKey": "acme-corp"
}
```

**Response:**

```json
{
  "token": "<jwt_access_token>",
  "user": { "id": "...", "email": "...", "roles": ["admin"] }
}
```

The `accountKey` identifies the tenant. It can be omitted when the account is resolved from the subdomain or the `DEFAULT_ACCOUNT_KEY` environment variable.

### OAuth login

Redirect the user's browser to the appropriate provider endpoint:

| Provider | Initiate endpoint |
|---|---|
| Google | `GET /api/identity/auth/google` |
| Facebook | `GET /api/identity/auth/facebook` |
| Microsoft | `GET /api/identity/auth/microsoft` |
| Twitter | `GET /api/identity/auth/twitter` |
| Apple | `GET /api/identity/auth/apple` |

Each provider completes at a `/callback` path handled by `OAuthHandlers` and returns the same JWT response.

### Token security

| Parameter | Default | Override |
|---|---|---|
| Algorithm | HS256 | — |
| Expiry | 7 days | `JWT_EXPIRES_IN` env var |
| Secret | `JWT_SECRET` env var | required in production |
| BCrypt rounds | 12 | — |

### Account lockout

After **5 consecutive failed login attempts** the account is locked for **15 minutes**. The lockout state is stored in the user record and cleared automatically on expiry.

### Password reset

```http
# 1. Request reset link (email sent)
POST /api/identity/auth/forgot-password
{ "email": "user@example.com" }

# 2. Set new password (token from email, valid for 1 hour)
POST /api/identity/auth/reset-password
{ "token": "<reset_token>", "password": "new-password" }
```

### Email verification

New user accounts must verify their email address within **24 hours** of registration. The verification token is sent automatically on signup and can be re-sent:

```http
POST /api/identity/auth/resend-verification
{ "email": "user@example.com" }
```

## User management

```http
GET    /api/identity/users              # list users
POST   /api/identity/users              # create user
GET    /api/identity/users/{id}         # get user
PUT    /api/identity/users/{id}         # update user
DELETE /api/identity/users/{id}         # deactivate user
```

## Roles, teams, and departments

```http
# Roles
GET  /api/identity/roles
POST /api/identity/roles

# Teams and membership
GET  /api/identity/teams
POST /api/identity/teamUsers        # add user to team
DELETE /api/identity/teamUsers/{id} # remove user from team

# Departments and membership
GET  /api/identity/departments
POST /api/identity/departmentUsers
```

## Data models

| Model | Slug | Notes |
|---|---|---|
| Users | `users` | Core identity record |
| Roles | `roles` | Named permission sets |
| Teams | `teams` | User groups |
| Team Users | `teamUsers` | Team membership join records |
| Departments | `departments` | Org-unit definitions |
| Department Users | `departmentUsers` | Department membership |
| Employees | `employees` | HR employee records |
| Contractors | `contractors` | External contractor records |

## Account provisioning

New tenant accounts are created via `AccountProvisioningService`. This is typically called once during onboarding and sets up the database schema, default roles, and the first admin user.

```http
POST /api/identity/account-provisioning/provision
{
  "accountKey": "new-tenant",
  "adminEmail": "admin@new-tenant.com",
  "adminPassword": "••••••••",
  "plan": "enterprise"
}
```

<!-- api-sections-start -->
## API sections

These sections are available in the **Identity API Reference**:

- [Authentication](/api/identity)
- [Contractors](/api/identity)
- [Department Users](/api/identity)
- [Departments](/api/identity)
- [Employees](/api/identity)
- [Oauthhandlers](/api/identity)
- [Roles](/api/identity)
- [Team Users](/api/identity)
- [Teams](/api/identity)
- [User Management](/api/identity)
- [Users](/api/identity)
<!-- api-sections-end -->
