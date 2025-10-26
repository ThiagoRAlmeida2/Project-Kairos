// src/pages/ProjetosList.jsx
import React, { useState, useEffect } from "react";
import "../css/projetos.css";

export default function ProjetosList() {
  const [projetos, setProjetos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [user, setUser] = useState(null);

  // Carrega o usuário logado (da API via localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Criar novo projeto (somente front-end)
  const handleCreateProject = (e) => {
    e.preventDefault();

    if (!nome.trim() || !descricao.trim()) {
      alert("Preencha nome e descrição do projeto!");
      return;
    }

    const novoProjeto = {
      id: Date.now(),
      nome,
      descricao,
      dataCriacao: new Date().toISOString(),
      empresa: { usuario: { email: user?.email || "empresa@example.com" } },
      encerrado: false,
    };

    setProjetos((prev) => [...prev, novoProjeto]);
    setShowModal(false);
    setNome("");
    setDescricao("");
    alert("✅ Projeto criado com sucesso!");
  };

  // Encerrar projeto (muda cor e desabilita botão)
  const handleEncerrarProjeto = (id) => {
    setProjetos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, encerrado: true } : p))
    );
  };

  // Mostra só os projetos da empresa logada
  const projetosFiltrados =
    user?.role === "ROLE_EMPRESA"
      ? projetos.filter((p) => p.empresa?.usuario?.email === user.email)
      : projetos;

  return (
    <div className="projetos-container">
      <h1 className="titulo-projetos">Projetos</h1>

      {/* Botão de criação (somente para empresa) */}
      {user?.role === "ROLE_EMPRESA" && (
        <button
          className="criar-projeto-btn"
          onClick={() => setShowModal(true)}
        >
          + Criar Projeto
        </button>
      )}

      {/* Lista de projetos */}
      <div className="lista-projetos">
        {projetosFiltrados.length > 0 ? (
          projetosFiltrados.map((p) => (
            <div
              key={p.id}
              className={`project-card ${p.encerrado ? "encerrado" : ""}`}
            >
              <h3>{p.nome}</h3>
              <p>{p.descricao}</p>
              <span className="project-data">
                Criado em:{" "}
                {new Date(p.dataCriacao).toLocaleDateString("pt-BR")}
              </span>

              {user?.role === "ROLE_EMPRESA" && (
                <button
                  className={`encerrar-btn ${p.encerrado ? "disabled" : ""}`}
                  onClick={() => handleEncerrarProjeto(p.id)}
                  disabled={p.encerrado}
                >
                  {p.encerrado ? "Encerrado" : "Encerrar Projeto"}
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="sem-projetos">Nenhum projeto disponível</p>
        )}
      </div>

      {/* Modal de criação de projeto */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Criar novo projeto</h2>
            <form onSubmit={handleCreateProject}>
              <label>Nome do Projeto</label>
              <input
                type="text"
                placeholder="Ex: Sistema de Gestão Interna"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />

              <label>Descrição</label>
              <textarea
                placeholder="Descreva o objetivo e os detalhes do projeto"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
              ></textarea>

              <div className="modal-buttons">
                <button
                  type="button"
                  className="cancelar-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="salvar-btn">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
