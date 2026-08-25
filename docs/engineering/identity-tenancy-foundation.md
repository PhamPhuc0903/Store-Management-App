# Identity and Tenancy Database Foundation

Status: Sprint 2 / M1 foundation

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
