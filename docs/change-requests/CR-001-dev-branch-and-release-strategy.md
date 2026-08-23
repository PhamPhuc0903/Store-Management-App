# CR-001 — Introduce `dev` Integration Branch and Multi-Artifact Release Strategy

- Status: Approved
- Date: 2026-08-20
- Related ADR: ADR-017

## Requested change

Change the repository delivery model from short-lived branches directly into `main` to:

```text
short-lived branch → dev → main → staging → release tag/manual approval → production
```

Also formalize release identity for the heterogeneous API/Web/database/Android deployment model and make production database migration policy forward-only.

## Reason

- A protected `dev` branch provides a stable integration point for local and cross-feature testing.
- `main` should remain a clean release-candidate branch rather than the day-to-day integration branch.
- StoreManagementApp cannot use one container digest as the identity of the entire release because Web, Android, database migrations, and API use different artifact types.
- Mobile clients may remain on older versions, so destructive database rollback or immediate breaking schema changes are unsafe.

## Impact analysis

### Product scope

No product feature or release scope changes.

### Architecture

No change to Flutter, Next.js, NestJS, Supabase/PostgreSQL, modular monolith, offline-first, or multi-tenancy decisions.

### Engineering process

- Adds protected `dev` branch.
- Makes normal PRs into `main` originate from `dev`.
- Adds shared Git-SHA release identity and component-specific artifact metadata.
- Formalizes forward-only, expand-migrate-contract production migration policy.

### Delivery effort

Adds one promotion PR (`dev → main`) before staging/release. CI and branch rules must be configured accordingly.

## Approval

Approved for implementation and recorded in ADR-017. The next consolidated Technical Architecture baseline revision should incorporate this decision instead of editing the previously approved v2.0 document silently.
