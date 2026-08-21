# Release Identity and Database Safety

## Purpose

StoreManagementApp has four independently deployable concerns:

1. NestJS API.
2. Next.js Admin Web.
3. Supabase/PostgreSQL schema and platform configuration.
4. Flutter Android application.

A single container digest cannot represent the whole product. The common release identity is therefore the immutable Git commit on `main`; component-specific immutable identifiers are attached to it.

## API artifact

When container deployment is introduced, build the API image once per release candidate and record its registry digest. Staging and production should deploy the same verified image digest whenever environment configuration permits.

## Web artifact

The Web deployment must be traceable to the same release commit as the API. Because staging and production can have different environment configuration, deployment IDs are recorded separately. Production must not silently build from a different source commit than the release candidate verified on staging.

## Android artifact

Use separate staging and production flavors when environment-specific configuration is introduced. Both artifacts must originate from the approved release commit. Production records version name, version code, and artifact checksum.

## Database migration policy

Production migrations are forward-only and compatibility-first.

Use the following sequence for breaking changes:

```text
EXPAND
Add backward-compatible schema structures.
        ↓
MIGRATE
Backfill or dual-read/dual-write while old clients can still operate.
        ↓
CONTRACT
Remove obsolete structures only after supported clients no longer depend on them.
```

This is mandatory for mobile-sensitive schema changes because Android clients can remain on older app versions after a backend release.

## Failure handling

```text
Bad API/Web release
→ roll back application artifact

Bad but compatible schema change
→ forward-fix migration

Database corruption or data loss
→ backup/PITR restore procedure
```

Automatic database rollback is not part of the normal release pipeline.
