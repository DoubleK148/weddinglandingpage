import { weddingConfig } from './wedding.config'

export interface Guest {
  slug: string
  displayName: string
  fullName?: string
}

/**
 * Danh sách khách mời — thêm slug + tên để tạo link cá nhân.
 * Link mẫu: https://maedayohsuke-giahan.site/ban-a
 */
export const guestList: Guest[] = [
  { slug: 'ban-a', displayName: 'Bạn A', fullName: 'Nguyễn Văn A' },
  { slug: 'ban-b', displayName: 'Bạn B', fullName: 'Trần Văn B' },
  { slug: 'co-lan', displayName: 'Cô Lan', fullName: 'Trần Thị Lan' },
  { slug: 'anh-minh', displayName: 'Anh Minh', fullName: 'Phạm Hoàng Minh' },
]

const guestMap = Object.fromEntries(guestList.map((g) => [g.slug.toLowerCase(), g]))

function formatSlugToDisplayName(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function parseGuestFromPath(pathname: string = window.location.pathname): Guest | null {
  const raw = decodeURIComponent(pathname.replace(/^\/+|\/+$/g, ''))
  if (!raw) return null

  const slug = raw.toLowerCase()
  const known = guestMap[slug]
  if (known) return known

  return {
    slug,
    displayName: formatSlugToDisplayName(raw),
  }
}

export function getGuestInviteUrl(
  slug: string,
  baseUrl = weddingConfig.meta.siteUrl,
): string {
  return `${baseUrl.replace(/\/$/, '')}/${encodeURIComponent(slug)}`
}

export function getPrefillName(guest: Guest | null): string {
  if (!guest) return ''
  return guest.fullName ?? guest.displayName
}
