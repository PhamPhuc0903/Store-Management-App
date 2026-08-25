# Contributing to StoreManagementApp

## 1. Quy trình làm việc

1. Chọn hoặc tạo một issue.
2. Xác nhận acceptance criteria.
3. Đồng bộ `dev` và tạo feature/fix branch từ `dev`.
4. Viết code và test.
5. Cập nhật tài liệu liên quan.
6. Mở pull request.
7. Chờ CI và code review.
8. Squash merge sau khi được phê duyệt.

## 2. Quy ước branch

```text
feat/<issue-number>-<short-description>
fix/<issue-number>-<short-description>
chore/<issue-number>-<short-description>
docs/<issue-number>-<short-description>
refactor/<issue-number>-<short-description>
security/<issue-number>-<short-description>
```

Ví dụ:

```text
feat/42-store-membership
fix/87-price-version-conflict
```

Không phát triển trực tiếp trên `dev` hoặc `main`. Development PR nhắm `dev`; release promotion chỉ đi `dev → main`.

## 3. Conventional commits

Sử dụng:

```text
feat:
fix:
docs:
refactor:
test:
chore:
ci:
perf:
security:
```

Ví dụ:

```text
feat(pricing): add price history model
fix(sync): prevent duplicate outbox submission
```

## 4. Pull request

Pull request phải:

- Liên kết tới issue.
- Mô tả phạm vi thay đổi.
- Ghi rõ cách kiểm thử.
- Cập nhật ảnh hoặc video nếu thay đổi UI.
- Nêu migration hoặc breaking change.
- Không chứa secret hoặc dữ liệu thật.
- Đạt Definition of Done phù hợp.

## 5. Database

- Không sửa schema production thủ công.
- Mọi thay đổi phải có migration.
- Migration phải chạy được trên database sạch.
- RLS policy mới phải có test tenant isolation.
- Không xóa dữ liệu nghiệp vụ bất biến; sử dụng reversal khi phù hợp.

## 6. Security

Báo cáo vấn đề bảo mật theo `SECURITY.md`.
Không tạo public issue cho lỗ hổng chưa được xử lý.

## 7. Tài liệu

Architecture decision quan trọng phải có ADR.
Nếu thay đổi một quyết định đã được baseline, tạo ADR mới thay vì sửa lịch sử ADR cũ.
