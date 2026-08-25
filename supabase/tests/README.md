# Database Tests

Database and RLS tests are implemented as pgTAP tests and run through `supabase test db`.

Coverage categories:

- Migration smoke tests.
- Tenant isolation.
- Membership authorization.
- Price history invariants.
- Idempotent command processing.

Current M1 coverage: `identity_tenancy_rls.test.sql` validates Auth profile creation, tenant read isolation, membership visibility, and revocation behavior.
