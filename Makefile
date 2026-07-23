.PHONY: validate bootstrap-github

validate:
	./scripts/validate_phase0.sh

bootstrap-github:
	@test -n "$(REPO)" || (echo "Usage: make bootstrap-github REPO=owner/repository" && exit 1)
	./scripts/bootstrap_github.sh "$(REPO)"
