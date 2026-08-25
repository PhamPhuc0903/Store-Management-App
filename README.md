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

**Sprint 2 — Identity and Tenancy foundation**

Foundation hiện đã có:

- Monorepo cho NestJS API, Next.js Admin Web và Flutter Android.
- CI cho API/Web, Mobile và Supabase/PostgreSQL.
- Protected `dev → main` release flow và ADR-017.
- Supabase local foundation và automated database validation.
- Android debug build verification trong CI.
- Baseline Project Charter, Technical Architecture, roadmap và 30-day backlog.

Increment hiện tại triển khai M1 với `profiles`, `organizations`, `stores`, roles/permissions,
`store_memberships` và tenant-isolation tests trước Auth/Tenancy API vertical slice.

## Tài liệu

- [Project Governance](docs/project-governance.md)
- [30-day Backlog](docs/product/30-day-backlog.md)
- [Definition of Done](docs/engineering/definition-of-done.md)
- [Branching and Release Policy](docs/engineering/branching-release-policy.md)
- [Architecture Decision Records](docs/adr/README.md)
- [Baseline documents](docs/baseline/README.md)
- [Identity and Tenancy Foundation](docs/engineering/identity-tenancy-foundation.md)

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


## Monorepo

```text
apps/api          NestJS API
apps/admin-web    Next.js Web Admin
apps/mobile       Flutter Mobile
packages          Shared TypeScript contracts
supabase          PostgreSQL migrations and local platform
```

## Chạy local

Bootstrap dependencies từ repository root:

```bash
make bootstrap
```

Hoặc chạy trực tiếp `npm ci` và `flutter pub get` theo hướng dẫn local development.

Khởi động Supabase, API và Admin Web:

```bash
npm run db:start
npm run dev
```

Chạy Flutter trong terminal riêng:

```bash
cd apps/mobile
flutter run
```

Chi tiết: [Local Development](docs/engineering/local-development.md)
