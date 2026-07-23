#!/usr/bin/env bash
set -euo pipefail

required=(
  README.md
  CONTRIBUTING.md
  SECURITY.md
  CHANGELOG.md
  .github/PULL_REQUEST_TEMPLATE.md
  .github/ISSUE_TEMPLATE/feature.yml
  .github/ISSUE_TEMPLATE/bug.yml
  docs/project-governance.md
  docs/product/30-day-backlog.md
  docs/engineering/definition-of-done.md
  docs/operations/github-setup-checklist.md
  docs/adr/0000-template.md
)

for file in "${required[@]}"; do
  [[ -f "$file" ]] || { echo "Missing: $file"; exit 1; }
done

if grep -RInE '(SUPABASE_SERVICE_ROLE_KEY|JWT_SECRET|OPENAI_API_KEY)=[^[:space:]]+' \
    --exclude='*.example' --exclude='*.md' .; then
  echo "Possible secret detected."
  exit 1
fi

echo "Phase 0 repository scaffold is valid."
