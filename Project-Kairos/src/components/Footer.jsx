import React from 'react'

export default function Footer() {
  return (
    <footer className="footer" id="contato">
      <div className="footer__banner">
        <img src="/src/assets/IMG/Banner-rodapé.png" alt="Banner rodapé" className="footer__banner-image" />
        <div className="footer__banner-content">
          <div className="container footer__inner">
            <p>© {new Date().getFullYear()} Kairos. Todos os direitos reservados.</p>
            <nav className="footer__nav">
              <a href="#">Privacidade</a>
              <a href="#">Termos</a>
              <a href="#">Suporte</a>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  )
}
