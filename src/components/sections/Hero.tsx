import { motion, useReducedMotion } from 'framer-motion'
import { useWedding } from '../../context/WeddingContext'
import { weddingConfig } from '../../data/wedding.config'
import { Button } from '../ui/Button'

function formatWeddingDate(iso: string) {
  return new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso))
}

export function Hero() {
  const { isOpened, openInvitation, guest } = useWedding()
  const reduceMotion = useReducedMotion()
  const { groom, bride } = weddingConfig.couple
  const mainEvent = weddingConfig.events[1] ?? weddingConfig.events[0]

  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(255,248,240,0.3), rgba(255,228,236,0.85)), url(${weddingConfig.media.heroImage})`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-cream/20 via-blush/30 to-lavender/40" />

      <div className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-6 py-16 text-center">
        <motion.p
          className="mb-3 text-sm font-semibold tracking-[0.2em] text-text-muted uppercase"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Save the date
        </motion.p>

        <motion.h1
          className="font-display text-5xl leading-tight text-text sm:text-6xl md:text-7xl"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35, duration: 0.6 }}
        >
          <span className="italic">{groom.nickname}</span>
          <span className="mx-3 text-pink-soft">&</span>
          <span className="italic">{bride.nickname}</span>
        </motion.h1>

        <motion.p
          className="mt-4 max-w-md font-display text-xl text-text-muted italic sm:text-2xl"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {formatWeddingDate(mainEvent.dateTime)}
        </motion.p>

        <motion.div
          className="mt-8 flex items-center gap-2 text-pink-soft"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
          aria-hidden
        >
          <HeartIcon />
          <span className="text-sm font-medium text-text-muted">{weddingConfig.meta.hashtag}</span>
          <HeartIcon />
        </motion.div>
      </div>

      {!isOpened && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-cream/95 px-6 backdrop-blur-md"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex max-w-sm flex-col items-center text-center">
            <motion.div
              className="mb-8"
              animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            >
              <EnvelopeIcon />
            </motion.div>
            <h2 className="font-display text-3xl text-text italic">
              {guest ? (
                <>
                  Gửi tới <span className="text-pink-soft">{guest.displayName}</span>
                </>
              ) : (
                'Bạn nhận được một thiệp mời'
              )}
            </h2>
            <p className="mt-3 text-text-muted">
              {guest
                ? 'Bạn được trân trọng mời đến dự lễ thành hôn của chúng tôi. Chạm để mở thiệp nhé!'
                : 'Chạm để mở thiệp và bật nhạc nền nhé'}
            </p>
            <Button className="mt-8" onClick={openInvitation}>
              Mở thiệp
            </Button>
          </div>
        </motion.div>
      )}
    </section>
  )
}

function HeartIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  )
}

function EnvelopeIcon() {
  return (
    <svg width="120" height="90" viewBox="0 0 120 90" fill="none" aria-hidden>
      <rect x="8" y="20" width="104" height="62" rx="8" fill="#FFE4EC" stroke="#F5AFC4" strokeWidth="2" />
      <path d="M8 28 L60 58 L112 28" stroke="#F5AFC4" strokeWidth="2" fill="none" />
      <circle cx="60" cy="48" r="10" fill="#F5AFC4" opacity="0.5" />
      <path
        d="M55 48 L58 51 L65 44"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
