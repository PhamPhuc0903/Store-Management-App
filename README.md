# StoreManagementApp

StoreManagementApp là nền tảng quản lý và đồng bộ bảng giá dành cho cửa hàng tạp hóa,
được thiết kế theo hướng mobile-first, offline-first và multi-tenant.

## Mục tiêu trước mắt

Phát hành bản dùng thực tế cho cửa hàng gia đình, tập trung vào:

- Quản lý sản phẩm và barcode.
- Đồng bộ bảng giá trên nhiều thiết bị.
- Phân quyền Owner, Admin và Staff.
- Tra giá khi mạng yếu hoặc mất mạng.
- Lịch sử giá và audit log.

Sau khi ổn định, hệ thống sẽ mở rộng sang bán hàng, thanh toán, nhập hàng,
tồn kho, công nợ, báo cáo và AI hỗ trợ nhập liệu.

## Kiến trúc đã chốt

- Mobile: Flutter, Riverpod, Drift/SQLite.
- Web Admin: Next.js, TypeScript.
- Application Backend: NestJS, TypeScript.
- Data Platform: Supabase/PostgreSQL, Auth, Realtime và Storage.
- Local development: Docker và Supabase CLI.
- CI/CD: GitHub Actions.
- Observability: Sentry và structured logging.

## Trạng thái hiện tại

**Phase 0 — Project initiation and governance**

Bộ khung repository hiện chứa:

- Project governance.
- Contribution workflow.
- Security policy.
- Issue và pull request templates.
- Milestones và labels bootstrap script.
- Baseline Project Charter và Technical Architecture.
- ADR template.
- Backlog 30 ngày đầu.

## Tài liệu

- [Project Governance](docs/project-governance.md)
- [30-day Backlog](docs/product/30-day-backlog.md)
- [Definition of Done](docs/engineering/definition-of-done.md)
- [Branching and Release Policy](docs/engineering/branching-release-policy.md)
- [Architecture Decision Records](docs/adr/README.md)
- [Baseline documents](docs/baseline/README.md)

## Bắt đầu

1. Tạo repository GitHub mới.
2. Copy toàn bộ nội dung thư mục này vào repository.
3. Cài GitHub CLI và đăng nhập.
4. Chạy:

```bash
chmod +x scripts/bootstrap_github.sh
./scripts/bootstrap_github.sh <owner/repository>
```

5. Kiểm tra branch protection và environments theo checklist:

```text
docs/operations/github-setup-checklist.md
```

## Nguyên tắc quan trọng

- Không commit secret hoặc dữ liệu khách hàng thật.
- Mọi thay đổi schema phải đi qua migration.
- Không merge khi CI thất bại.
- Business command quan trọng phải idempotent.
- Tenant isolation phải có automated test.
- Realtime chỉ dùng để báo thay đổi; delta sync bảo đảm tính đầy đủ.
