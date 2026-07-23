# StoreManagementApp — 30-day Initial Backlog

## Objective

Kết thúc 30 ngày đầu phải có một vertical slice chạy được:

```text
Đăng nhập
→ Tạo cửa hàng
→ Mời thành viên
→ Staff đăng nhập
→ Staff chỉ thấy đúng cửa hàng
```

## Epic E0 — Project initiation

### E0-01 Create repository governance

**Acceptance criteria**

- README, CONTRIBUTING, SECURITY và CHANGELOG tồn tại.
- Pull request và issue templates hoạt động.
- Branch protection checklist được hoàn thành.

### E0-02 Configure project board

**Acceptance criteria**

- Có các trạng thái Backlog, Ready, In Progress, In Review, Blocked và Done.
- Các milestone M0–M11 được tạo.
- Các label chuẩn được tạo.

### E0-03 Baseline documentation

**Acceptance criteria**

- Project Charter và Technical Architecture được lưu trong repository.
- Sơ đồ architecture được lưu trong `docs/baseline`.
- Thay đổi lớn yêu cầu ADR.

## Epic E1 — Monorepo foundation

### E1-01 Initialize Flutter application

- Flutter project chạy trên Android emulator.
- Riverpod và go_router được cấu hình.
- Có health/demo screen.

### E1-02 Initialize Next.js application

- TypeScript strict mode.
- Lint và build thành công.
- Có health/demo page.

### E1-03 Initialize NestJS API

- `/api/v1/health` trả trạng thái thành công.
- Validation, error filter và structured logging được thiết lập.
- Swagger hoạt động.

### E1-04 Configure Supabase local

- `supabase start` chạy thành công.
- Database có migration và seed ban đầu.
- Có tài liệu reset database.

### E1-05 Configure root developer commands

- `make bootstrap`.
- `make dev`.
- `make test`.
- `make stop`.

## Epic E2 — Continuous integration

### E2-01 CI for mobile

- Format.
- Analyze.
- Unit test.

### E2-02 CI for API and Web

- Lint.
- Type-check.
- Unit test.
- Build.

### E2-03 CI for database

- Start Supabase containers.
- Apply migrations.
- Run database tests.
- Stop containers.

## Epic E3 — Identity and tenancy vertical slice

### E3-01 User profile model

### E3-02 Organization and store model

### E3-03 Store membership model

### E3-04 Owner creates store

### E3-05 Owner invites staff

### E3-06 Staff accepts invitation

### E3-07 Store selection on mobile

### E3-08 Tenant isolation tests

### E3-09 Device registration foundation

### E3-10 Audit log foundation

## Sprint plan

### Sprint 1 — Days 1–14

Goal: repository, monorepo skeleton và local platform.

- E0-01
- E0-02
- E0-03
- E1-01
- E1-02
- E1-03
- E1-04
- E1-05

### Sprint 2 — Days 15–28

Goal: CI và identity/tenancy vertical slice.

- E2-01
- E2-02
- E2-03
- E3-01
- E3-02
- E3-03
- E3-04
- E3-07
- E3-08

### Days 29–30

- Demo.
- Bug fixing.
- Documentation.
- Retrospective.
- Prepare Sprint 3 backlog.
