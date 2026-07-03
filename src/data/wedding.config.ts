export interface WeddingEvent {
  id: string
  title: string
  dateTime: string
  lunarDate?: string
  venueName: string
  address: string
  dressCode?: string
}

export const weddingConfig = {
  meta: {
    title: 'Thiệp Cưới — Minh & Lan',
    description:
      'Trân trọng kính mời bạn đến dự lễ thành hôn của chúng tôi. Hãy cùng chia sẻ niềm vui trong ngày trọng đại!',
    hashtag: '#MinhVaLan2026',
    ogImage: '/images/og-image.svg',
  },

  couple: {
    groom: {
      fullName: 'Nguyễn Hoàng Minh',
      nickname: 'Minh',
    },
    bride: {
      fullName: 'Trần Ngọc Lan',
      nickname: 'Lan',
    },
  },

  countdownTarget: '2026-12-20T17:00:00+07:00',

  parents: {
    groomSide: 'Ông Nguyễn Văn A & Bà Trần Thị B',
    brideSide: 'Ông Trần Văn C & Bà Lê Thị D',
  },

  invitation: {
    greeting: 'Trân trọng kính mời',
    message: [
      'Chúng tôi vô cùng hạnh phúc khi được chia sẻ ngày trọng đại cùng những người thân yêu.',
      'Sự hiện diện và lời chúc phúc của bạn sẽ làm ngày vui của chúng tôi thêm trọn vẹn.',
    ],
  },

  events: [
    {
      id: 'ceremony',
      title: 'Lễ Thành Hôn',
      dateTime: '2026-12-20T09:00:00+07:00',
      lunarDate: '02 tháng 11 năm Bính Ngọ',
      venueName: 'Tư Gia Nhà Trai',
      address: '123 Đường Hoa Mai, Phường 5, Quận 3, TP. Hồ Chí Minh',
      dressCode: 'Tone pastel nhẹ nhàng',
    },
    {
      id: 'reception',
      title: 'Tiệc Cưới',
      dateTime: '2026-12-20T17:00:00+07:00',
      lunarDate: '02 tháng 11 năm Bính Ngọ',
      venueName: 'Nhà Hàng Hoa Sen Vàng',
      address: '456 Đại Lộ Bình Minh, Quận 7, TP. Hồ Chí Minh',
      dressCode: 'Lịch sự, thanh lịch',
    },
  ] satisfies WeddingEvent[],

  map: {
    venueName: 'Nhà Hàng Hoa Sen Vàng',
    address: '456 Đại Lộ Bình Minh, Quận 7, TP. Hồ Chí Minh',
    googleMapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Nhà+Hàng+Hoa+Sen+Vàng+Quận+7+TP+HCM',
    embedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.955947!2d106.7!3d10.75!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ1JzAwLjAiTiAxMDbCsDQyJzAwLjAiRQ!5e0!3m2!1svi!2s!4v1',
  },

  media: {
    heroImage: '/images/hero.svg',
    musicSrc: '/music/wedding-song.mp3',
  },

  contact: {
    hotline: '0901 234 567',
    hotlineLabel: 'Liên hệ cô dâu chú rể',
  },

  footer: {
    thankYou: 'Cảm ơn bạn đã dành thời gian ghé thăm thiệp cưới của chúng tôi.',
    credit: 'Made with love',
  },
} as const

export type WeddingConfig = typeof weddingConfig
