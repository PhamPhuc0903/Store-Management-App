# Definition of Done

Một user story được xem là hoàn thành khi:

- [ ] Acceptance criteria được đáp ứng.
- [ ] Code đã được review.
- [ ] Format, lint và type-check thành công.
- [ ] Unit test liên quan đã có và chạy thành công.
- [ ] Integration test được bổ sung khi có giao tiếp database/API.
- [ ] Authorization và tenant isolation đã được xem xét.
- [ ] Migration chạy thành công trên database sạch.
- [ ] Loading, empty và error states đã xử lý.
- [ ] Không log secret hoặc dữ liệu nhạy cảm.
- [ ] API/OpenAPI đã cập nhật.
- [ ] Tài liệu người dùng hoặc kỹ thuật đã cập nhật.
- [ ] Triển khai staging thành công.
- [ ] Product Owner hoặc đại diện pilot đã kiểm thử khi cần.

## Definition of Done bổ sung cho mobile

- [ ] Hoạt động trên thiết bị Android mục tiêu.
- [ ] Xử lý offline hoặc nêu rõ online-only.
- [ ] Không mất local data khi app bị đóng.
- [ ] Accessibility cơ bản và kích thước nút phù hợp.

## Definition of Done bổ sung cho database

- [ ] Constraint nghiệp vụ được xác định.
- [ ] Index được xem xét.
- [ ] RLS policy có test.
- [ ] Audit requirement được đáp ứng.
- [ ] Không cập nhật trực tiếp dữ liệu ledger bất biến.

## Definition of Done bổ sung cho AI

- [ ] Có human review trước write operation.
- [ ] Có confidence hoặc validation.
- [ ] Có fallback khi provider lỗi.
- [ ] Không gửi dữ liệu nhạy cảm không cần thiết.
- [ ] Có evaluation case.
