import React from 'react'

export default function CTA() {
  const handleComecar = () => {
    // Encontra e clica no botão "Criar conta" da navbar
    const buttons = document.querySelectorAll('button')
    const criarContaBtn = Array.from(buttons).find(btn => btn.textContent.trim() === 'Criar conta')
    if (criarContaBtn) {
      criarContaBtn.click()
    }
  }

  return (
    <section className="cta" aria-label="Transformamos sua ideia em realidade">
      <div className="container cta__inner">
        <div className="cta__content">
          <h2 className="cta__title">Transformamos sua ideia em realidade</h2>
          <p className="cta__subtitle">Conecte-se com profissionais qualificados e transforme seus projetos em sucesso</p>
        </div>
        <div className="cta__brand">
          <img src="/assets/logo.svg" alt="" aria-hidden="true" />
          <button onClick={handleComecar} className="btn btn--primary">Começar</button>
        </div>
      </div>
    </section>
  )
}
