// src/pages/Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import CadastroCard from "../components/CadastroCard.jsx";
import LoginCard from "../components/LoginCard.jsx";
import logo from "../assets/logo.svg";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [showCadastro, setShowCadastro] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      // Verifica se o clique ocorreu fora da área do menu dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setMenuOpen(false);

    // 🚩 CORREÇÃO: Força o recarregamento e redireciona para a página inicial
    window.location.href = "/";
  };
  
  // Função que será passada para o LoginCard para atualizar o estado do user
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setShowLogin(false);
    // Opcional: Recarregar a página para atualizar o conteúdo que depende do login
    window.location.reload(); 
  };

  return (
    <>

      {/* ✅ NAVBAR */}
      <header className="nav">
        <div className="container nav__inner">
          <a href="/" className="brand" aria-label="Kairos Home">
            <img src={logo} alt="Kairos" className="brand__logo" />
          </a>

          {/* mobile menu toggle */}
          <button
            className="nav__toggle"
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobileOpen}
            onClick={(e) => {
              e.stopPropagation();
              setMobileOpen((v) => !v);
            }}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <nav className={`menu ${mobileOpen ? 'menu--open' : ''}`} aria-label="Menu Principal">
            <a href="/" onClick={() => setMobileOpen(false)}>Início</a>
            <a href="/eventos" onClick={() => setMobileOpen(false)}>Eventos</a>
            <a href="/projetos" onClick={() => setMobileOpen(false)}>Projetos</a>
          </nav>

          <div className="nav__actions">
            {!user ? (
              <>
                <button
                  className="btn"
                  onClick={() => setShowLogin(true)}
                >
                  Entrar
                </button>
                <button
                  className="btn"
                  onClick={() => setShowCadastro(true)}
                >
                  Criar conta
                </button>
              </>
            ) : (
              <div className="user-menu" ref={dropdownRef}>
                <div
                  className="user-info"
                  onClick={() => setMenuOpen((prev) => !prev)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    cursor: "pointer",
                  }}
                >
                  <img
                    src={user.avatar || "/default-avatar.png"}
                    alt={user.email}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      border: "2px solid #7b5cf5", // Cor ajustada para consistência
                    }}
                  />
                  {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </div>

                {menuOpen && (
                  <ul className="dropdown">
                    <li><a href="/perfil">Perfil</a></li>
                    <li 
                      onClick={handleLogout}
                      style={{ cursor: 'pointer' }} // Torna explícito que é clicável
                    >
                      Sair
                    </li>
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ✅ MODAIS */}
      {showCadastro && (
        <div className="modal-overlay" onClick={() => setShowCadastro(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <CadastroCard onClose={() => setShowCadastro(false)} />
          </div>
        </div>
      )}

      {showLogin && (
        <div className="modal-overlay" onClick={() => setShowLogin(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <LoginCard
              onLoginSuccess={handleLoginSuccess}
              onClose={() => setShowLogin(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}