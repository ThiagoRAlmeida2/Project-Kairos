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
      {/* ✅ CSS EMBUTIDO */}
      <style>{`
        .nav {
          background-color: #ffffff;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .container.nav__inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
        }

        .brand__logo {
          height: 40px;
        }

        .menu {
          display: flex;
          gap: 1.5rem;
        }

        .menu a {
          text-decoration: none;
          color: #333;
          font-weight: 500;
          transition: color 0.2s;
        }

        .menu a:hover {
          color: #007bff;
        }

        .nav__actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .btn {
          border: none;
          border-radius: 6px;
          padding: 0.5rem 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.3s;
          background-color: #007bff;
          color: white;
        }

        .btn:hover {
          background-color: #0056b3;
        }

        .user-menu {
          position: relative;
        }

        .dropdown {
          position: absolute;
          top: 55px;
          right: 0;
          background: white;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          list-style: none;
          padding: 0.5rem 0;
          width: 150px;
          z-index: 1000;
          animation: fadeIn 0.2s ease-in-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dropdown li {
          padding: 10px 15px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .dropdown li a {
          color: #333;
          text-decoration: none;
          display: block;
        }

        .dropdown li:hover {
          background: #f2f2f2;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0,0,0,0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 2000;
        }

        .modal-content {
          background: white;
          border-radius: 10px;
          padding: 2rem;
          position: relative;
          max-width: 400px;
          width: 90%;
        }
      `}</style>

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
