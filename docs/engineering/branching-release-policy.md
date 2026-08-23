# Branching and Release Policy

## Decision

StoreManagementApp uses a long-lived integration branch and a protected release branch:

```text
feature/* | fix/* | chore/* | docs/* | refactor/*
                    │
                    │ Pull Request + CI
                    ▼
                   dev
                    │
                    │ Release Pull Request + full CI
                    ▼
                   main
                    │
                    ├── automatic staging deployment
                    │
                    └── release tag vX.Y.Z
                              │
                              ├── staging verification
                              ├── manual production approval
                              └── production deployment
```

## Branch responsibilities

### `dev`

`dev` is the integration branch.

- Feature development starts from the latest `dev`.
- Feature, fix, refactor, documentation, test, and CI branches merge into `dev` through pull requests.
- CI must pass before merge.
- `dev` is the branch used to integrate and exercise the current development state locally.
- Direct pushes, force pushes, and deletion are blocked.
- `dev` is not a production deployment source.

### `main`

`main` is the release-candidate branch and must remain deployable.

- Normal pull requests into `main` must originate from `dev`.
- Full CI must pass before merge.
- Direct pushes, force pushes, and deletion are blocked.
- Merge to `main` becomes the source for staging.
- Production is never deployed merely because `main` changed.

### Short-lived branches

Recommended prefixes:

- `feature/`
- `fix/`
- `refactor/`
- `docs/`
- `test/`
- `ci/`
- `chore/`
- `hotfix/`

A production hotfix is branched from `main`, validated, merged to `main`, and then back-merged into `dev` immediately after release. Hotfixes are exceptional and must not become a bypass around normal review or CI.

## Merge strategy

- Squash merge for normal feature pull requests.
- Require CI before merge.
- Require conversation resolution.
- Require linear history where supported.
- Require at least one approval when a second qualified reviewer is available.
- Do not require self-approval for a solo-development phase.

## CI contract

The canonical required status check is:

```text
CI / CI gate
```

It aggregates:

- PR source validation.
- Repository/security policy checks.
- API and Web formatting, lint, type-check, tests, and builds.
- Flutter formatting, analysis, and tests.
- Supabase clean migration rebuild, database linting, and pgTAP tests when present.

Path filters are intentionally not used for the required CI gate. This prevents a required check from remaining absent or skipped merely because a pull request changed a different part of the monorepo.

## Versioning

Semantic versioning is used:

```text
MAJOR.MINOR.PATCH
```

Before Production v1.0:

```text
0.x.y
```

## Environments

- Local.
- Staging.
- Production.

Staging is sourced from `main` and will be automated when the managed staging infrastructure is provisioned.

Production requires:

1. A release tag.
2. A staging-verified release candidate from the same `main` commit.
3. Manual approval through the GitHub `production` environment.
4. Migration safety checks.
5. Post-deployment verification.

## Release identity

A StoreManagementApp release is identified first by one immutable Git commit on `main`. Each deployable component records its own artifact identity against that commit.

Example release manifest fields:

```text
release: v0.4.0
git_sha: <40-character SHA>
api_image_digest: sha256:...
web_deployment_id: ...
database_migration_head: ...
android_version_name: 0.4.0
android_version_code: 17
android_artifact_sha256: ...
```

The API, Web, database migration set, and Android artifact do not have to share the same artifact format. They must, however, be traceable to the same approved release commit.

## Database releases

- Migrations are reviewed as code.
- Production migrations are forward-only.
- Do not automatically execute destructive down migrations in production.
- Breaking schema changes use expand-migrate-contract.
- Application rollback and database disaster recovery are separate procedures.
- A failed application release may roll back the API/Web artifact while the database remains on a backward-compatible schema.
- Database restore/PITR is reserved for data-loss or corruption recovery, not routine application rollback.
