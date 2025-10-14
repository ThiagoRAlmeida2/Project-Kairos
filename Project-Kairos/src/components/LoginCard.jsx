import React, { useState } from "react";
import axios from "axios";
import "../css/CardLogin.css";

export default function LoginCard({ onLoginSuccess }) {
  const [formData, setFormData] = useState({ email: "", senha: "" });
  const [alert, setAlert] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8081/api/auth/login",
        formData
      );

      // Login bem-sucedido
      const { token, email, role } = response.data;

      // Salva token no localStorage para futuras requisições
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ email, role }));

      // Callback para Navbar atualizar avatar
      onLoginSuccess({ email, role });

    } catch (err) {
      setAlert(
        err.response?.data || "Erro ao logar. Verifique suas credenciais."
      );
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="brand">Bem-vindo</h1>
        <p className="subtitle">Entre na sua conta</p>

        {alert && <div className="alert error">{alert}</div>}

        <form className="form" onSubmit={handleSubmit}>
          <label>
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              required
            />
          </label>
          <label>
            <span>Senha</span>
            <input
              type="password"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </label>
          <button type="submit" className="btn">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
