# Changelog

Tất cả thay đổi đáng chú ý của StoreManagementApp được ghi tại đây.

Định dạng dựa trên Keep a Changelog và semantic versioning.

## [Unreleased]
### Sprint 2 Identity and tenancy foundation

- Added authenticated E3-04 owner/store bootstrap API with Supabase Auth token validation.
- Added atomic organization + store + ACTIVE OWNER membership creation with operation-id idempotency.
- Added `processed_operations` foundation and pgTAP coverage for retry-safe tenant bootstrap.
- Added stable structured 4xx API error metadata while preserving 5xx message redaction.
- Fixed CI workflow self-change detection, `make db-test`, and local Supabase CLI script consistency.
- Corrected the Sprint 2 backlog to include invitation and acceptance work required by the stated vertical-slice objective.
- Added M1 database foundation for profiles, organizations, stores, roles, permissions, and store memberships.
- Added RLS tenant-isolation tests, including revoked-membership access checks.
- Seeded the baseline role and permission catalogs while deferring the unspecified role-permission matrix.
- Prevented unexpected API 500 responses from exposing internal error messages and added regression tests.
- Added fail-fast API port normalization/validation so string environment values cannot be treated as a named pipe.
- Added path-aware CI so unaffected Mobile/API-Web/Database jobs can be skipped, plus Gradle caching for Android builds.
- Corrected stale branching/local-development documentation and the database CI migration-step label.

### Sprint 2 CI and delivery foundation

- Added protected `dev → main` release-flow documentation and ADR-017.
- Consolidated required CI into one `CI / CI gate` workflow for API, Web, Mobile, and Supabase.
- Added release-identity and forward-only database migration safety policy.
- Aligned milestones with M0–M14 from Implementation Roadmap v1.0.
- Added Dependabot and a security-hardening issue template.



### Added

- npm workspaces monorepo.
- NestJS API with versioned health endpoint, validation, logging and Swagger.
- Next.js Web Admin foundation with API connectivity status.
- Flutter source-first mobile foundation with Riverpod and go_router.
- Supabase local configuration and foundation migration.
- API/Web, Mobile and Database CI workflows.
- Local bootstrap and prerequisite scripts.
- Shared API contracts package.

- Phase 0 repository governance scaffold.
- Project documentation baseline.
- GitHub issue and pull request templates.
- Initial labels and milestones bootstrap script.
- 30-day execution backlog.

## [0.0.1] - 2026-07-20

### Added

- Initial StoreManagementApp project baseline.
