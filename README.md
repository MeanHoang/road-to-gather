# Road to Gather — Mình đi đâu tiếp?

Trang tiếng Việt giúp nhóm bạn khám phá Hà Giang / Đà Nẵng dịp **Tết Dương lịch 2027**, xem kế hoạch, chi phí và trả lời khảo sát. Không yêu cầu đăng nhập, có trang tổng kết tại `/tong-ket` không cần khóa truy cập, không có chat AI.

## Chạy local

```sh
npm install
npm run dev -- --port 5173
npm run build
npm test
npm run test:browser
node tests/motion.mjs
node tests/viewport-states.mjs
```

Vite + React, lucide-react, Firebase Web SDK. Node 22. Các kiểm tra browser dùng Chrome cài trên máy (`channel: 'chrome'`). Preview: **http://localhost:5173/**, mở trong workspace Road to Gather ở Orca. Repository: https://github.com/MeanHoang/road-to-gather. Chưa deploy website.

## Trải nghiệm hiện tại

- 8 cảnh tràn toàn bộ viewport, menu đè phía trên, không cuộn trang hoặc cuộn trong nội dung. Lăn chuột, vuốt, phím mũi tên hoặc nút/chấm điều hướng để đổi cảnh. Trên form, wheel không làm mất cảnh đang trả lời.
- Dòng chữ chào chạy vào lúc mở trang. Chuyển cảnh gồm thu nhỏ thành thẻ bo góc, mở vòng tròn, lật mở, nâng thẻ và chuyển lớp mờ; ảnh và chữ vào theo nhịp riêng. Có chế độ `prefers-reduced-motion`.
- Lịch trình chọn tab từng ngày, ảnh chính + postcard đổi theo ngày. Chi phí chia trang 5 khoản; phần tham khảo chia 3 tab. Mobile trang hai điểm đến hiện từng điểm qua tab; quiz chia 5 bước để vừa màn hình.
- Quiz hỏi điểm đến, ngân sách, **phương tiện (xe khách / xe máy / linh hoạt)**, ngày bắt đầu/kết thúc và tên/lời nhắn/đồng ý chia sẻ (không email). Có kiểm tra đầu vào, trạng thái lỗi/đang gửi/thành công và lưu bản nháp khi reload.
- Thiếu Firebase config: nút và thông báo ghi rõ **lưu trên máy, chưa gửi cho nhóm**. Không hiển thị số phiếu hoặc người tham gia giả.

## Kế hoạch và giả định

**Ba ngày vui chơi 01–03/01/2027, hai đêm lưu trú**, cộng thời gian đi xe khách: dự kiến khởi hành Hà Nội tối 31/12 và về Hà Nội ngày 04/01. Không gọi đây là toàn bộ hành trình chỉ kéo dài ba ngày. Lịch xe cụ thể cần xác nhận với nhà xe.

- **Hà Giang:** ngày 1 Quản Bạ – Yên Minh, ngày 2 Lũng Cú – Đồng Văn, ngày 3 Mã Pí Lèng rồi về TP. Hà Giang. Dự toán **2.600.000đ/người** gồm xe khách, thuê xe máy ghép 2 người/xe, xăng, 2 đêm phòng, ăn, tham quan và dự phòng lễ. Đi chung xe cần tính lại; chưa gồm thuyền Nho Quế, phòng đơn hoặc chi phí tới Hà Nội.
- **Đà Nẵng:** ngày 1 đến nơi – Mỹ Khê – sông Hàn, ngày 2 **Sơn Trà / Linh Ứng / An Thượng**, ngày 3 Ngũ Hành Sơn hoặc chợ Hàn và về bằng xe khách. Dự toán **2.600.000đ/người** gồm xe khách, thuê xe máy, xăng, phòng ghép 2 người, ăn,  tham quan khác và dự phòng lễ. Phương án Bà Nà / Cầu Vàng tùy chọn là **3.625.000đ/người**, vượt ngân sách 2–3 triệu; vé năm 2026 tạm tính 1 triệu, cần xác nhận lại cho 2027. Chưa gồm buffet, phòng đơn và chi tiêu cá nhân.

Các giá xe, phòng, xăng, ăn và dự phòng là **ngân sách tự phân bổ để thảo luận**, chưa phải báo giá xác nhận dịp 01–03/01/2027. Tự chạy xe máy toàn tuyến từ Hà Nội, đặc biệt đi Đà Nẵng, cần lịch dài hơn; sẽ bàn lại sau khảo sát. Thời tiết là lưu ý theo mùa, không phải dự báo ngày cụ thể.

## Nguồn và thiết kế

Nội dung đã đối chiếu ngày 21/10/2026; liên kết có ngay trong màn tham khảo:

