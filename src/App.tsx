import { useWedding } from './context/WeddingContext'
import { Footer } from './components/layout/Footer'
import { Countdown } from './components/sections/Countdown'
import { EventDetails } from './components/sections/EventDetails'
import { Hero } from './components/sections/Hero'
import { Invitation } from './components/sections/Invitation'
import { MapSection } from './components/sections/MapSection'
import { RSVP } from './components/sections/RSVP'
import { Wishes } from './components/sections/Wishes'
import { MusicToggle } from './components/ui/MusicToggle'

export function App() {
  const { isOpened } = useWedding()

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-cream via-blush/20 to-lavender/30">
      <Hero />
      {isOpened && (
        <main>
          <Countdown />
          <Invitation />
          <EventDetails />
          <MapSection />
          <RSVP />
          <Wishes />
          <Footer />
        </main>
      )}
      <MusicToggle />
    </div>
  )
}
