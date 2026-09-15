import { celebration } from '../config'

export default function Hero() {
  return (
    <header className="hero">
      <div className="hero__glow" aria-hidden />
      <div className="hero__inner">
        <p className="hero__eyebrow">Happy Anniversary</p>
        <h1 className="hero__title">{celebration.honoree}</h1>
        <p className="hero__subtitle">{celebration.subtitle}</p>
        <a className="hero__cta" href="#guestbook">
          Leave a wish
        </a>
      </div>
    </header>
  )
}
