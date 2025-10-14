import React from 'react'

function Step({ index, title, desc }) {
  return (
    <div className="step">
      <div className="step__index">{index}</div>
      <div className="step__content">
        <h4>{title}</h4>
        <p>{desc}</p>
      </div>
    </div>
  )
}

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="how" aria-labelledby="como-title">
      <div className="container">
        <h2 id="como-title">Como Funciona</h2>
        <p className="section-subtitle">Um processo simples e seguro para conectar empresas e alunos</p>

        <div className="how__cards">
          <article className="how__card">
            <h3>Para empresas</h3>
            <Step index="1" title="Descreva seu projeto" desc="Conte o que precisa, prazos e orçamento." />
            <Step index="2" title="Receba propostas" desc="Profissionais indicados enviam suas ideias." />
            <Step index="3" title="Acompanhe e aprove" desc="Trilhe junto, com entregas claras e checkpoints." />
          </article>

        <article className="how__card">
            <h3>Alunos</h3>
            <Step index="1" title="Cadastre seu perfil" desc="Destaque habilidades, portfólio e disponibilidade." />
            <Step index="2" title="Participe de projetos" desc="Receba convites e mostre seu talento." />
            <Step index="3" title="Evolua na prática" desc="Mentorias, feedbacks e experiências reais." />
          </article>
        </div>

        <div className="how__action">
          <a className="btn btn--primary" href="#">Tenho interesse</a>
        </div>
      </div>
    </section>
  )
}
