import React, { useState, useEffect } from "react";
import CadastroCard from "../components/CadastroCard.jsx";
import LoginCard from "../components/LoginCard.jsx";
import logo from "../assets/logo.svg"

export default function Navbar() {
  const [showCadastro, setShowCadastro] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <>
      <header className="nav">
        <div className="container nav__inner">
          <a href="#" className="brand" aria-label="Kairos Home">
            <img src="" alt="kairos" className="brand__logo" />
          </a>

          <nav className="menu" aria-label="Menu Principal">
            <a href="/">Início</a>
            <a href="/eventos">Eventos</a>
            <a href="/projetos">Projetos</a>
          </nav>

          <div className="nav__actions">
            {!user ? (
              <>
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
              </>
            ) : (
              <div className="user-avatar" onClick={handleLogout} title="Sair">
                <img
                  src="/default-avatar.png"
                  alt={user.email}
                  style={{ width: 40, height: 40, borderRadius: "50%" }}
                />
              </div>
            )}
          </div>
        </div>
      </header>

      {showCadastro && (
        <div className="modal-overlay" onClick={() => setShowCadastro(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <CadastroCard />
          </div>
        </div>
      )}

      {showLogin && (
        <div className="modal-overlay" onClick={() => setShowLogin(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <LoginCard
              onLoginSuccess={(u) => {
                setUser(u);
                setShowLogin(false);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
