import { weddingConfig } from '../../data/wedding.config'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { ScrollReveal } from '../ui/ScrollReveal'

export function MapSection() {
  const { map } = weddingConfig

  return (
    <section className="px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <ScrollReveal>
          <h2 className="mb-8 text-center font-display text-3xl text-text italic sm:text-4xl">
            Địa điểm tổ chức
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <Card className="overflow-hidden p-0">
            <div className="p-6 pb-4 sm:p-8 sm:pb-5">
              <h3 className="font-display text-2xl text-text italic">{map.venueName}</h3>
              <p className="mt-2 text-text-muted">{map.address}</p>
              <Button
                variant="secondary"
                className="mt-4"
                onClick={() => window.open(map.googleMapsUrl, '_blank', 'noopener,noreferrer')}
              >
                Chỉ đường
              </Button>
            </div>
            <div className="relative aspect-[16/10] w-full overflow-hidden">
              <iframe
                title={`Bản đồ ${map.venueName}`}
                src={map.embedUrl}
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </Card>
        </ScrollReveal>
      </div>
    </section>
  )
}
