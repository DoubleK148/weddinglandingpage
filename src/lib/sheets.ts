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

function jsonpRequest<T>(params: Record<string, string>): Promise<T> {
  if (!SHEETS_URL) {
    return Promise.reject(new Error('Sheets URL chưa cấu hình'))
  }

  return new Promise((resolve, reject) => {
    const callbackName = `__sheet_${Date.now()}_${Math.random().toString(36).slice(2)}`
    let script: HTMLScriptElement | null = null
    const win = window as unknown as Record<string, unknown>

    const cleanup = () => {
      window.clearTimeout(timeoutId)
      delete win[callbackName]
      script?.remove()
    }

    const timeoutId = window.setTimeout(() => {
      cleanup()
      reject(new Error('Không kết nối được Google Sheet'))
    }, 15000)

    win[callbackName] = (data: T) => {
      cleanup()
      resolve(data)
    }

    const search = new URLSearchParams({ ...params, callback: callbackName })
    script = document.createElement('script')
    const separator = SHEETS_URL.includes('?') ? '&' : '?'
    script.src = `${SHEETS_URL}${separator}${search.toString()}`
    script.onerror = () => {
      cleanup()
      reject(new Error('Không kết nối được Google Sheet'))
    }
    document.body.appendChild(script)
  })
}

export async function submitRsvp(data: RsvpPayload) {
  if (!SHEETS_URL) {
    await new Promise((r) => setTimeout(r, 600))
    console.info('[demo] RSVP:', data)
    return
  }

  const result = await jsonpRequest<{ success?: boolean; error?: string }>({
    action: 'submit',
    type: 'rsvp',
    name: data.name,
    phone: data.phone || '',
    guest_count: String(data.guest_count),
    attending: String(data.attending),
    message: data.message || '',
  })

  if (result.error || result.success === false) {
    throw new Error(result.error || 'Gửi thất bại')
  }
}

export async function submitWish(data: WishPayload) {
  if (!SHEETS_URL) {
    await new Promise((r) => setTimeout(r, 600))
    console.info('[demo] Wish:', data)
    return
  }

  const result = await jsonpRequest<{ success?: boolean; error?: string }>({
    action: 'submit',
    type: 'wish',
    name: data.name,
    message: data.message,
  })

  if (result.error || result.success === false) {
    throw new Error(result.error || 'Gửi thất bại')
  }
}

export function fetchWishes(): Promise<WishRecord[]> {
  if (!SHEETS_URL) return Promise.resolve(DEMO_WISHES)

  return jsonpRequest<WishRecord[]>({ action: 'wishes' }).then((data) =>
    Array.isArray(data) ? data : [],
  )
}
