import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/projetos.css";

export default function ProjetosList() {
  const [projetos, setProjetos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [filtro, setFiltro] = useState("");

  const baseURL = "http://localhost:8081/api/projetos/public";

  useEffect(() => {
    const fetchProjetos = async () => {
      try {
        const res = await axios.get(baseURL);
        if (Array.isArray(res.data)) setProjetos(res.data);
      } catch (err) {
        console.error("Erro ao buscar projetos:", err.message);
      }
    };
    fetchProjetos();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!nome || !descricao) return alert("Preencha nome e descrição");

    try {
      const res = await axios.post(baseURL, { nome, descricao });
      setProjetos([...projetos, res.data]);
      setShowModal(false);
      setNome("");
      setDescricao("");
    } catch (err) {
      console.error("Erro ao criar projeto:", err.message);
    }
  };

  const handleEncerrarProjeto = async (id) => {
    try {
      await axios.post(`${baseURL}/${id}/encerrar`);
      setProjetos(
        projetos.map((p) => (p.id === id ? { ...p, encerrado: true } : p))
      );
    } catch (err) {
      console.error("Erro ao encerrar projeto:", err.message);
    }
  };

  const projetosFiltrados = projetos.filter((p) =>
    p.nome?.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="projetos-container">
      <div className="top-bar">
        <h1 className="titulo-projetos">📁 Projetos</h1>

        <div className="actions">
          <input
            className="search-input"
            placeholder="🔍 Buscar projeto..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
          <button className="btn btn--primary criar-projeto-btn" onClick={() => setShowModal(true)}>
            <span>+</span> Criar Projeto
          </button>
        </div>
      </div>

      <div className="lista-projetos">
        {projetosFiltrados.length > 0 ? (
          projetosFiltrados.map((p) => (
            <div
              key={p.id}
              className={`project-card ${p.encerrado ? "encerrado" : ""}`}
            >
              <div className="project-header">
                <h3>{p.nome}</h3>
                {!p.encerrado && (
                  <button
                    className="encerrar-btn"
                    onClick={() => handleEncerrarProjeto(p.id)}
                  >
                    Encerrar
                  </button>
                )}
              </div>
              <p>{p.descricao}</p>
              <div className="project-footer">
                <span>
                  Criado em:{" "}
                  {p.dataCriacao
                    ? new Date(p.dataCriacao).toLocaleDateString("pt-BR")
                    : "-"}
                </span>
                {p.encerrado && <span className="status-tag">Encerrado</span>}
              </div>
            </div>
          ))
        ) : (
          <p className="sem-projetos">Nenhum projeto disponível</p>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Novo Projeto</h2>
            <form onSubmit={handleCreateProject}>
              <input
                placeholder="Nome do Projeto"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
              <textarea
                placeholder="Descrição do Projeto"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
              />
              <div className="modal-buttons">
                <button
                  type="button"
                  className="cancelar-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn--primary salvar-btn">
                  Criar Projeto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
