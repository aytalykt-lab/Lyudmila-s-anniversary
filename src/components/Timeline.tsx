import { milestones } from '../config'

export default function Timeline() {
  return (
    <section className="section timeline" aria-labelledby="timeline-heading">
      <h2 id="timeline-heading" className="section__title">
        Our story so far
      </h2>
      <ol className="timeline__list">
        {milestones.map((milestone) => (
          <li className="timeline__item" key={milestone.title}>
            <div className="timeline__marker" aria-hidden />
            <div className="timeline__body">
              <span className="timeline__year">{milestone.year}</span>
              <h3 className="timeline__title">{milestone.title}</h3>
              <p className="timeline__description">{milestone.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
