# Deployment Strategy

## Objective

Store Management App targets real users. Infrastructure decisions must optimize for:

- predictable releases
- traceability
- rollback capability
- minimal environment drift

## Branch and Environment Model

Branches:

```
feature/*
    |
    v
dev
    |
    v
main
```

Environment model:

```
                 main

                  |

        +---------+---------+

        |                   |

        v                   v

    staging            production
```

Staging and production are environments, not branches.

## Release Identity

A release is identified by:

- Git SHA
- artifact identities
- database migration state

One repository does not create one universal digest.

Example:

```
Release
 |
 +-- API artifact digest
 |
 +-- Admin Web artifact digest
 |
 +-- Mobile version/checksum
 |
 +-- Database migration head
```

## Promotion Model

Required flow:

```
main
 |
 build artifacts
 |
 staging deployment
 |
 verification
 |
 production promotion
```

Production must promote verified artifacts, not rebuild.

## Rollback

Application rollback:

```
production artifact A
        |
        v
previous verified artifact
```

Database rollback is handled separately.

Database changes must prefer:

expand
migrate
contract

for breaking changes.

## Future Workflows

Expected workflow separation:

```
.github/workflows/

ci.yml
security.yml
release.yml
deploy-staging.yml
deploy-production.yml
smoke-test.yml
```
