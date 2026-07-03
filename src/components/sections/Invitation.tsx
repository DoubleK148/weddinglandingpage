import { useWedding } from '../../context/WeddingContext'
import { weddingConfig } from '../../data/wedding.config'
import { Card } from '../ui/Card'
import { ScrollReveal } from '../ui/ScrollReveal'

export function Invitation() {
  const { guest } = useWedding()
  const { groom, bride } = weddingConfig.couple

  return (
    <section className="px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-2xl">
        <ScrollReveal>
          <Card className="text-center">
            <p className="font-display text-2xl text-pink-soft italic sm:text-3xl">
              {weddingConfig.invitation.greeting}
            </p>

            {guest && (
              <p className="mt-4 text-lg font-semibold text-text">
                Kính gửi{' '}
                <span className="font-display text-2xl text-pink-soft italic">
                  {guest.displayName}
                </span>
              </p>
            )}

            <div className="my-8 space-y-1">
              <p className="text-lg font-semibold text-text">{groom.fullName}</p>
              <p className="text-text-muted">&</p>
              <p className="text-lg font-semibold text-text">{bride.fullName}</p>
            </div>

            <div className="space-y-4 text-text-muted leading-relaxed">
              {weddingConfig.invitation.message.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-10 grid gap-6 border-t border-blush/50 pt-8 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-xs font-bold tracking-widest text-pink-soft uppercase">
                  Nhà trai
                </p>
                <p className="text-sm text-text">{weddingConfig.parents.groomSide}</p>
              </div>
              <div>
                <p className="mb-2 text-xs font-bold tracking-widest text-pink-soft uppercase">
                  Nhà gái
                </p>
                <p className="text-sm text-text">{weddingConfig.parents.brideSide}</p>
              </div>
            </div>
          </Card>
        </ScrollReveal>
      </div>
    </section>
  )
}
