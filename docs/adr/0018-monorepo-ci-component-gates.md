# ADR-018 — Monorepo Component CI Gates

## Status

Accepted

## Context

The repository contains multiple independently testable components:

- NestJS API
- Next.js Admin Web
- Flutter Mobile
- Supabase Database

Running every pipeline for every change increases feedback time and cost.

## Decision

CI uses change detection.

Each component has its own execution condition:

- API
- Admin Web
- Mobile
- Database

A final CI Gate is the only required branch protection check.

## Gate Rules

| Job Result | Gate Result |
|---|---|
| success | pass |
| skipped | pass |
| failure | fail |
| cancelled | fail |

## Consequences

Positive:

- faster PR feedback
- lower CI cost
- clear ownership boundaries

Trade-off:

- branch protection must require CI Gate instead of individual jobs.