- [Vietnam Tourism — Hà Giang](https://vietnam.travel/places-to-go/northern-vietnam/ha-giang), [Đà Nẵng](https://vietnam.travel/places-to-go/south-central-coast-central-highlands/da-nang), [gợi ý ba ngày](https://vietnam.travel/things-to-do/da-nang-itinerary): thông tin điểm đến, thời tiết và gợi ý hoạt động. Lịch trên trang là phương án tự sắp xếp, không sao chép hoặc đặt tour của nguồn.
- [Easy Go — Hà Giang dịp lễ 2026](https://www.easygo.com.vn/tour-du-lich-tet-ha-noi-ha-giang-3-ngay-2-dem): tham khảo tuyến điểm và giá tour đoàn năm trước; không dùng làm báo giá 2027.
- [Sun World — bảng giá Bà Nà Hills 2026](https://sunworld.vn/vi/banahills/tin-tuc-sunworld/bang-gia-ve-va-dich-vu-tai-sun-world-ba-na-hills-nam-2026-19796): vé người lớn ngoại tỉnh công bố 1 triệu, có cáp treo và Cầu Vàng, không gồm buffet. Cần xác nhận lại giá/quyền lợi năm 2027; không áp dụng ưu đãi U25 hết hạn năm 2026.

Ảnh trong `public/images` lấy từ Vietnam Tourism, có ghi nguồn; dùng cho bản thử nghiệm. Cần kiểm tra quyền sử dụng ảnh trước khi xuất bản. Thiết kế tham khảo [Awwwards](https://www.awwwards.com/websites/sites_of_the_month/) và cách trình bày ảnh/typography toàn màn của [ERA Residence](https://www.era-residence.com/); không lấy mã hay tài sản hình ảnh của ERA.

## Kết nối Firestore

1. Tạo Firebase project/Web app và Firestore bằng tài khoản của người tổ chức.
2. Copy `.env.example` thành `.env.local`, điền 4 giá trị web config của project này, khởi động lại Vite. Không dùng service account/private key trong frontend.
3. Xem và áp dụng `firestore.rules` cho project phù hợp trước khi thu câu trả lời thật. Project `road-to-fb773` đã kết nối và áp dụng rules trong phiên làm việc này.
4. Adapter `src/adapter.js` gửi `setDoc` tới `tripResponses/{uuid}`, dùng server timestamp; UI chỉ báo đã gửi sau khi Firestore xác nhận. Xem tổng hợp ở `/tong-ket`; server cần `RTG_SERVICE_ACCOUNT_PATH` để đọc dữ liệu.

Model (version 3): `destination`, `budget`, `transport`, `startDate`, `endDate`, `name`, `note`, `consent`, `version`, `createdAt`. Rules chỉ cho phép tạo đúng cấu trúc, enum và độ dài; khách không được đọc danh sách, sửa hoặc xóa câu trả lời. Không mở toàn bộ database. UUID giữ nguyên trong mỗi lần mở trang để hạn chế gửi trùng khi bấm lại, nhưng khảo sát không định danh không đảm bảo một phiếu/người.

Khi đưa lên môi trường thật cần App Check/enforcement hoặc endpoint có rate limit để hạn chế spam, và thống nhất thời gian lưu dữ liệu liên hệ. Đã kiểm thử gửi thật lên Firestore và đọc tổng kết; dữ liệu kiểm thử được xóa sau kiểm tra.

## Kiểm tra

- `npm test`: tổng chi phí, ngày bắt đầu và validation, gồm phương tiện bắt buộc.
- `npm run test:browser`: 8 cảnh trên 4 độ rộng, Cầu Vàng, chi phí, đủ 5 bước quiz, validation tên/ngày, lưu và tải lại phương tiện, menu mobile, không có lỗi runtime.
- `tests/motion.mjs`: wheel thật chuyển cảnh trong khi `window.scrollY === 0`, điều hướng và form với chế độ giảm chuyển động.
- `tests/viewport.mjs` và `tests/viewport-states.mjs`: kích thước nội dung, từng tab ngày, trang chi phí, tab tham khảo, bước quiz và lỗi validation phải vừa viewport, không cắt nút.

## Trang tổng kết không cần đăng nhập

Mở `/tong-ket` để xem thống kê, danh sách câu trả lời và xuất CSV ngay, không cần khóa hoặc cookie phiên. Khi có Firebase config, API `/api/owner-results` đọc Firestore bằng service account trên server (`RTG_SERVICE_ACCOUNT_PATH`); khóa bí mật không đưa xuống frontend. Ai truy cập trang tổng kết cũng xem được danh sách và lời nhắn qua CSV. Firestore vẫn chặn đọc trực tiếp từ client. API dùng chung cho Vite dev server và Vercel Function tại `api/owner-results.js`.


## Vercel

Firebase Web config công khai có sẵn trong `src/firebase-config.js`, nên clone/build vẫn gửi được lên đúng project. Có thể ghi đè bằng bốn biến `VITE_FIREBASE_*` trong `.env.example`; thay đổi biến cần redeploy.

Để `/tong-ket` đọc dữ liệu trên Vercel: vào Project → Settings → Environment Variables, tạo **`RTG_SERVICE_ACCOUNT_JSON`** với Value là toàn bộ nội dung JSON service account, chọn Production rồi redeploy. Đây là biến server-only, tuyệt đối không thêm tiền tố `VITE_` và không commit file JSON. Đường dẫn local `RTG_SERVICE_ACCOUNT_PATH` không tồn tại trên Vercel.

`vercel.json` phục vụ route `/tong-ket` qua ứng dụng React; `/api/owner-results` chạy Vercel Function riêng. Trang tổng kết không yêu cầu đăng nhập theo lựa chọn của chủ nhóm.
