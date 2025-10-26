// src/pages/ProjetosList.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/projetos.css";

export default function ProjetosList() {
  const [projetos, setProjetos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");

  const baseURL = "http://localhost:8081/api/projetos/public";

  // Carregar projetos
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

  // Criar projeto
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

  // Encerrar projeto
  const handleEncerrarProjeto = async (id) => {
    try {
      await axios.post(`${baseURL}/${id}/encerrar`);
      setProjetos(
        projetos.map((p) =>
          p.id === id ? { ...p, encerrado: true } : p
        )
      );
    } catch (err) {
      console.error("Erro ao encerrar projeto:", err.message);
    }
  };

  return (
    <div className="projetos-container">
      <h1 className="titulo-projetos">Projetos</h1>
      <button onClick={() => setShowModal(true)}>+ Criar Projeto</button>

      <div className="lista-projetos">
        {projetos.length > 0 ? (
          projetos.map((p) => (
            <div
              key={p.id}
              className="project-card"
              style={{ opacity: p.encerrado ? 0.5 : 1 }}
            >
              <h3>{p.nome}</h3>
              <p>{p.descricao}</p>
              <span>
                Criado em: {new Date(p.dataCriacao).toLocaleDateString("pt-BR")}
              </span>
              {!p.encerrado && (
                <button
                  onClick={() => handleEncerrarProjeto(p.id)}
                  style={{ marginTop: "8px" }}
                >
                  Encerrar Projeto
                </button>
              )}
            </div>
          ))
        ) : (
          <p>Nenhum projeto disponível</p>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Criar Projeto</h2>
            <form onSubmit={handleCreateProject}>
              <input
                placeholder="Nome do Projeto"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
              <textarea
                placeholder="Descrição"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
              />
              <div>
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
