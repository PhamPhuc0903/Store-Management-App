# Auth and Tenancy API Vertical Slice

Status: Sprint 2 / M1 in progress

## E3-04 — Owner creates store

The first backend-owned tenancy write command is:

```text
POST /api/v1/tenancy/bootstrap
```

The caller supplies a Supabase access token and a client-generated UUID `operationId`. NestJS
validates the token through Supabase Auth and derives the actor user ID from the validated session;
the actor ID is never accepted from request input.

Request:

```json
{
  "operationId": "8bb063aa-ec39-4adb-ac67-798d8f58ba97",
  "organizationName": "Gia Đình",
  "storeName": "Cửa hàng chính"
}
```

Successful execution creates, in one PostgreSQL transaction:

1. one organization;
2. its first store;
3. one ACTIVE membership for the authenticated user with role `OWNER`;
4. one `processed_operations` record containing the request and response used for idempotent replay.

Retrying the same `operationId` with the same actor and normalized payload returns the original
result. Reusing the operation ID for a different command payload is rejected.

## Trust boundary

- Mobile/Web access tokens are untrusted input.
- NestJS validates the token with Supabase Auth before dispatching the command.
- The service-role credential stays in the API environment and is never returned to clients.
- `bootstrap_owner_store` is executable by `service_role` only; `anon` and `authenticated` have no
  direct execute permission.
- Direct authenticated-client writes to organizations, stores, memberships, and processed operations
  remain blocked.

## Error contract

Expected stable application codes currently include:

| Code | Meaning | Retry |
|---|---|---|
| `UNAUTHENTICATED` | Bearer token missing, invalid, or expired | No |
| `OPERATION_ID_REUSED` | Same operation ID used with a different command payload | No |
| `INVALID_TENANCY_BOOTSTRAP` | Organization/store input is invalid | No |
| `AUTH_PROVIDER_UNAVAILABLE` | Supabase Auth cannot be reached | Yes |
| `DATA_PLATFORM_UNAVAILABLE` | Supabase data API cannot be reached | Yes |
| `TENANCY_BOOTSTRAP_FAILED` | Server-side bootstrap failed | No |

Server-error messages remain redacted by the global exception filter.

## Verification

Unit tests cover token handling, request actor binding, service-role RPC invocation, error mapping,
and stable API error metadata. The pgTAP suite covers bootstrap creation and retry idempotency on a
clean migrated database.

Local database verification:

```text
supabase db reset
supabase db lint --level error
supabase test db
```

## Next work

The next backlog item is E3-05 Owner invites staff, followed by E3-06 Staff accepts invitation.
Those slices must define the role-permission matrix and add backend membership/permission tests before
E3-08 Tenant isolation can be considered complete end-to-end.
