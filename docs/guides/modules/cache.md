# Cache

The Cache module provides a shared caching layer used across the platform to reduce redundant database queries and external API calls. It exposes cache inspection, invalidation, and TTL configuration endpoints.

## What it covers

| Section | Description |
|---|---|
| **Cache** | Read and invalidate cached entries |
| **Cache Helpers** | Utility operations: warm-up, bulk invalidation, key listing |
| **TTL Config** | Configure per-key time-to-live durations |

## Authentication

All Cache endpoints require a valid session. Invalidation endpoints require `cache:write` permission.

## Core services

### CacheService

The primary caching interface — read, write, and invalidate individual cache entries:

```http
# Read a cached value
GET /api/cache/cache?key=<cache_key>

# Invalidate a specific key
DELETE /api/cache/cache?key=<cache_key>

# Invalidate all keys matching a pattern
DELETE /api/cache/cache?pattern=contacts:*
```

### CacheHelpers

Utility operations for managing the cache in bulk:

```http
# List all cached keys (or keys matching a pattern)
GET /api/cache/cache/keys?pattern=accounts:*

# Warm-up: pre-populate frequently accessed entries
POST /api/cache/cache/warm
{ "keys": ["fieldTypes", "industries", "navigationItems"] }

# Flush entire cache (use with caution)
POST /api/cache/cache/flush
```

### TTL Config

Configure how long specific cache key patterns are retained:

```http
# List current TTL rules
GET /api/cache/ttl-config

# Set a TTL for a pattern
PUT /api/cache/ttl-config
{
  "pattern": "reports:*",
  "ttlSeconds": 300
}

# Reset a pattern to the default TTL
DELETE /api/cache/ttl-config?pattern=reports:*
```

## Cache key conventions

Cache keys follow a `{scope}:{identifier}` convention:

| Scope | Example key | What it caches |
|---|---|---|
| `fieldTypes` | `fieldTypes` | Field type catalogue (rarely changes) |
| `industries` | `industries` | Industry taxonomy |
| `navigationItems` | `navigationItems:acme-corp` | Per-account nav structure |
| `reports` | `reports:<report_id>` | Report result sets |
| `accounts` | `accounts:<account_id>` | Account records |
| `settings` | `settings:acme-corp` | Per-account settings |

## Common patterns

### Invalidating cache after a model update

When a model definition changes (e.g. a field is added), invalidate the relevant caches so the next request fetches fresh data:

```http
DELETE /api/cache/cache?pattern=models:*
DELETE /api/cache/cache?pattern=navigationItems:*
```

### Checking if a key is cached

```http
GET /api/cache/cache?key=industries
# 200 → cached (returns value)
# 404 → not in cache
```

<!-- api-sections-start -->
## API sections

These sections are available in the **Cache API Reference**:

- [Cache](/api/cache)
<!-- api-sections-end -->
