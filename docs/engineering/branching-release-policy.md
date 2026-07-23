# Branching and Release Policy

## Branches

- `main`: luôn ở trạng thái có thể triển khai.
- Feature branches: tồn tại ngắn hạn và merge qua pull request.
- Không sử dụng long-lived develop branch trong giai đoạn đầu.

## Merge strategy

- Squash merge.
- Tối thiểu một approval khi có nhiều thành viên.
- CI bắt buộc thành công.
- Conversation phải được resolve.
- Không cho force push vào `main`.

## Versioning

Sử dụng semantic versioning:

```text
MAJOR.MINOR.PATCH
```

Giai đoạn trước Production v1.0 sử dụng:

```text
0.x.y
```

## Environments

- Local.
- Staging.
- Production.

Staging được deploy tự động khi merge `main`.
Production cần release tag và manual approval.

## Database releases

- Migration được review như code.
- Không rollback migration bằng cách chạy file down trên production.
- Dùng forward-fix.
- Migration phá vỡ tương thích phải chia theo expand-and-contract.
