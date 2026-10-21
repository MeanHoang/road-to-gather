# Nhiệm vụ: dựng mockup UI Road to Gather

Bạn nhận toàn quyền triển khai mockup trong project mới này. Người dùng yêu cầu mở project Orca và chạy prompt dựng UI, không chỉ viết kế hoạch. Hãy triển khai, chạy dev server và kiểm tra bằng browser; không chờ hỏi lại các lựa chọn thiết kế thông thường.

## Sản phẩm

Tên project: road-to-gather. Tên giao diện: “Lên kế hoạch”. Công cụ tiếng Việt cho nhóm bạn lên kế hoạch nhiều chuyến đi chơi/sự kiện trong tương lai. Không phải phần mềm quản lý dự án công việc. Mỗi sự kiện có khảo sát, phương án, thành viên, chi phí và khoản thu riêng.

## Trải nghiệm cần dựng

- Trang tổng quan nhiều sự kiện: sắp tới, đang khảo sát, đã chốt, đang thu tiền, hoàn tất. Tạo được sự kiện mới và mở từng sự kiện.
- Chi tiết sự kiện có tiến trình: Ý tưởng → Khảo sát → Chốt phương án → Chi phí → Thu tiền. Có tên, ngày, địa điểm, thành viên và ngân sách dự kiến.
- Khảo sát tương tác về ngày rảnh, địa điểm, mức chi và số người tham gia. Tạo/sửa câu hỏi, xem biểu quyết và mô phỏng trả lời của thành viên. Nếu có link chia sẻ chỉ hỗ trợ mockup, ghi rõ phạm vi; không giả là đã gửi khảo sát thật.
- So sánh các phương án bằng số phiếu, lịch, địa điểm và chi phí; chọn và chốt một phương án. Thay đổi dự kiến sau khi chốt phải được hiển thị rõ.
- Dự toán/chi phí: thêm khoản thuê xe, ăn uống, vé, lưu trú; nhập số tiền VND và người chịu khoản đó; tính tổng và chia tiền theo số người tham gia. Kiểm tra số âm, đầu vào rỗng và chia cho 0; giữ tổng phân bổ khớp tổng chi phí khi làm tròn.
- Theo dõi thu tiền: từng người phải đóng, đã đóng, còn thiếu; hỗ trợ đóng nhiều lần; thanh tiến độ và lịch sử thu. Phân biệt thao tác ghi nhận thủ công với giao dịch ngân hàng thật. Không tích hợp chuyển khoản hay tự xác minh thanh toán ở mockup.
- Chat AI là cách điều phối chính, không có dashboard admin riêng. Chat nằm cùng ngữ cảnh sự kiện, có gợi ý như “Tạo khảo sát ngày đi”, “Tóm tắt kết quả”, “Chốt phương án nhiều phiếu nhất”, “Chia đều chi phí”, “Ai còn thiếu tiền?”. Mô phỏng phản hồi có hành động thật lên dữ liệu mock; thay đổi chốt phương án hay ghi nhận tiền có bản xem trước và nút xác nhận. Gắn nhãn AI mô phỏng, không gọi dịch vụ AI thật và không gửi tin cho người bên ngoài.

## Thiết kế

Ưu tiên mobile, nhưng desktop cũng đẹp. Phong cách vui vẻ, gọn và ấm, như công cụ của nhóm bạn; tránh cảm giác bảng quản trị doanh nghiệp. Chọn một hệ màu rõ ràng và typography dễ đọc; dùng tiếng Việt có dấu nhất quán. Có empty state, trạng thái chưa trả lời khảo sát, chưa có chi phí, chưa thu tiền. Tất cả nút chính phải hoạt động; responsive và keyboard focus dùng được.

Dữ liệu mẫu: ít nhất ba sự kiện ở các giai đoạn khác nhau, ví dụ Đà Lạt cuối tuần, BBQ bờ sông, sinh nhật nhóm; tên và số liệu hư cấu. Dữ liệu sự kiện phải tách biệt, lưu localStorage để reload không mất và có cách khôi phục mẫu.

## Kỹ thuật và backend

Chọn stack React đơn giản phù hợp một project mới, ví dụ Vite + React. Không sao chép mã hay cấu hình Firebase/secrets từ road-to-toeic-900 hoặc repo khác. Đọc các skill/hướng dẫn áp dụng theo môi trường của bạn trước khi dùng tool.

Firestore là backend mục tiêu. Tách data adapter khỏi UI để nối Firestore sau; ghi ngắn mô hình groups/events/members/surveys/options/responses/expenses/payments và cách giới hạn truy cập theo thành viên nhóm. Giai đoạn này không cần cloud project/credentials và không chặn mockup vì thiếu chúng. Không mở rules public để tiện demo. Không cần trang admin riêng. Không cần LangChain hoặc framework agent ở giai đoạn mô phỏng.

## Hoàn tất

Cài dependency, triển khai UI, chạy build và kiểm tra các luồng chính, đặc biệt chuyển sự kiện, khảo sát, chốt, tính tiền và nhiều lần thu. Dùng browser xem desktop/mobile nếu có thể. Nếu web fetching/Playwright bị chặn, dùng browser tích hợp Orca sau khi đọc guide phù hợp. Khởi chạy dev server ở port trống, mở preview trong đúng workspace Orca và báo URL thực tế. Cập nhật README với lệnh chạy, những gì đã hoạt động và giới hạn AI/Firestore hiện tại. Không deploy public, không push remote. Kết thúc bằng kết quả kiểm tra và URL để người dùng xem mockup.
