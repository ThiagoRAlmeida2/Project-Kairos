import React, { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from 'react-router-dom'; 

const IconUser = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IconCheck = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>;
const IconTimes = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;
const IconSync = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6"/><path d="M2.5 22v-6h6"/><path d="M21.5 8a10 10 0 1 0-7.39 3.41"/><path d="M2.5 16a10 10 0 1 1 7.39-3.41"/></svg>;
const IconProjectDiagram = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 7h10"/><path d="M7 12h10"/><path d="M7 17h10"/></svg>;
const IconArrowLeft = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>;


const FaUser = IconUser;
const FaCheck = IconCheck;
const FaTimes = IconTimes;
const FaSync = IconSync;
const FaProjectDiagram = IconProjectDiagram;
const FaArrowLeft = IconArrowLeft;

const parseTagsString = (tagsString) => tagsString?.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) || [];
const getTagClassName = (tag) => `tag-chip tag-${tag.replace(/\s|#/g, '-').replace(/\+\+/g, 'plus-plus').replace(/\./g, '')}`;

const parseDate = (dateData) => {
    if (!dateData) return null;
    if (Array.isArray(dateData) && dateData.length >= 3) {
      const date = new Date(dateData[0], dateData[1] - 1, dateData[2]);
      if (isNaN(date)) return null;
      return date;
    }
    const date = new Date(dateData);
    if (isNaN(date)) return null;
    return date;
}


