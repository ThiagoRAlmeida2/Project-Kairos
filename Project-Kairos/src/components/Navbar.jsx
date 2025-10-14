import React from 'react'

export default function Navbar() {
  return (
    <header className="nav">
      <div className="container nav__inner">
        <a href="#" className="brand" aria-label="Kairos Home">
          <img src='' alt="kairos" className="brand__logo" />
        </a>

        <nav className="menu" aria-label="Menu Principal">
          <a href="#">inicio</a>
          <a href="#">Eventos</a>
          <a href="#">Projetos</a>
        </nav>

        <div className="nav__actions">
          <a className="link" href="#login">Entrar</a>
          <a className="btn btn--primary" href="#criar-conta">Criar conta</a>
        </div>
      </div>
    </header>
  )
}
