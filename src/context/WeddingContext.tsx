import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { type Guest, parseGuestFromPath } from '../data/guests.config'
import { weddingConfig } from '../data/wedding.config'

interface WeddingContextValue {
  guest: Guest | null
  isOpened: boolean
  openInvitation: () => void
  isMusicPlaying: boolean
  toggleMusic: () => void
  musicSrc: string
  audioRef: React.RefObject<HTMLAudioElement | null>
}

const WeddingContext = createContext<WeddingContextValue | null>(null)

export function WeddingProvider({ children }: { children: ReactNode }) {
  const guest = useMemo(() => parseGuestFromPath(), [])
  const [isOpened, setIsOpened] = useState(false)
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (guest) {
      document.title = `${weddingConfig.meta.title} — ${guest.displayName}`
    }
  }, [guest])

  const openInvitation = useCallback(() => {
    setIsOpened(true)
    const audio = audioRef.current
    if (audio) {
      audio.play().then(() => setIsMusicPlaying(true)).catch(() => {
        setIsMusicPlaying(false)
      })
    }
  }, [])

  const toggleMusic = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    if (audio.paused) {
      audio.play().then(() => setIsMusicPlaying(true)).catch(() => {})
    } else {
      audio.pause()
      setIsMusicPlaying(false)
    }
  }, [])

  const value = useMemo(
    () => ({
      guest,
      isOpened,
      openInvitation,
      isMusicPlaying,
      toggleMusic,
      musicSrc: weddingConfig.media.musicSrc,
      audioRef,
    }),
    [guest, isOpened, openInvitation, isMusicPlaying, toggleMusic],
  )

  return (
    <WeddingContext.Provider value={value}>
      <audio ref={audioRef} src={weddingConfig.media.musicSrc} loop preload="none" />
      {children}
    </WeddingContext.Provider>
  )
}

export function useWedding() {
  const ctx = useContext(WeddingContext)
  if (!ctx) throw new Error('useWedding must be used within WeddingProvider')
  return ctx
}
