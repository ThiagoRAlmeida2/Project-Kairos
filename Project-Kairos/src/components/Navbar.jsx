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
  const dropdownRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false);
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
  };

  return (
    <>

      {/* ✅ NAVBAR */}
      <header className="nav">
        <div className="container nav__inner">
          <a href="/" className="brand" aria-label="Kairos Home">
            <img src={logo} alt="Kairos" className="brand__logo" />
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
                      border: "2px solid #007bff",
                    }}
                  />
                  {menuOpen ? <X size={24} /> : <Menu size={24} />}
                </div>

                {menuOpen && (
                  <ul className="dropdown">
                    <li><a href="/perfil">Perfil</a></li>
                    <li onClick={handleLogout}>Sair</li>
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
