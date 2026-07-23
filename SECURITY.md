# Security Policy

## Supported versions

Trong giai đoạn phát triển, chỉ nhánh `main` và bản production mới nhất được hỗ trợ.

## Báo cáo lỗ hổng

Không mở public issue cho lỗ hổng bảo mật.

Gửi báo cáo riêng cho maintainer, bao gồm:

- Mô tả vấn đề.
- Thành phần bị ảnh hưởng.
- Các bước tái hiện.
- Tác động dự kiến.
- Bằng chứng hoặc log đã loại bỏ dữ liệu nhạy cảm.

## Dữ liệu không được commit

- Supabase service-role key.
- JWT secret.
- Access token hoặc refresh token.
- Dữ liệu khách hàng thật.
- Số điện thoại, địa chỉ hoặc công nợ thật.
- Ảnh hóa đơn thật chưa ẩn dữ liệu.
- Production database dump.
- File `.env` chứa secret.

## Nguyên tắc hệ thống

- Tenant isolation tại backend và PostgreSQL RLS.
- Least privilege.
- Idempotency cho giao dịch quan trọng.
- Audit log cho thay đổi giá, tồn kho, hóa đơn, thanh toán và quyền.
- AI không được tự ghi giao dịch nghiệp vụ.
- Secret chỉ được lưu trong secret manager hoặc GitHub Secrets.
