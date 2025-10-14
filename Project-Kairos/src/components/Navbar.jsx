import React, { useState } from "react";
import { Link } from "react-router-dom";
import CadastroCard from "../components/CadastroCard.jsx";
import LoginCard from "../components/LoginCard.jsx";

export default function Navbar({ cadastroPath, loginPath }) {
  const [showCadastro, setShowCadastro] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <header className="nav">
        <div className="container nav__inner">
          <a href="#" className="brand" aria-label="Kairos Home">
            <img src="" alt="kairos" className="brand__logo" />
          </a>

          <nav className="menu" aria-label="Menu Principal">
            <Link to="/">Início</Link>
            <Link to="/eventos">Eventos</Link>
            <Link to="/projetos">Projetos</Link>
          </nav>

          <div className="nav__actions">
            <button
              className="btn btn--secondary"
              onClick={() => setShowLogin(true)}
            >
              Entrar
            </button>

            <button
              className="btn btn--primary"
              onClick={() => setShowCadastro(true)}
            >
              Criar conta
            </button>
          </div>
        </div>
      </header>

      {/* Modal de Cadastro */}
      {showCadastro && (
        <div className="modal-overlay" onClick={() => setShowCadastro(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {cadastroPath ? cadastroPath : <CadastroCard />}
          </div>
        </div>
      )}

      {/* Modal de Login */}
      {showLogin && (
        <div className="modal-overlay" onClick={() => setShowLogin(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {loginPath ? loginPath : <LoginCard />}
          </div>
        </div>
      )}
    </>
  );
}
