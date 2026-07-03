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

/** Gửi qua hidden iframe — cách ổn định nhất với Google Apps Script */
function postToSheet(payload: Record<string, unknown>): Promise<void> {
  if (!SHEETS_URL) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.info('[demo] Sheet submission:', payload)
        resolve()
      }, 600)
    })
  }

  return new Promise((resolve, reject) => {
    const frameName = `sheet_frame_${Date.now()}`
    const iframe = document.createElement('iframe')
    iframe.name = frameName
    iframe.style.display = 'none'
    iframe.setAttribute('aria-hidden', 'true')

    const form = document.createElement('form')
    form.method = 'POST'
    form.action = SHEETS_URL
    form.target = frameName
    form.style.display = 'none'

    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = 'payload'
    input.value = JSON.stringify(payload)
    form.appendChild(input)

    const cleanup = () => {
      form.remove()
      iframe.remove()
    }

    const timeoutId = window.setTimeout(() => {
      cleanup()
      resolve()
    }, 2500)

    iframe.onerror = () => {
      window.clearTimeout(timeoutId)
      cleanup()
      reject(new Error('Không gửi được dữ liệu. Vui lòng thử lại sau.'))
    }

    document.body.appendChild(iframe)
    document.body.appendChild(form)
    form.submit()
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
