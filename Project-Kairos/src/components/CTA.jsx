import React from 'react'

export default function CTA() {
  return (
    <section className="cta" aria-label="Transformamos sua ideia em realidade">
      <div className="container cta__inner">
        <div className="cta__brand">
          <img src="/assets/logo.svg" alt="" aria-hidden="true" />
          
        </div>
        <h3>Transformamos sua ideia em realidade</h3>
        <a href="#comece" className="btn btn--inverted">Começar</a>
      </div>
    </section>
  )
}
