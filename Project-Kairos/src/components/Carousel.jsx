import React, { useRef } from 'react'

export default function Carousel({ title = 'Projetos & Eventos', items = [] }) {
  const ref = useRef(null)
  const scrollBy = (delta) => ref.current?.scrollBy({ left: delta, behavior: 'smooth' })

  return (
    <section className="hero hero--carousel" aria-label={title}>
      <div className="container">
        <div className="carousel__header">
          <h2 className="carousel__title">{title}</h2>
          
        </div>
        <div className="carousel__viewport" ref={ref} tabIndex="0">
          {items.map((it, i) => (
            <article className="card" key={i}>
              <div className="card__media">
                
                {it.badge && <div className="card__badge">{it.badge}</div>}
              </div>
              <div className="card__body">
                <h3 className="card__title">{it.title}</h3>
                <p className="card__desc">{it.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
