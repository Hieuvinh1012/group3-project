# Group3 Project

## Mô tả dự án

Group3 Project là một ứng dụng web mẫu được chia thành hai phần chính: Frontend (giao diện người dùng) và Backend (API & logic server). Mục tiêu của dự án là minh họa cách xây dựng một ứng dụng CRUD cơ bản với cấu trúc rõ ràng, dễ mở rộng và dễ triển khai.

Ứng dụng cho phép quản lý người dùng (tạo, đọc, cập nhật, xóa) và được thiết kế để làm nền tảng cho các bài tập nhóm, demo hoặc triển khai nhỏ.

## Kiến trúc & công nghệ

- Frontend:
	- React (Create React App)
	- HTML, CSS
	- Các component nằm trong thư mục `frontend/src/component` (ví dụ: `AddUser.jsx`, `UserList.jsx`)
- Backend:
	- Node.js, Express
	- Các file server và route trong thư mục `backend/` (ví dụ: `server.js`, `routes/user.js`, `controllers/userController.js`)
	- Mô hình dữ liệu có thể nằm trong `backend/models` (ví dụ: `User.js`)

## Yêu cầu hệ thống

- Node.js (>= 14.x recommended)
- npm hoặc yarn

## Hướng dẫn cài đặt & chạy

1. Clone repository:

```bash
git clone <repository-url>
cd Group3-project
```

2. Cài đặt và chạy Backend:

```bash
cd backend
npm install
npm run dev
```

Backend mặc định chạy ở cổng 3001.

3. Cài đặt và chạy Frontend:

```bash
cd frontend
npm install
npm start
```

Frontend chạy ở cổng 3000 (Create React App sẽ hỏi nếu cổng bận). Mở trình duyệt vào `http://localhost:3000` hoặc cổng được hiển thị.

## Cấu trúc thư mục (tóm tắt)

- backend/
	- server.js — Entrypoint của server
	- routes/ — Định nghĩa routes
	- controllers/ — Logic xử lý request
	- models/ — Mô hình dữ liệu
- frontend/
	- src/ — Mã nguồn React
	- public/ — Tệp tĩnh

## Đóng góp của từng thành viên

- Thanh Sơn — Cơ sở dữ liệu & mô hình dữ liệu, định nghĩa `User` model và logic liên quan đến lưu trữ.
- Hiếu Vinh — Frontend: Thiết kế giao diện, component React, và tương tác với API.
- Lâm Kha — Backend: Thiết lập server Express, routes, controller và tích hợp API.

> Ghi chú: Nếu bạn muốn chỉnh sửa phần nào trong dự án, vui lòng tạo branch mới theo chuẩn `feature/<mô-tả>` và gửi pull request. Mỗi PR nên kèm mô tả ngắn, checklist kiểm tra và nếu có, ảnh chụp màn hình.

## Hướng dẫn đóng góp nhanh

1. Tạo branch mới: `git checkout -b feature/ten-tinh-nang`
2. Commit các thay đổi rõ ràng: `git commit -m "feat: thêm ..."`
3. Đẩy branch lên remote và mở Pull Request.

## License

Tùy theo quy ước nhóm — thêm file `LICENSE` nếu cần.

---

Cập nhật bởi nhóm Group3.
