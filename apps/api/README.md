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

The API is the business-command boundary. Mobile and web clients must not bypass it
for transactional operations.
