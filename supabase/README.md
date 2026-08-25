# Local Supabase

Supabase CLI starts PostgreSQL, Auth, Realtime, Storage and Studio in Docker.

From the repository root:

```bash
npm ci
npm run db:start
npm run db:status
npm run db:reset
npm run db:lint
npm run db:test
npm run db:stop
```

Docker Desktop (or a compatible Docker runtime) must be running before `db:start`.

The M1 Identity/Tenancy migration and pgTAP isolation tests live in:

```text
supabase/migrations/20260824000100_identity_tenancy_foundation.sql
supabase/tests/identity_tenancy_rls.test.sql
```
