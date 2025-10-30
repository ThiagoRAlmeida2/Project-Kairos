import React, { useState, useEffect } from "react";
import axios from "axios";
// Importações de ícones necessárias
import { FaUser, FaCheck, FaTimes, FaSync, FaProjectDiagram, FaArrowLeft } from "react-icons/fa"; 
import { useNavigate } from 'react-router-dom'; 
import "../css/deashboardEmpresa.css";

// Componente Modal para exibir o Perfil Detalhado
const PerfilAlunoModal = ({ alunoId, onClose }) => {
    const [perfil, setPerfil] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPerfil = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                // 🚩 OBTÉM DADOS DETALHADOS (Backend precisa implementar este endpoint)
                const res = await axios.get(`http://localhost:8081/api/usuario/aluno/${alunoId}/perfil-detalhado`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setPerfil(res.data);
            } catch (error) {
                console.error("Erro ao buscar perfil detalhado:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPerfil();
    }, [alunoId]);
    
    // Funções utilitárias (devem ser importadas ou definidas aqui)
    const parseTagsString = (tagsString) => tagsString?.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) || [];
    const getTagClassName = (tag) => `tag-chip tag-${tag.replace(/\s|#/g, '-').replace(/\+\+/g, 'plus-plus').replace(/\./g, '')}`;


    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content profile-modal" onClick={(e) => e.stopPropagation()}>
                {loading ? (
                    <p className="loading-text">Carregando perfil do aluno...</p>
                ) : perfil && perfil.aluno ? (
                    <>
                        <h2 className="modal-title">Perfil de {perfil.aluno.nome}</h2>
                        
                        <div className="perfil-detalhe-body">
                            {/* Descrição */}
                            <div className="detalhe-campo">
                                <h4>Descrição:</h4>
                                <p>{perfil.aluno.descricao || "Descrição não informada."}</p>
                            </div>
                            
                            {/* Tags */}
                            <div className="detalhe-campo">
                                <h4>Habilidades:</h4>
                                <div className="tags-list">
                                    {parseTagsString(perfil.aluno.tags).map(tag => (
                                        <span key={tag} className={getTagClassName(tag)}>{tag}</span>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Projetos Participados */}
                            <div className="detalhe-campo">
                                <h4><FaProjectDiagram /> Projetos Participados</h4>
                                <ul className="projetos-participados-lista">
                                    {perfil.aluno.projetosParticipados?.length > 0 ? (
                                        perfil.aluno.projetosParticipados.map(p => (
                                            <li key={p.id}>
                                                <strong>{p.nome}</strong> (Início: {p.dataInicio})
                                            </li>
                                        ))
                                    ) : (
                                        <li>Nenhum projeto participado registrado.</li>
                                    )}
                                </ul>
                            </div>
                        </div>

                        <button className="btn-fechar-modal" onClick={onClose}>Fechar</button>
                    </>
                ) : (
                    <p>Dados do perfil não encontrados.</p>
                )}
            </div>
        </div>
    );
};


export default function EmpresaDashboard() {
    const navigate = useNavigate(); // 1. Obter a função de navegação

    const [candidatos, setCandidatos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alunoSelecionadoId, setAlunoSelecionadoId] = useState(null);
    const token = localStorage.getItem("token");
    const baseURL = "http://localhost:8081/api/usuario";

    const fetchCandidatos = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${baseURL}/dashboard/candidatos`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCandidatos(res.data);
        } catch (error) {
            console.error("Erro ao carregar candidatos:", error.response || error);
            // Redirecionar se o acesso for negado (403)
            if (error.response?.status === 403) {
                alert("Acesso negado. Apenas empresas podem ver o dashboard.");
                // navigate('/projetos'); // Usar navigate aqui
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCandidatos();
    }, [token]);

    // 🚩 FUNÇÃO ATUALIZADA: Lida com a aprovação/declínio no Backend e atualiza o estado
    const handleAction = async (inscricaoId, actionType) => {
        const actionLabel = actionType === 'APROVADO' ? 'APROVAR' : 'DECLINAR';
        if (!window.confirm(`Tem certeza que deseja ${actionLabel} esta candidatura?`)) {
            return;
        }

        const endpoint = actionType === 'APROVADO' ? 'aprovar' : 'declinar';
        
        try {
            setLoading(true); 
            await axios.post(
                `${baseURL}/inscricao/${inscricaoId}/${endpoint}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Atualiza o estado local para refletir a mudança
            setCandidatos(prevCandidatos => prevCandidatos.map(c => 
                c.inscricaoId === inscricaoId ? {...c, status: actionType} : c
            ));
            
            alert(`Candidato ${actionLabel.toLowerCase()} com sucesso!`);

        } catch (error) {
            console.error(`Erro ao ${endpoint} candidato:`, error.response?.data || error.message);
            alert(`Erro ao processar a ação: ${error.response?.data || 'Verifique sua conexão.'}`);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="dashboard-container"><FaSync className="loading-spinner" size={30} /> Carregando...</div>;
    if (!token || candidatos.length === 0) {
        return (
            <div className="dashboard-container no-data">
                <div className="dashboard-header-controls"> {/* Usar a div de controles */}
                    <button
                        className="btn-voltar-projetos"
                        onClick={() => navigate('/projetos')} // Navega para a rota de projetos
                    >
                        <FaArrowLeft /> Voltar para Projetos
                    </button>
                    <h2 className="dashboard-title">Dashboard de Candidatos</h2>
                </div>
                <p>Nenhum candidato encontrado para seus projetos ativos.</p>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            {/* 2. Adicionar o Botão Voltar no topo */}
            <div className="dashboard-header-controls">
                <button
                    className="btn-voltar-projetos"
                    onClick={() => navigate('/projetos')} // Navega para a rota de projetos
                >
                    <FaArrowLeft /> Voltar para Projetos
                </button>
                <h2 className="dashboard-title">Dashboard de Candidatos</h2>
            </div>
            
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
                        {candidatos.map((c, index) => (
                            <tr key={index}>
                                <td 
                                    className="aluno-link" 
                                    onClick={() => setAlunoSelecionadoId(c.alunoId)}
                                >
                                    <FaUser size={14} style={{marginRight: '8px'}} />
                                    {c.alunoNome} ({c.alunoMatricula})
                                </td>
                                <td>{c.projetoNome}</td>
                                <td>{c.dataInscricao ? new Date(c.dataInscricao).toLocaleDateString('pt-BR') : 'N/I'}</td>
                                <td className={`status-text status-${c.status?.toLowerCase()}`}>{c.status}</td> 
                                
                                <td className="action-buttons">
                                    {c.status === 'PENDENTE' ? (
                                        <>
                                            <button 
                                                className="btn-aprovar" 
                                                onClick={() => handleAction(c.inscricaoId, 'APROVADO')}
                                            >
                                                <FaCheck /> Aprovar
                                            </button>
                                            <button 
                                                className="btn-declinar" 
                                                onClick={() => handleAction(c.inscricaoId, 'REJEITADO')}
                                            >
                                                <FaTimes /> Declinar
                                            </button>
                                        </>
                                    ) : (
                                        <span className="action-completed">Ação concluída</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {alunoSelecionadoId && (
                <PerfilAlunoModal 
                    alunoId={alunoSelecionadoId} 
                    onClose={() => setAlunoSelecionadoId(null)} 
                />
            )}
        </div>
    );
}