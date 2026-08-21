# ADR-017 — Dev Integration Branch and Multi-Artifact Release Identity

- Status: Accepted
- Date: 2026-08-20

## Context

The original foundation policy used short-lived branches directly into `main`. The project now requires a stable integration point for local and cross-feature testing before code becomes a release candidate. StoreManagementApp also deploys heterogeneous artifacts: a NestJS API, Next.js Web application, PostgreSQL/Supabase migrations, and a Flutter Android application.

A single image digest cannot identify the whole product, and database rollback cannot safely be treated like stateless application rollback.

## Decision

1. Introduce `dev` as the long-lived integration branch.
2. Normal feature/fix work merges into `dev` through pull requests and CI.
3. Normal pull requests into `main` originate from `dev`.
4. `main` remains the release-candidate/deployable branch.
5. `main` is the source for staging.
6. Production requires a release tag, staging verification, and manual approval.
7. The immutable Git SHA on `main` is the common release identity.
8. Each component records its own immutable artifact or deployment identity against that Git SHA.
9. Production database migrations are forward-only and use expand-migrate-contract for breaking changes.
10. Application rollback does not automatically roll back the database.

## Consequences

### Positive

- Integration testing has a stable branch without weakening `main`.
- Release candidates are traceable across API, Web, database, and Android.
- Staging and production cannot silently drift to different source commits.
- Database compatibility is preserved for older mobile clients.
- Release and rollback procedures can mature independently per component.

### Trade-offs

- Feature work normally passes through two pull requests before production (`feature → dev → main`).
- `dev` must be kept healthy; it cannot become an ungoverned dumping branch.
- Release metadata is more complex than a single container tag.
- Hotfixes require explicit synchronization back into `dev`.

## Supersedes

This ADR supersedes the statement in the previous branching policy that a long-lived development branch would not be used during the early phase. It does not change the product vision, technology stack, modular-monolith decision, or deployment-provider baseline.
