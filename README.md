# Thiệp Cưới Online — Minh & Lan

Thiệp mời cưới một trang, phong cách cute pastel. React + Vite + Tailwind + Framer Motion, deploy miễn phí trên Vercel.

**Production:** https://maedayohsuke-giahan.site

## Tính năng

- Mở thiệp + nhạc nền (user gesture)
- Đếm ngược ngày cưới
- Lời mời & chi tiết sự kiện
- Bản đồ Google Maps + chỉ đường
- Form RSVP & sổ lời chúc → **Google Sheets**
- **Link cá nhân** cho từng khách (`/ban-a`, `/co-lan`, ...)
- OG meta cho share Zalo/Facebook

## Bắt đầu nhanh

```bash
npm install
npm run dev
```

Mở http://localhost:5173

## Đổi nội dung thiệp

Chỉnh file **`src/data/wedding.config.ts`** — tên, ngày giờ, địa điểm, lời mời, v.v.

## Link mời cá nhân

Chỉnh danh sách khách trong **`src/data/guests.config.ts`**:

```typescript
{ slug: 'ban-a', displayName: 'Bạn A', fullName: 'Nguyễn Văn A' },
```

Link gửi cho khách:

```
https://maedayohsuke-giahan.site/ban-a
https://maedayohsuke-giahan.site/co-lan
```

- Mở thiệp hiện **"Gửi tới Bạn A"**
- Form RSVP / lời chúc **tự điền tên**
- Slug chưa có trong danh sách vẫn hoạt động (tự format từ URL, vd. `/chi-pu` → "Chi Pu")

Thay ảnh & nhạc:

- `public/images/hero.jpg` (hoặc cập nhật path trong config)
- `public/images/og-image.jpg` — ảnh preview khi share
- `public/music/wedding-song.mp3` — nhạc nền

## Google Sheets (RSVP & lời chúc)

Xem hướng dẫn chi tiết: [`google-apps-script/README.md`](google-apps-script/README.md)

Tóm tắt:

1. Tạo Google Sheet + dán code từ `google-apps-script/Code.gs`
2. Chạy `setupSheets()` → Deploy Web app (Anyone)
3. Thêm vào `.env`:

```env
VITE_GOOGLE_SHEETS_URL=https://script.google.com/macros/s/XXXX/exec
```

4. Trên Vercel: thêm cùng biến môi trường → Redeploy

Không có URL → **demo mode** (form vẫn hoạt động, dữ liệu không lưu).

Dữ liệu khách nằm trong Sheet — tab **RSVP** và **Loi_chuc**.

## Deploy Vercel

1. Push repo lên GitHub
2. Import trên [vercel.com](https://vercel.com)
3. Thêm `VITE_GOOGLE_SHEETS_URL`
4. Deploy

```bash
npm run build
npm run preview
```

## Cấu trúc

```
src/data/wedding.config.ts    # Nội dung thiệp
src/lib/sheets.ts             # Gửi/đọc Google Sheets
google-apps-script/Code.gs    # Script gắn vào Sheet
```
