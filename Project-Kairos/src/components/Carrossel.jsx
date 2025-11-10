import React, { useRef, useEffect } from 'react' 
import '../css/Carrossel.css'

export default function Carousel({ title = 'Projetos em Destaque', items = [] }) {
   const [currentIndex, setCurrentIndex] = React.useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % items.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [items.length])

  return (
     <section className="carousel-section" aria-label={title}>
        <div className="carousel__header" style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <h2 className="carousel__title">{title}</h2>
        </div>
        
        <div className="carousel__viewport" style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
        {items.length > 0 && (
            <article className="card" style={{ 
              opacity: 1,
              transition: 'opacity 0.5s ease-in-out',
              animation: 'fadeIn 0.5s ease-in-out'
            }} key={currentIndex}>
              <div className="card__media">
                <img src={items[currentIndex].image} alt={items[currentIndex].alt} className="card__image" />
                 {items[currentIndex].badge && <div className="card__badge">{items[currentIndex].badge}</div>}
              </div>
              <div className="card__body">
                <h3 className="card__title">{items[currentIndex].title}</h3>
                <p className="card__desc">{items[currentIndex].desc}</p>
              </div>
            </article>
          )}
        </div>
        
        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateX(20px); }
            to { opacity: 1; transform: translateX(0); }
          }
        `}</style>
    </section>
  )
}