import { motion, useReducedMotion } from 'framer-motion'
import { useWedding } from '../../context/WeddingContext'

export function MusicToggle() {
  const { isOpened, isMusicPlaying, toggleMusic } = useWedding()
  const reduceMotion = useReducedMotion()

  if (!isOpened) return null

  return (
    <motion.button
      type="button"
      onClick={toggleMusic}
      className="fixed right-4 bottom-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg shadow-pink-soft/25 border-2 border-blush transition-colors hover:bg-blush/30"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      aria-label={isMusicPlaying ? 'Tắt nhạc' : 'Bật nhạc'}
    >
      {isMusicPlaying ? (
        <div className="flex items-end gap-0.5" aria-hidden>
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-1 rounded-full bg-pink-soft"
              animate={
                reduceMotion
                  ? { height: 12 }
                  : { height: [8, 16, 8] }
              }
              transition={
                reduceMotion
                  ? undefined
                  : { repeat: Infinity, duration: 0.8, delay: i * 0.15 }
              }
              style={{ height: 12 }}
            />
          ))}
        </div>
      ) : (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M9 18V6l10-2v14"
            stroke="#F5AFC4"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5 10v4a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h0a2 2 0 0 0-2 2z"
            fill="#F5AFC4"
          />
          <line x1="3" y1="3" x2="21" y2="21" stroke="#5C4A4A" strokeWidth="2" />
        </svg>
      )}
    </motion.button>
  )
}
