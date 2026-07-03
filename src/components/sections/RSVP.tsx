import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useWedding } from '../../context/WeddingContext'
import { getPrefillName } from '../../data/guests.config'
import { isSheetsConfigured, submitRsvp } from '../../lib/sheets'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Input } from '../ui/Input'
import { ScrollReveal } from '../ui/ScrollReveal'
import { Textarea } from '../ui/Textarea'

const rsvpSchema = z.object({
  name: z.string().min(2, 'Vui lòng nhập họ tên'),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^[0-9+\s-]{8,15}$/.test(val), 'Số điện thoại không hợp lệ'),
  guest_count: z.number().min(1, 'Tối thiểu 1 người').max(10, 'Tối đa 10 người'),
  attending: z.enum(['yes', 'no']),
  message: z.string().max(500).optional(),
})

type RsvpFormData = z.infer<typeof rsvpSchema>

export function RSVP() {
  const { guest } = useWedding()
  const prefillName = getPrefillName(guest)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RsvpFormData>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      name: prefillName,
      guest_count: 1,
      attending: 'yes',
    },
  })

  const onSubmit = async (data: RsvpFormData) => {
    setStatus('loading')
    setErrorMessage('')

    try {
      await submitRsvp({
        name: data.name,
        phone: data.phone || undefined,
        guest_count: data.guest_count,
        attending: data.attending === 'yes',
        message: data.message || undefined,
      })
      setStatus('success')
      reset({ name: prefillName, guest_count: 1, attending: 'yes' })
    } catch (err) {
      setStatus('error')
      setErrorMessage(err instanceof Error ? err.message : 'Đã có lỗi xảy ra')
    }
  }

  return (
    <section className="px-4 py-8 sm:py-12" id="rsvp">
      <div className="mx-auto max-w-xl">
        <ScrollReveal>
          <h2 className="mb-8 text-center font-display text-3xl text-text italic sm:text-4xl">
            Xác nhận tham dự
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <Card>
            {!isSheetsConfigured && (
              <p className="mb-4 rounded-2xl bg-lavender/40 px-4 py-3 text-sm text-text-muted">
                Demo mode: cấu hình Google Sheets URL trong file <code>.env</code> để lưu RSVP thật.
              </p>
            )}

            {status === 'success' ? (
              <div className="py-8 text-center">
                <p className="text-4xl" aria-hidden>
                  💌
                </p>
                <p className="mt-4 font-display text-2xl text-text italic">
                  Cảm ơn bạn đã xác nhận!
                </p>
                <p className="mt-2 text-text-muted">Chúng tôi rất mong được gặp bạn.</p>
                <Button className="mt-6" variant="secondary" onClick={() => setStatus('idle')}>
                  Gửi thêm xác nhận khác
                </Button>
              </div>
            ) : (
              <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
                <Input
                  label="Họ và tên *"
                  placeholder="Nguyễn Văn A"
                  error={errors.name?.message}
                  {...register('name')}
                />

                <Input
                  label="Số điện thoại"
                  placeholder="0901 234 567"
                  type="tel"
                  error={errors.phone?.message}
                  {...register('phone')}
                />

                <Input
                  label="Số người tham dự *"
                  type="number"
                  min={1}
                  max={10}
                  error={errors.guest_count?.message}
                  {...register('guest_count', { valueAsNumber: true })}
                />

                <fieldset className="text-left">
                  <legend className="mb-2 text-sm font-semibold text-text">
                    Bạn có tham dự không? *
                  </legend>
                  <div className="flex gap-4">
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="radio"
                        value="yes"
                        className="accent-pink-soft"
                        {...register('attending')}
                      />
                      <span>Có, tôi sẽ đến</span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="radio"
                        value="no"
                        className="accent-pink-soft"
                        {...register('attending')}
                      />
                      <span>Rất tiếc, tôi bận</span>
                    </label>
                  </div>
                </fieldset>

                <Textarea
                  label="Lời nhắn (tuỳ chọn)"
                  placeholder="Chúc hai bạn trăm năm hạnh phúc..."
                  error={errors.message?.message}
                  {...register('message')}
                />

                {status === 'error' && (
                  <p className="text-sm text-rose-500">{errorMessage}</p>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? 'Đang gửi...' : 'Gửi xác nhận'}
                </Button>
              </form>
            )}
          </Card>
        </ScrollReveal>
      </div>
    </section>
  )
}
