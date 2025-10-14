import React from 'react'
import "../css/CardLogin.css";

export default function LoginCard() {
  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="brand">Bem-vindo</h1>
        <p className="subtitle">Entre na sua conta</p>

        <form className="form">
          <label>
            <span>Email</span>
            <input type="email" placeholder="seu@email.com" />
          </label>
          <label>
            <span>Senha</span>
            <input type="password" placeholder="••••••••" />
          </label>
          <button type="submit" className="btn">Entrar</button>
        </form>

        <div className="footer-note">
          Ainda não tem conta? <a href="#">Cadastre-se</a>
        </div>
      </div>
    </div>
  )
}
