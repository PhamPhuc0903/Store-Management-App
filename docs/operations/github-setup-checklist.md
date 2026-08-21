# GitHub Setup Checklist

## Repository

- [ ] Repository exists with appropriate visibility.
- [ ] Description and topics are configured.
- [ ] `dev` exists and is based on the current validated `main` commit.
- [ ] Default development target is documented as `dev`.

## Ruleset — `dev`

- [ ] Require pull request before merging.
- [ ] Require status check `CI / CI gate`.
- [ ] Require conversation resolution.
- [ ] Block force pushes.
- [ ] Block deletion.
- [ ] Require linear history where available.
- [ ] Require signed commits only if the team can apply the policy consistently.
- [ ] Do not require an approving reviewer while the project has only one qualified contributor.

## Ruleset — `main`

- [ ] Require pull request before merging.
- [ ] Require status check `CI / CI gate`.
- [ ] Require conversation resolution.
- [ ] Block force pushes.
- [ ] Block deletion.
- [ ] Require linear history where available.
- [ ] Normal PRs into `main` originate from `dev` (also enforced by CI).
- [ ] Add at least one required approval when a second qualified reviewer is available.

## Merge settings

- [ ] Squash merge enabled.
- [ ] Merge commits disabled unless an explicit operational need appears.
- [ ] Automatically delete head branches after merge if appropriate.

## Environments

Create:

- [ ] `staging`
- [ ] `production`

### Staging

- [ ] Deployment source restricted to the release workflow from `main`.
- [ ] Staging secrets/variables are separate from production.
- [ ] No production credentials are reused.

### Production

- [ ] Required reviewer configured when a second operator/reviewer is available.
- [ ] Deployment source restricted to the production release workflow/tags.
- [ ] Production secrets are environment-scoped.
- [ ] Manual approval is required before production deployment.

## Security

- [ ] Secret scanning enabled.
- [ ] Dependency alerts enabled.
- [ ] Dependabot configuration enabled.
- [ ] Code scanning enabled when the security workflow is introduced.
- [ ] Private vulnerability reporting enabled if the repository is public.

## Required CI evidence

Before enabling `CI / CI gate` as a required check, open a test pull request into `dev` and confirm these jobs execute successfully:

```text
CI / Validate PR source
CI / Repository policy
CI / API and Web
CI / Mobile
CI / Database
CI / CI gate
```

Then open a test `dev → main` pull request and verify the source-branch rule passes. A non-`dev` pull request into `main` must fail `Validate PR source`.

## Project board

Use:

```text
Backlog
Ready
In Progress
In Review
Blocked
Done
```

## Milestones

- [ ] M0 Repository and CI.
- [ ] M1 Identity and Tenancy.
- [ ] M2 Catalog and Barcode.
- [ ] M3 Pricing.
- [ ] M4 Offline Sync.
- [ ] M5 Family Pricing MVP.
- [ ] M6 Sales and Payments.
- [ ] M7 Purchasing and Inventory.
- [ ] M8 Web Admin and Reports.
- [ ] M9 Family Production Pilot.
- [ ] M10 AI Invoice Extraction.
- [ ] M11 Security/Performance Hardening.
- [ ] M12 Production v1.0.
- [ ] M13 Portfolio Release.
- [ ] M14 SaaS Beta.
