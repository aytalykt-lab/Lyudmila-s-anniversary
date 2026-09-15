import Hero from './components/Hero'
import Countdown from './components/Countdown'
import Timeline from './components/Timeline'
import Guestbook from './components/Guestbook'
import { celebration } from './config'

export default function App() {
  return (
    <div className="page">
      <Hero />
      <main className="content">
        <Countdown />
        <Timeline />
        <Guestbook />
      </main>
      <footer className="footer">
        <p>
          Made with <span aria-hidden>♥</span> for {celebration.honoree}
        </p>
      </footer>
    </div>
  )
}
