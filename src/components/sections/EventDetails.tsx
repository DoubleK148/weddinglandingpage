import { weddingConfig } from '../../data/wedding.config'
import { Card } from '../ui/Card'
import { ScrollReveal } from '../ui/ScrollReveal'

function formatEventDateTime(iso: string) {
  const date = new Date(iso)
  const datePart = new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
  const timePart = new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date)
  return { datePart, timePart }
}

export function EventDetails() {
  return (
    <section className="px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <ScrollReveal>
          <h2 className="mb-8 text-center font-display text-3xl text-text italic sm:text-4xl">
            Chi tiết sự kiện
          </h2>
        </ScrollReveal>

        <div className="space-y-6">
          {weddingConfig.events.map((event, index) => {
            const { datePart, timePart } = formatEventDateTime(event.dateTime)
            return (
              <ScrollReveal key={event.id} delay={index * 0.1}>
                <Card>
                  <div className="flex items-start gap-4">
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blush text-lg font-bold text-pink-soft"
                      aria-hidden
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display text-2xl text-text italic">{event.title}</h3>
                      <p className="mt-2 text-lg font-semibold text-text">{datePart}</p>
                      <p className="text-pink-soft">
                        Lúc <span className="font-bold">{timePart}</span>
                      </p>
                      {event.lunarDate && (
                        <p className="mt-1 text-sm text-text-muted">
                          ({event.lunarDate})
                        </p>
                      )}
                      <div className="mt-4 rounded-2xl bg-cream/80 p-4">
                        <p className="font-semibold text-text">{event.venueName}</p>
                        <p className="mt-1 text-sm text-text-muted">{event.address}</p>
                      </div>
                      {event.dressCode && (
                        <p className="mt-3 text-sm text-text-muted">
                          <span className="font-semibold text-text">Dress code:</span>{' '}
                          {event.dressCode}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
