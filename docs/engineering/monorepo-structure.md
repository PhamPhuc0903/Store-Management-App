# Monorepo Structure

```text
apps/
├── api/          NestJS application backend
├── admin-web/    Next.js web administration
└── mobile/       Flutter Android-first client

packages/
└── api-contracts/ Framework-neutral public API contracts

supabase/
├── migrations/   Versioned PostgreSQL migrations
├── tests/        Database and RLS tests
└── seed.sql      Sanitized local seed data
```

## Boundaries

- Mobile and Web communicate with the NestJS API for business commands.
- PostgreSQL is authoritative.
- Mobile SQLite becomes the operational local cache in the synchronization milestone.
- Supabase Realtime is a change notification channel, not the completeness mechanism.
- Shared contracts contain external interfaces only, not database entities.
