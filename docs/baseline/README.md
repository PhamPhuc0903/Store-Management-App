# Baseline Documents

Thư mục này chứa các tài liệu đã được chốt trước khi bắt đầu triển khai:

- Project Charter Final v2.0.
- Technical Stack and System Architecture Final v2.0.
- Implementation Roadmap v1.0.
- System architecture diagram.
- Offline synchronization flow.
- CI/CD deployment flow.

Các file DOCX là bản trình bày chính thức. Các quyết định kỹ thuật mới phải được ghi
thành ADR trong `docs/adr`.

Không sửa âm thầm các tài liệu baseline. Khi cần thay đổi lớn:

1. Tạo Change Request issue.
2. Tạo ADR.
3. Phê duyệt.
4. Phát hành phiên bản tài liệu baseline mới.

## Approved post-baseline changes

The original DOCX files remain immutable historical baselines. Approved changes after v2.0 are recorded through Change Request + ADR until the next consolidated baseline document revision.

- CR-001 / ADR-017 (2026-08-20): introduces protected `dev` integration branch, `dev → main` release promotion, multi-artifact release identity, and forward-only production database migration safety.

For current implementation behavior, ADR-017 and `docs/engineering/branching-release-policy.md` supersede the older branching/release-flow statements in the v2.0 baseline. The product/technology architecture remains unchanged.
