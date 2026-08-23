#!/usr/bin/env bash
set -euo pipefail

if ! command -v gh >/dev/null 2>&1; then
  echo "GitHub CLI (gh) chưa được cài đặt."
  exit 1
fi

REPO="${1:-}"
if [[ -z "$REPO" ]]; then
  echo "Usage: $0 <owner/repository>"
  exit 1
fi

echo "Configuring labels for $REPO"

python - <<'PY' | while IFS=$'\t' read -r name color description; do
import json
for label in json.load(open("scripts/labels.json", encoding="utf-8")):
    print(f"{label['name']}\t{label['color']}\t{label['description']}")
PY
  gh label create "$name" \
    --repo "$REPO" \
    --color "$color" \
    --description "$description" \
    --force
done

milestones=(
  "M0 Repository and CI"
  "M1 Identity and Tenancy"
  "M2 Catalog and Barcode"
  "M3 Pricing"
  "M4 Offline Sync"
  "M5 Family Pricing MVP"
  "M6 Sales and Payments"
  "M7 Purchasing and Inventory"
  "M8 Web Admin and Reports"
  "M9 Family Production Pilot"
  "M10 AI Invoice Extraction"
  "M11 Security/Performance Hardening"
  "M12 Production v1.0"
  "M13 Portfolio Release"
  "M14 SaaS Beta"
)
existing_milestones="$(gh api "repos/$REPO/milestones?state=all&per_page=100" --jq '.[].title')"

for title in "${milestones[@]}"; do
  if grep -Fxq "$title" <<<"$existing_milestones"; then
    echo "Milestone exists: $title"
  else
    gh api --method POST "repos/$REPO/milestones" -f title="$title" >/dev/null
    echo "Created milestone: $title"
  fi
done

echo
echo "GitHub labels and milestones configured."
echo "Complete branch protection and environments manually using:"
echo "docs/operations/github-setup-checklist.md"
