.PHONY: validate bootstrap dev mobile test lint typecheck format-check build stop db-start db-stop db-reset db-lint bootstrap-github

validate:
	./scripts/validate_phase0.sh
	npm run validate:foundation

bootstrap:
	npm ci
	cd apps/mobile && flutter pub get

# Runs API + Web. Run `make mobile` in another terminal for Flutter.
dev:
	npm run dev

mobile:
	cd apps/mobile && flutter run

test:
	npm run test
	cd apps/mobile && flutter test

lint:
	npm run lint
	cd apps/mobile && flutter analyze

typecheck:
	npm run typecheck

format-check:
	npm run format:check
	cd apps/mobile && dart format --output=none --set-exit-if-changed lib test

build:
	npm run build

stop: db-stop

db-start:
	npm run db:start

db-stop:
	npm run db:stop

db-reset:
	npm run db:reset

db-lint:
	npm run db:lint

db-test:
  npm run db:test

bootstrap-github:
	@test -n "$(REPO)" || (echo "Usage: make bootstrap-github REPO=owner/repository" && exit 1)
	./scripts/bootstrap_github.sh "$(REPO)"
