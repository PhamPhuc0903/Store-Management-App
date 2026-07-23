# GitHub Setup Checklist

## Repository

- [ ] Tạo repository.
- [ ] Chọn visibility phù hợp.
- [ ] Upload source scaffold.
- [ ] Thiết lập description và topics.
- [ ] Bật Discussions nếu cần.

## Branch protection cho `main`

- [ ] Require pull request before merging.
- [ ] Require status checks.
- [ ] Require conversation resolution.
- [ ] Block force pushes.
- [ ] Block deletion.
- [ ] Require signed commits nếu đội có khả năng áp dụng.
- [ ] Require linear history.

## Environments

Tạo:

- [ ] staging
- [ ] production

Production:

- [ ] Required reviewer.
- [ ] Deployment branch chỉ từ tag/release workflow.
- [ ] Secrets được cấu hình riêng.

## Security

- [ ] Secret scanning.
- [ ] Dependency alerts.
- [ ] Code scanning khi pipeline sẵn sàng.
- [ ] Private vulnerability reporting nếu repository public.

## Project board

Tạo các cột:

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
- [ ] M1 Auth, tenancy and permissions.
- [ ] M2 Catalog and barcode.
- [ ] M3 Price books and history.
- [ ] M4 Offline synchronization.
- [ ] M5 Family Pricing MVP.
- [ ] M6 Sales and payments.
- [ ] M7 Purchasing and inventory.
- [ ] M8 Web Admin and reports.
- [ ] M9 Family Production Pilot.
- [ ] M10 AI invoice extraction.
- [ ] M11 Production v1.0.
