const SHEETS_URL = import.meta.env.VITE_GOOGLE_SHEETS_URL as string | undefined

export const isSheetsConfigured = Boolean(SHEETS_URL)

export interface RsvpPayload {
  name: string
  phone?: string
  guest_count: number
  attending: boolean
  message?: string
}

export interface WishPayload {
  name: string
  message: string
}

export interface WishRecord {
  id: string
  name: string
  message: string
  created_at: string
}

const DEMO_WISHES: WishRecord[] = [
  {
    id: 'demo-1',
    name: 'Lan Anh',
    message: 'Chúc hai bạn mãi yêu thương và hạnh phúc trọn đời!',
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-2',
    name: 'Hoàng Nam',
    message: 'Happy wedding! Mong sớm được dự tiệc cùng hai bạn.',
    created_at: new Date().toISOString(),
  },
]

async function postToSheet(payload: Record<string, unknown>) {
  if (!SHEETS_URL) {
    await new Promise((resolve) => setTimeout(resolve, 600))
    console.info('[demo] Sheet submission:', payload)
    return
  }

  // text/plain + no-cors: tránh CORS khi gọi Google Apps Script từ domain khác
  await fetch(SHEETS_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
  })
}

export async function submitRsvp(data: RsvpPayload) {
  await postToSheet({ type: 'rsvp', ...data })
}

export async function submitWish(data: WishPayload) {
  await postToSheet({ type: 'wish', ...data })
}

export function fetchWishes(): Promise<WishRecord[]> {
  if (!SHEETS_URL) {
    return Promise.resolve(DEMO_WISHES)
  }

  return new Promise((resolve, reject) => {
    const callbackName = `__wishes_${Date.now()}`
    let script: HTMLScriptElement | null = null

    const win = window as unknown as Record<string, unknown>

    const cleanup = () => {
      window.clearTimeout(timeoutId)
      delete win[callbackName]
      script?.remove()
    }

    const timeoutId = window.setTimeout(() => {
      cleanup()
      reject(new Error('Không tải được lời chúc'))
    }, 12000)

    win[callbackName] = (data: WishRecord[]) => {
      cleanup()
      resolve(Array.isArray(data) ? data : [])
    }

    script = document.createElement('script')
    const separator = SHEETS_URL.includes('?') ? '&' : '?'
    script.src = `${SHEETS_URL}${separator}action=wishes&callback=${callbackName}`
    script.onerror = () => {
      cleanup()
      reject(new Error('Không tải được lời chúc'))
    }
    document.body.appendChild(script)
  })
}
