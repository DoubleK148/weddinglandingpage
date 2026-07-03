import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  fetchWishes,
  isSheetsConfigured,
  submitWish,
  type WishRecord,
} from '../../lib/sheets'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Input } from '../ui/Input'
import { ScrollReveal } from '../ui/ScrollReveal'
import { Textarea } from '../ui/Textarea'

const wishSchema = z.object({
  name: z.string().min(2, 'Vui lòng nhập tên'),
  message: z.string().min(5, 'Lời chúc quá ngắn').max(300, 'Tối đa 300 ký tự'),
})

type WishFormData = z.infer<typeof wishSchema>

function formatWishDate(iso: string) {
  return new Intl.DateTimeFormat('vi-VN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso))
}

export function Wishes() {
  const [wishes, setWishes] = useState<WishRecord[]>([])
  const [loadingWishes, setLoadingWishes] = useState(true)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const loadWishes = useCallback(async () => {
    if (!isSheetsConfigured) {
      setWishes([
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
      ])
      setLoadingWishes(false)
      return
    }

    try {
      const data = await fetchWishes()
      setWishes(data)
    } catch {
      setWishes([])
    } finally {
      setLoadingWishes(false)
    }
  }, [])

  useEffect(() => {
    void loadWishes()
  }, [loadWishes])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WishFormData>({
    resolver: zodResolver(wishSchema),
  })

  const onSubmit = async (data: WishFormData) => {
    setStatus('loading')
    setErrorMessage('')

    try {
      await submitWish(data)
      setStatus('success')
      reset()
      await loadWishes()
    } catch (err) {
      setStatus('error')
      setErrorMessage(err instanceof Error ? err.message : 'Đã có lỗi xảy ra')
    }
  }

  return (
    <section className="px-4 py-8 sm:py-12" id="wishes">
      <div className="mx-auto max-w-xl">
        <ScrollReveal>
          <h2 className="mb-8 text-center font-display text-3xl text-text italic sm:text-4xl">
            Sổ lời chúc
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <Card>
            {!isSheetsConfigured && (
              <p className="mb-4 rounded-2xl bg-lavender/40 px-4 py-3 text-sm text-text-muted">
                Demo mode: hiển thị lời chúc mẫu. Cấu hình Google Sheets để lưu lời chúc thật.
              </p>
            )}

            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
              <Input
                label="Tên của bạn *"
                placeholder="Tên hiển thị"
                error={errors.name?.message}
                {...register('name')}
              />
              <Textarea
                label="Lời chúc *"
                placeholder="Gửi lời chúc phúc đến cô dâu chú rể..."
                error={errors.message?.message}
                {...register('message')}
              />

              {status === 'error' && (
                <p className="text-sm text-rose-500">{errorMessage}</p>
              )}
              {status === 'success' && (
                <p className="text-sm text-emerald-600">Lời chúc đã được gửi. Cảm ơn bạn!</p>
              )}

              <Button type="submit" className="w-full" disabled={status === 'loading'}>
                {status === 'loading' ? 'Đang gửi...' : 'Gửi lời chúc'}
              </Button>
            </form>
          </Card>
        </ScrollReveal>

        <div className="mt-8 space-y-4">
          {loadingWishes ? (
            <p className="text-center text-text-muted">Đang tải lời chúc...</p>
          ) : wishes.length === 0 ? (
            <p className="text-center text-text-muted">Hãy là người đầu tiên gửi lời chúc nhé!</p>
          ) : (
            wishes.map((wish, index) => (
              <ScrollReveal key={wish.id} delay={index * 0.05}>
                <Card className="text-left">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-text">{wish.name}</p>
                    <time className="text-xs text-text-muted" dateTime={wish.created_at}>
                      {formatWishDate(wish.created_at)}
                    </time>
                  </div>
                  <p className="mt-2 text-text-muted leading-relaxed">{wish.message}</p>
                </Card>
              </ScrollReveal>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
