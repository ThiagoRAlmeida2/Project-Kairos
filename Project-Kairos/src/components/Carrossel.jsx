import React, { useRef } from 'react'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'; 

export default function Carousel({ title = 'Projetos & Eventos', items = [] }) {
   const ref = useRef(null)

  const scrollBy = (delta) => ref.current?.scrollBy({ left: delta, behavior: 'smooth' })

  return (
     <section className="carousel-section" aria-label={title}>
        <div className="carousel__header">
          <h2 className="carousel__title">{title}</h2>
          
          <div className="carousel__actions">
              <button className="carousel__btn" onClick={() => scrollBy(-300)} aria-label="Voltar">
                  <FaArrowLeft size={14} />
              </button>
              <button className="carousel__btn" onClick={() => scrollBy(300)} aria-label="Próximo">
                  <FaArrowRight size={14} />
              </button>
          </div>
        </div>
        
        <div className="carousel__viewport" ref={ref} tabIndex="0">
        {items.map((it, i) => (
            <article className="card" key={i}>
              <div className="card__media">
                <img src={it.image} alt={it.alt} className="card__image" />
                 {it.badge && <div className="card__badge">{it.badge}</div>}
              </div>
              <div className="card__body">
                <h3 className="card__title">{it.title}</h3>
                <p className="card__desc">{it.desc}</p>
              </div>
            </article>
          ))}
        </div>
    </section>
  )
}