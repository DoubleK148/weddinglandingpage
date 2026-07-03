import { motion, useReducedMotion } from 'framer-motion'
import { useCountdown } from '../../hooks/useCountdown'
import { weddingConfig } from '../../data/wedding.config'
import { Card } from '../ui/Card'
import { ScrollReveal } from '../ui/ScrollReveal'

const units = [
  { key: 'days' as const, label: 'Ngày' },
  { key: 'hours' as const, label: 'Giờ' },
  { key: 'minutes' as const, label: 'Phút' },
  { key: 'seconds' as const, label: 'Giây' },
]

export function Countdown() {
  const countdown = useCountdown(weddingConfig.countdownTarget)
  const reduceMotion = useReducedMotion()

  return (
    <section className="px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <ScrollReveal>
          <Card className="text-center">
            <p className="text-sm font-semibold tracking-widest text-pink-soft uppercase">
              Đếm ngược
            </p>
            <h2 className="mt-2 font-display text-3xl text-text italic sm:text-4xl">
              {countdown.isComplete ? 'Hôm nay là ngày vui!' : 'Còn lại'}
            </h2>

            {!countdown.isComplete && (
              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                {units.map(({ key, label }, index) => (
                  <motion.div
                    key={key}
                    className="rounded-2xl bg-gradient-to-br from-blush to-lavender/60 px-3 py-5"
                    initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                  >
                    <motion.p
                      key={countdown[key]}
                      className="font-display text-4xl text-text sm:text-5xl"
                      initial={reduceMotion ? false : { scale: 1.1 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      {String(countdown[key]).padStart(2, '0')}
                    </motion.p>
                    <p className="mt-1 text-sm font-medium text-text-muted">{label}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </ScrollReveal>
      </div>
    </section>
  )
}
