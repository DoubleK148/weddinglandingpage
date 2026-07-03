# Thiệp Cưới Online — Minh & Lan

Thiệp mời cưới một trang, phong cách cute pastel. React + Vite + Tailwind + Framer Motion, deploy miễn phí trên Vercel.

## Tính năng

- Mở thiệp + nhạc nền (user gesture)
- Đếm ngược ngày cưới
- Lời mời & chi tiết sự kiện
- Bản đồ Google Maps + chỉ đường
- Form RSVP & sổ lời chúc (Supabase)
- OG meta cho share Zalo/Facebook

## Bắt đầu nhanh

```bash
cd wedding-app
npm install
npm run dev
```

Mở http://localhost:5173

## Đổi nội dung thiệp

Chỉnh file **`src/data/wedding.config.ts`** — tên, ngày giờ, địa điểm, lời mời, v.v.

Thay ảnh & nhạc:

- `public/images/hero.jpg` (hoặc cập nhật path trong config)
- `public/images/og-image.jpg` — ảnh preview khi share
- `public/music/wedding-song.mp3` — nhạc nền

## Supabase (RSVP & lời chúc)

1. Tạo project miễn phí tại [supabase.com](https://supabase.com)
2. Chạy SQL trong `supabase/schema.sql`
3. Copy URL và anon key vào `.env`:

```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

4. Restart dev server

Không có `.env` → app chạy **demo mode** (form vẫn hoạt động, dữ liệu không lưu).

## Deploy Vercel

1. Push repo lên GitHub
2. [vercel.com](https://vercel.com) → Import project → Root: `wedding-app`
3. Framework: Vite
4. Thêm env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
5. Deploy

Build local:

```bash
npm run build
npm run preview
```

## Cấu trúc

```
src/
  data/wedding.config.ts   # Nội dung thiệp
  components/sections/       # Hero, Countdown, RSVP, ...
  lib/supabase.ts          # API client
```

## License

Private — dùng cho đám cưới của bạn.