// -----------------------------------------------------
// 🔹 COMPONENTE MODAL DE PERFIL DETALHADO
// -----------------------------------------------------
const PerfilAlunoModal = ({ alunoId, onClose }) => {
    const [perfil, setPerfil] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPerfil = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                // 🔑 Usando 'api' e URL relativa
                const res = await api.get(`/api/usuario/aluno/${alunoId}/perfil-detalhado`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setPerfil(res.data);
            } catch (error) {
                console.error("Erro ao buscar perfil detalhado:", error.response || error);
            } finally {
                setLoading(false);
            }
        };
        fetchPerfil();
    }, [alunoId]);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content profile-modal" onClick={(e) => e.stopPropagation()}>
                {loading ? (
                    <p className="loading-text"><FaSync className="loading-spinner" size={20} /> Carregando perfil...</p>
                ) : perfil && perfil.aluno ? (
                    <>
                        <h2 className="modal-title">Perfil de {perfil.aluno.nome}</h2>
                        
                        <div className="perfil-detalhe-body">
                            {/* Coluna 1: Informações Básicas */}
                            <div className="detalhe-coluna-info">
                                <div className="detalhe-campo"><h4>Email:</h4><p>{perfil.email}</p></div>
                                <div className="detalhe-campo"><h4>Matrícula:</h4><p>{perfil.aluno.matricula}</p></div>
                                <div className="detalhe-campo"><h4>Curso:</h4><p>{perfil.aluno.curso}</p></div>

                                <div className="detalhe-campo detalhe-descricao">
                                    <h4>Descrição Pessoal:</h4>
                                    <p className="descricao-texto">{perfil.aluno.descricao || "Descrição não informada."}</p>
                                </div>
                            </div>
                            
                            {/* Coluna 2: Tags e Projetos */}
                            <div className="detalhe-coluna-tags">
                                {/* Tags */}
                                <div className="detalhe-campo">
                                    <h4>Habilidades:</h4>
                                    <div className="tags-list">
                                        {parseTagsString(perfil.aluno.tags).map((tag) => (
                                            <span key={tag} className={getTagClassName(tag)}>{tag}</span>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* Projetos Participados */}
                                <div className="detalhe-campo">
                                    <h4><FaProjectDiagram /> Projetos Participados ({perfil.aluno.projetosParticipados?.length || 0})</h4>
                                    <ul className="projetos-participados-lista">
                                        {perfil.aluno.projetosParticipados.map(p => (
                                            <li key={p.id}> 
                                                <strong>{p.nome}</strong> 
                                                <small>(Início: {p.dataInicio ? parseDate(p.dataInicio).toLocaleDateString('pt-BR') : 'N/I'})</small>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <button className="btn-fechar-modal" onClick={onClose}>Fechar</button>
                    </>
                ) : (
                    <p className="loading-text">Não foi possível carregar os dados do perfil.</p>
                )}
            </div>
        </div>
    );
};


// -----------------------------------------------------
// 🔹 COMPONENTE PRINCIPAL DO DASHBOARD
// -----------------------------------------------------
export default function EmpresaDashboard() {
    const navigate = useNavigate(); 
    
    const [candidatos, setCandidatos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alunoSelecionadoId, setAlunoSelecionadoId] = useState(null);
    const token = localStorage.getItem("token");
    
    // 🔑 MUDANÇA: Usando o caminho relativo e deixando o 'api' lidar com o baseURL
    const baseURL = "/api/usuario"; 

    const fetchCandidatos = async () => {
        setLoading(true);
        try {
            // 🔑 MUDANÇA: Usando 'api'
            const res = await api.get(`${baseURL}/dashboard/candidatos`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCandidatos(res.data);
        } catch (error) {
            console.error("Erro ao carregar candidatos:", error.response || error);
            if (error.response?.status === 403) {
                alert("Acesso negado. Você não é uma empresa ou está deslogado.");
                navigate("/projetos"); 
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCandidatos();
    }, [token]);

    const handleAction = async (inscricaoId, actionType) => {
        const action = actionType.toLowerCase(); 
        const endpoint = `${baseURL}/inscricao/${inscricaoId}/${action}`;

        // Determina o status final esperado no frontend (APROVADO ou REJEITADO)
        let finalStatus;
        if (action === 'aprovar') {
            finalStatus = 'APROVADO'; // Garante que o status seja APROVADO, não APROVAR
        } else if (action === 'rejeitar') {
            finalStatus = 'REJEITADO'; // Garante que o status seja REJEITADO
        } else {
             // Fallback
             finalStatus = actionType.toUpperCase();
        }

        try {
            await api.post(endpoint, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCandidatos(cands => cands.map(c => 
                c.inscricaoId === inscricaoId ? {...c, status: finalStatus} : c
            ));
            
        } catch (error) {
            alert(`Erro ao ${action}: ${error.response?.data || error.message}`);
        }
    };

    if (loading) return <div className="dashboard-container"><FaSync className="loading-spinner" size={30} /> Carregando...</div>;
    
    return (
        <div className="dashboard-container">
            <div className="dashboard-header-controls">
                {/* Botão de Voltar */}
                <button 
                    className="btn-voltar-projetos" 
                    onClick={() => navigate("/projetos")}
                >
                    {/* 🔑 MUDANÇA: Usando FaArrowLeft como componente SVG */}
                    <FaArrowLeft size={16} style={{marginRight: '8px'}} />
                    Voltar para Projetos
                </button>
                
                <h2 className="dashboard-title">Dashboard de Candidatos</h2>
            </div>
            
            {candidatos.length === 0 ? (
                 <div className="no-data">
                    <p>Nenhum candidato encontrado para seus projetos ativos.</p>
                </div>
            ) : (
                <div className="dashboard-table-wrapper">
                    <table className="candidatos-table">
                        <thead>
                            <tr>
                                <th>Aluno</th>
                                <th>Projeto</th>
                                <th>Data Inscrição</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {candidatos.map((c) => (
                                <tr key={c.inscricaoId}> 
                                    {/* CORREÇÃO 1: Removendo o aluno-link da TD e tratando o clique. */}
                                    <td onClick={() => setAlunoSelecionadoId(c.alunoId)}>
                                        {/* CORREÇÃO 2: Aplicando a classe aluno-link em um DIV interno para manter o layout da TD */}
                                        <div className="aluno-link" style={{cursor: 'pointer'}}>
                                            {/* 🔑 MUDANÇA: Usando FaUser como componente SVG */}
                                            <FaUser size={14} style={{marginRight: '8px'}} />
                                            {c.alunoNome} 
                                            <span style={{color: 'var(--text-medium)', marginLeft: '6px'}}>
                                                 ({c.alunoMatricula})
                                            </span>
                                        </div>
                                    </td>
                                    <td>{c.projetoNome}</td>
                                    <td>{c.dataInscricao ? new Date(c.dataInscricao).toLocaleDateString('pt-BR') : 'N/I'}</td>
                                    
                                    <td className="status-cell">
                                        <span className={`status-tag status-${c.status.toLowerCase()}`}>
                                            {c.status}
                                        </span>
                                    </td>
                                    
                                    <td className="action-buttons">
                                        {c.status === 'PENDENTE' ? (
                                            <div style={{display: 'flex', gap: '10px'}}>
                                                <button 
                                                    className="btn-aprovar" 
                                                    onClick={() => handleAction(c.inscricaoId, 'Aprovar')}
                                                >
                                                    {/* 🔑 MUDANÇA: Usando FaCheck como componente SVG */}
                                                    <FaCheck /> Aprovar
                                                </button>
                                                <button 
                                                    className="btn-declinar" 
                                                    onClick={() => handleAction(c.inscricaoId, 'Rejeitar')}
                                                >
                                                    {/*SVG */}
                                                    <FaTimes /> Rejeitar
                                                </button>
                                            </div>
                                       ) : (
                                         <span 
                                                className={`action-completed status-${c.status.toLowerCase()}`}
                                                style={{
                                                    display: 'inline-flex', 
                                                    alignItems: 'center', 
                                                    gap: '8px',
                                                    fontWeight: '700',
                                                    padding: '8px 14px',
                                                    borderRadius: '10px'
                                                }}
                                            >
                                            Ação Concluida!!
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            

            {alunoSelecionadoId && (
                <PerfilAlunoModal 
                    alunoId={alunoSelecionadoId} 
                    onClose={() => setAlunoSelecionadoId(null)} 
                />
            )}
        </div>
    );
}