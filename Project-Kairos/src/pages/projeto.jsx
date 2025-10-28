import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/projetos.css";

export default function ProjetosList() {
  const [projetos, setProjetos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [filtro, setFiltro] = useState("");

  // 🚩 NOVO ESTADO: Controla se o aluno está vendo todos ou só os inscritos
  const [modoAluno, setModoAluno] = useState("TODOS"); 
  // 🚩 NOVO ESTADO: Armazena o ID dos projetos nos quais o aluno está inscrito
  const [projetosInscritosIds, setProjetosInscritosIds] = useState([]);

  const baseURL = "http://localhost:8081/api/projetos";
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const role = user?.role || "";

  // Função para buscar projetos e inscrições do aluno
  const fetchProjetos = async () => {
    try {
      let url = `${baseURL}/public`;
      let config = {};

      // 1. Lógica da URL de Busca (EMPRESA ou ALUNO/PUBLICO/INSCRICOES)
      if (role === "ROLE_EMPRESA" && token) {
        url = `${baseURL}/meus`;
        config = { headers: { Authorization: `Bearer ${token}` } };
      } else if (role === "ROLE_ALUNO" && token) {
        // Aluno precisa do token se estiver na rota de inscrições
        if (modoAluno === "INSCRITOS") {
          url = `${baseURL}/inscricoes`;
          config = { headers: { Authorization: `Bearer ${token}` } };
        } else {
          // Rota pública para ALUNO/TODOS
          url = `${baseURL}/public`;
          config = {};
        }
      }

      // 2. Busca principal de projetos
      const res = await axios.get(url, config);
      
      // 3. Lógica de busca de inscrições (SÓ se for ALUNO logado)
      if (role === "ROLE_ALUNO" && token) {
        // Sempre busca a lista completa de IDs inscritos para controle do botão
        const inscricoesRes = await axios.get(`${baseURL}/inscricoes`, 
            { headers: { Authorization: `Bearer ${token}` } });
            
        // Extrai apenas os IDs dos projetos inscritos
        const ids = inscricoesRes.data.map(p => p.id);
        setProjetosInscritosIds(ids);
      } else {
          setProjetosInscritosIds([]); // Limpa se não for aluno
      }

      // 4. Mapeamento e Definição do Estado
      if (Array.isArray(res.data)) {
        const projetosFormatados = res.data.map((p) => ({
          id: p.id,
          nome: p.nome,
          descricao: p.descricao,
          dataCriacao: p.dataCriacao,
          empresaNome: p.empresaNome || p.empresa?.nome || "Não informado",
          encerrado: p.encerrado || p.isEncerrado || false,
        }));

        console.log("Projetos carregados:", projetosFormatados);
        setProjetos(projetosFormatados);
      } else {
        setProjetos([]);
      }
    } catch (err) {
      console.error("Erro ao buscar projetos:", err.response?.data || err.message);
      setProjetos([]);
    }
  };

  // 🔹 Buscar projetos ao montar e quando role/token/modoAluno mudar
  useEffect(() => {
    fetchProjetos();
  }, [role, token, modoAluno]);

  // 🔹 Criar projeto
  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!nome || !descricao) return alert("Preencha nome e descrição.");

    try {
      const res = await axios.post(
        `${baseURL}/criar`,
        { nome, descricao },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Padronizar o projeto criado
      const novoProjeto = {
        id: res.data.id,
        nome: res.data.nome,
        descricao: res.data.descricao,
        dataCriacao: res.data.dataCriacao,
        empresaNome: res.data.empresaNome || res.data.empresa?.nome || "Não informado",
        encerrado: res.data.encerrado || false,
      };

      setProjetos([...projetos, novoProjeto]);
      setShowModal(false);
      setNome("");
      setDescricao("");
    } catch (err) {
      console.error("Erro ao criar projeto:", err.response?.data || err.message);
      alert("Erro ao criar projeto. Verifique se está logado como empresa.");
    }
  };

  // 🔹 Encerrar projeto
  const handleEncerrarProjeto = async (id) => {
    if (!window.confirm("Tem certeza que deseja encerrar este projeto?")) return;

    try {
      await axios.post(
        `${baseURL}/${id}/encerrar`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProjetos(
        projetos.map((p) => (p.id === id ? { ...p, encerrado: true } : p))
      );
    } catch (err) {
      console.error("Erro ao encerrar projeto:", err.response?.data || err.message);
      alert("Você não tem permissão para encerrar este projeto.");
    }
  };

  // 🔹 Inscrever-se em projeto
  const handleInscrever = async (projetoId) => {
    if (!token) return alert("Você precisa estar logado para se inscrever!");
    
    try {
      await axios.post(
        `${baseURL}/${projetoId}/inscrever`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(`Inscrição no projeto ${projetoId} realizada com sucesso!`);
      
      // Atualiza a lista de IDs inscritos para desabilitar o botão instantaneamente
      setProjetosInscritosIds([...projetosInscritosIds, projetoId]);

    } catch (err) {
      const msg = err.response?.data || "Erro ao se inscrever. Tente novamente.";
      console.error("Erro ao se inscrever:", err.response?.data || err.message);
      alert(msg);
    }
  };

  // 🔹 Cancelar inscrição em projeto 
  const handleCancelRegistration = async (projetoId) => {
    if (!window.confirm("Tem certeza que deseja cancelar sua inscrição neste projeto?")) return;

    try {
      await axios.delete(
        `${baseURL}/${projetoId}/cancelar-inscricao`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(`Inscrição no projeto ${projetoId} cancelada com sucesso!`);
      
      // 1. Remove o projeto da lista atual (se estiver no modo "Minhas Inscrições")
      setProjetos(projetos.filter(p => p.id !== projetoId));

      // 2. Remove o ID da lista de inscritos (para que apareça "Inscrever-se" no modo "TODOS")
      setProjetosInscritosIds(prevIds => prevIds.filter(id => id !== projetoId));

    } catch (err) {
      const msg = err.response?.data || "Erro ao cancelar inscrição. Tente novamente.";
      console.error("Erro ao cancelar inscrição:", err.response?.data || err.message);
      alert(msg);
    }
  };


  const projetosFiltrados = projetos.filter((p) =>
    p.nome?.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="projetos-container">
      <div className="top-bar">
        <h1 className="titulo-projetos">
          {role === "ROLE_EMPRESA" 
            ? "📁 Meus Projetos" 
            : modoAluno === "INSCRITOS" ? "📋 Minhas Inscrições" : "📋 Projetos Disponíveis"
          }
        </h1>
        <div className="actions">
          <input
            className="search-input"
            placeholder="🔍 Buscar projeto..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />

          {/* Botão de alternância para o ALUNO */}
          {role === "ROLE_ALUNO" && (
              <button
                  className={`meus-projetos-btn ${modoAluno === 'INSCRITOS' ? 'active' : ''}`}
                  onClick={() => setModoAluno((prev) => 
                      prev === "TODOS" ? "INSCRITOS" : "TODOS"
                  )}
              >
                  {modoAluno === "TODOS" ? "Minhas Inscrições" : "Ver Todos"}
              </button>
          )}

          {/* CORREÇÃO AQUI: O botão Criar Projeto SÓ DEVE APARECER para a EMPRESA */}
          {role === "ROLE_EMPRESA" && (
            <button className="criar-projeto-btn" onClick={() => setShowModal(true)}>
              + Criar Projeto
            </button>
          )}

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
                {!p.encerrado && role === "ROLE_EMPRESA" && (
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
                <span>Empresa: {p.empresaNome}</span>
                <span>
                  Criado em:{" "}
                  {p.dataCriacao ? new Date(p.dataCriacao).toLocaleDateString("pt-BR") : "-"}
                </span>
                
                {/* Lógica do Botão para ALUNO (Inscrever / Inscrito / Cancelar) */}
                {!p.encerrado && role === "ROLE_ALUNO" && (
                    <>
                        {modoAluno === "INSCRITOS" ? (
                            <button
                                className="cancelar-inscricao-btn"
                                onClick={() => handleCancelRegistration(p.id)}
                            >
                                Cancelar Inscrição
                            </button>
                        ) : (
                            <button
                                className={`inscrever-btn ${projetosInscritosIds.includes(p.id) ? 'inscrito' : ''}`}
                                onClick={() => handleInscrever(p.id)}
                                disabled={projetosInscritosIds.includes(p.id)}
                            >
                                {projetosInscritosIds.includes(p.id) ? 'Inscrito' : 'Inscrever-se'}
                            </button>
                        )}
                    </>
                )}

                {p.encerrado && <span className="status-tag">Encerrado</span>}
              </div>
            </div>
          ))
        ) : (
          <p className="sem-projetos">Nenhum projeto encontrado</p>
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
                <button type="submit" className="salvar-btn">
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