# Identity and Tenancy Database Foundation

Status: Sprint 2 / M1 — database foundation complete; Auth/Tenancy vertical slice in progress

This increment establishes the database boundary required before the first Auth/Tenancy API write vertical slice.

## Tables

- `profiles`: application profile linked one-to-one to `auth.users`.
- `organizations`: top-level tenant organization.
- `stores`: store boundary inside an organization.
- `roles`: canonical roles (`OWNER`, `ADMIN`, `STAFF`, `VIEWER`).
- `permissions`: baseline granular permission catalog from the implementation roadmap.
- `role_permissions`: explicit many-to-many role/permission mapping.
- `store_memberships`: user membership, role, and lifecycle state for one store.

`organizations`, `stores`, and `store_memberships` carry optimistic-concurrency `version` columns. Store membership also persists both `organization_id` and `store_id`; a composite foreign key prevents a membership from pointing at a store in a different organization.

## Profile creation

An `auth.users` insert creates the matching `profiles` row through an `app_private` trigger function. The migration also backfills profiles for Auth users that already exist when the migration is applied.

## Membership lifecycle

The foundation supports these states:

- `INVITED`
- `ACTIVE`
- `REVOKED`

Invitation commands and acceptance/revocation APIs are intentionally deferred to the Auth/Tenancy API vertical slice.

## Authorization boundary

Authenticated clients currently receive read access only where explicitly allowed by RLS:

- A user can read and update their own profile display name.
- An active member can read their organization and store.
- A user can read only their own store-membership rows.
- Authenticated users can read the canonical role/permission catalogs.
- Revoked membership immediately removes organization/store read access.

No authenticated-client policy is provided for organization, store, role, permission, or membership writes. Those writes remain backend-owned business commands.

## Role-permission mapping

The roadmap defines the role catalog and the granular permission catalog, but it does not define the exact permission assignment for every role. Therefore `role_permissions` is created but intentionally not seeded in this increment. The mapping must be specified and tested as part of the authorization vertical slice rather than inferred silently.

## Tests

`supabase/tests/identity_tenancy_rls.test.sql` verifies schema presence, baseline catalogs, Auth-to-profile creation, cross-tenant isolation, self-membership visibility, and access removal after revocation.

Run locally with:

```text
supabase db reset
supabase db lint --level error
supabase test db
```


## Current implementation progress — 2026-09-01

Implemented in source:

- E3-01 User profile model.
- E3-02 Organization and store model.
- E3-03 Store membership model.
- Database-side tenant-isolation coverage for the current schema.
- E3-04 Owner creates store through `POST /api/v1/tenancy/bootstrap` (pending normal CI/local Supabase verification before Done).
- Supabase access-token validation at the NestJS boundary for the E3-04 command.
- Idempotent bootstrap processing through `processed_operations` and `operationId`.

The bootstrap command atomically creates the organization, first store, and ACTIVE `OWNER`
membership. Repeating the same operation with the same payload returns the original result rather
than creating duplicate tenant data.

Still required before M1 is complete:

- E3-05 Owner invites staff.
- E3-06 Staff accepts invitation.
- E3-07 Store selection on mobile.
- Backend membership/permission guards and authorization tests to complement RLS coverage.
- E3-09 Device registration foundation and remote revoke behavior.
- E3-10 Audit log foundation.

The role-permission matrix remains intentionally unseeded until the authorization slice defines
and tests the exact assignments.
