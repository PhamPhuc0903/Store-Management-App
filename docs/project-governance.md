# Project Governance

## Baseline

Các tài liệu sau là baseline của dự án:

- Project Charter Final v2.0.
- Technical Stack and System Architecture Final v2.0.
- Implementation Roadmap v1.0.

Thay đổi ảnh hưởng vision, phạm vi, tech stack hoặc architecture phải có Change Request và ADR.

## Vai trò

| Vai trò | Trách nhiệm |
|---|---|
| Project Sponsor | Phê duyệt mục tiêu, ngân sách và go-live |
| Product Owner | Ưu tiên backlog và nghiệm thu |
| Tech Lead | Architecture, security và engineering quality |
| Developer | Triển khai, test, review và tài liệu |
| QA | Test strategy, regression và release verification |
| Pilot Representative | Xác nhận quy trình thực tế tại cửa hàng |

Một người có thể đảm nhiệm nhiều vai trò trong giai đoạn dự án cá nhân.

## Decision model

### Product decision

Product Owner quyết định:

- Ưu tiên nghiệp vụ.
- Acceptance criteria.
- Phạm vi release.
- Go-live readiness.

### Technical decision

Tech Lead quyết định:

- Module boundary.
- API contract.
- Database design.
- Security control.
- CI/CD và deployment.

### Major change

Major change cần:

1. Change Request.
2. Impact analysis.
3. ADR.
4. Product Owner và Tech Lead phê duyệt.
5. Cập nhật baseline.

## Meeting cadence

- Sprint Planning: đầu sprint.
- Backlog Refinement: một lần mỗi sprint.
- Demo: cuối sprint.
- Retrospective: cuối sprint.
- Architecture Review: khi có ADR lớn.
- Pilot Review: hằng tuần trong giai đoạn pilot.

## Accepted delivery-process decision — ADR-017

From 2026-08-20, repository delivery uses `dev` as the protected integration branch and `main` as the protected release-candidate branch.

- Normal work: short-lived branch → PR → `dev`.
- Release promotion: `dev` → PR → `main`.
- Staging: sourced from `main` when staging infrastructure is provisioned.
- Production: release tag + verified staging candidate + manual approval.

Release identity and database rollback rules are defined in `docs/engineering/branching-release-policy.md` and ADR-017.
