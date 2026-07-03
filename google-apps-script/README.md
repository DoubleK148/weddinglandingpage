# Hướng dẫn Google Sheets

Dữ liệu RSVP và lời chúc sẽ lưu vào **Google Sheet** của bạn.

## Bước 1 — Tạo Sheet

1. Vào [Google Sheets](https://sheets.google.com) → **Tạo bảng tính mới**
2. Đặt tên ví dụ: `Thiệp cưới - Minh & Lan`

## Bước 2 — Gắn Apps Script

1. Trong Sheet: **Extensions** → **Apps Script**
2. Xóa code mặc định, dán toàn bộ nội dung file [`Code.gs`](./Code.gs)
3. **Save** (Ctrl+S)
4. Chọn hàm `setupSheets` → **Run** → cho phép quyền Google
5. Quay lại Sheet — sẽ có 2 tab: **RSVP** và **Loi_chuc**

## Bước 3 — Deploy Web App

1. Apps Script → **Deploy** → **New deployment**
2. Loại: **Web app**
3. **Execute as:** Me
4. **Who has access:** Anyone
5. **Deploy** → copy **Web app URL** (dạng `https://script.google.com/macros/s/.../exec`)

## Bước 4 — Cấu hình thiệp

**Local** — tạo file `.env`:

```env
VITE_GOOGLE_SHEETS_URL=https://script.google.com/macros/s/XXXX/exec
```

**Vercel** — Environment Variables:

| Tên | Giá trị |
|-----|---------|
| `VITE_GOOGLE_SHEETS_URL` | URL Web app ở bước 3 |

Sau đó **Redeploy** project.

## Xem dữ liệu khách

| Tab | Nội dung |
|-----|----------|
| **RSVP** | Họ tên, SĐT, số người, có/không đến, lời nhắn |
| **Loi_chuc** | Tên, lời chúc, cột **Hiển thị** |

**Ẩn lời chúc trên web:** đổi cột **Hiển thị** thành `Không`.

## Chia sẻ Sheet

Google Sheet → **Share** → thêm email người cần xem RSVP.
