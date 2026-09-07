# StoreManagementApp API

NestJS application backend.

## Development

```bash
npm install
npm run dev:api
```

Endpoints:

- API health: `http://localhost:3001/api/v1/health`
- Swagger: `http://localhost:3001/api/docs`
- Owner/store bootstrap: `POST http://localhost:3001/api/v1/tenancy/bootstrap`

The API is the business-command boundary. Mobile and web clients must not bypass it
for transactional operations.


## Identity/Tenancy bootstrap

`POST /api/v1/tenancy/bootstrap` requires a Supabase access token:

```text
Authorization: Bearer <access-token>
```

Request body:

```json
{
  "operationId": "<uuid>",
  "organizationName": "Gia Đình",
  "storeName": "Cửa hàng chính"
}
```

The command creates the organization, first store, and ACTIVE OWNER membership atomically. The
client must reuse the same `operationId` when retrying the same command. Supabase local values for
`SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` are obtained from
`supabase status` and must remain server-side.
