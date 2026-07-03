# Hướng dẫn Google Sheets

Dữ liệu RSVP và lời chúc lưu vào **Google Sheet** của bạn.

## Bước 1 — Tạo Sheet

1. [Google Sheets](https://sheets.google.com) → **Tạo bảng tính mới**
2. Đặt tên: `Thiệp cưới - Minh & Lan`

## Bước 2 — Gắn Apps Script (quan trọng)

**Phải mở Apps Script từ đúng Sheet đang xem** — không tạo project riêng.

1. Trong Sheet đó: **Extensions (Tiện ích mở rộng)** → **Apps Script**
2. Xóa code mặc định, dán toàn bộ [`Code.gs`](./Code.gs)
3. **Save** (Ctrl+S)
4. Chọn hàm **`setupSheets`** → **Run (Chạy)** → cho phép quyền

**Kiểm tra:** quay lại Sheet — phải thấy 2 tab mới:
- **RSVP**
- **Loi_chuc**

Nếu vẫn chỉ có `Trang tính1` → script chưa gắn đúng Sheet hoặc chưa chạy `setupSheets`.

## Bước 3 — Deploy Web App

1. **Deploy** → **New deployment** → **Web app**
2. **Execute as:** Me (Tôi)
3. **Who has access:** **Anyone** (Bất kỳ ai)
4. **Deploy** → copy URL `/exec`

Sau khi sửa code, luôn **New version** rồi Deploy lại.

## Bước 4 — Cấu hình Vercel

Environment variable:

```
VITE_GOOGLE_SHEETS_URL=https://script.google.com/macros/s/XXXX/exec
```

→ **Redeploy**

## Xem dữ liệu khách

| Tab | Nội dung |
|-----|----------|
| **RSVP** | Họ tên, SĐT, số người, có/không đến, lời nhắn |
| **Loi_chuc** | Tên, lời chúc, **Hiển thị** |

## Sheet vẫn trống?

1. Chạy lại **`setupSheets`** — phải thấy tab RSVP + Loi_chuc
2. Deploy lại Web app: **Anyone** + **New version**
3. Gửi thử form trên site → refresh Sheet (F5)
4. Kiểm tra Apps Script → **Executions** — có log lỗi không

## Chia sẻ Sheet

**Share** → thêm email người nhà cần xem RSVP.
