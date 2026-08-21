# Local Development

## Required tools

- Git.
- Node.js 22+ and npm 10+.
- Flutter 3.47.x stable.
- Android SDK for mobile development.
- Docker Desktop or a compatible Docker runtime.
- Supabase CLI available as `supabase` on PATH.

On Windows, a standalone Supabase CLI installation (for example through Scoop) is preferred over relying on an npm wrapper. CI installs its own pinned Supabase CLI through the official setup action.

## First setup

From repository root:

```text
npm ci
cd apps/mobile
flutter pub get
```

Or, when GNU Make is available:

```text
make bootstrap
```

## Start local Supabase

From repository root:

```text
supabase start
supabase status
```

The configured local endpoints are defined in `supabase/config.toml`.

To validate that the database can be recreated entirely from migrations:

```text
supabase db reset
supabase db lint --level error
```

## Run API and Admin Web

From repository root:

```text
npm run dev
```

This starts the NestJS API and Next.js Admin Web development processes.

## Run Flutter

In a separate terminal:

```text
cd apps/mobile
flutter run
```

Keep the Flutter run session open and use hot reload for normal UI iteration.

## Quality checks

TypeScript workspaces:

```text
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run build
```

Flutter:

```text
cd apps/mobile

dart format --output=none --set-exit-if-changed lib test
flutter analyze
flutter test
```

Database:

```text
supabase db reset
supabase db lint --level error
```

When pgTAP SQL tests are present in `supabase/tests`, also run:

```text
supabase test db
```

## Branch workflow

Normal development:

```text
git checkout dev
git pull

git checkout -b feature/<short-name>
# implement and test
# PR -> dev
```

Release promotion:

```text
dev -> PR -> main
```

Normal pull requests into `main` from branches other than `dev` are rejected by CI.
