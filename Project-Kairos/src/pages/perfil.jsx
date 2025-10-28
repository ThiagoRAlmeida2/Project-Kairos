// src/pages/Perfil.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/perfil.css";
import { FaPencilAlt, FaTimes } from "react-icons/fa"; // Adicionado FaTimes para fechar edição

export default function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [editando, setEditando] = useState(false);
  const [imagemPreview, setImagemPreview] = useState(null);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8081/api/usuario/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsuario(res.data);
      } catch (err) {
        console.error("Erro ao carregar perfil:", err);
      }
    };
    fetchPerfil();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // O backend retorna a entidade principal com as aninhadas (aluno/empresa)
    setUsuario((prev) => ({
      ...prev,
      aluno: prev.aluno ? { ...prev.aluno, [name]: value } : prev.aluno,
      empresa: prev.empresa ? { ...prev.empresa, [name]: value } : prev.empresa,
    }));
  };
  
  const handleCancel = () => {
    // Para cancelar, apenas desabilita a edição e recarrega os dados originais se necessário
    setEditando(false);
    // O ideal seria armazenar o estado original separado para reverter,
    // mas por simplicidade, vamos apenas resetar o preview da imagem
    setImagemPreview(null); 
    fetchPerfil(); // Pode ser pesado, mas garante que os dados voltem ao original
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const updatedData = usuario.role === "ROLE_ALUNO" ? usuario.aluno : usuario.empresa;

      const res = await axios.put(
        "http://localhost:8081/api/usuario/me",
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsuario(res.data); // atualiza estado com DTO retornado
      setEditando(false);
      setImagemPreview(null); // Reseta preview após salvar
      alert("Perfil atualizado com sucesso!");
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
      alert("Erro ao salvar alterações");
    }
  };
  
  // NOTE: A lógica de upload de imagem real (enviar para o BE) precisaria de um endpoint POST/PUT separado com FormData.
  // Aqui apenas lidamos com o preview no lado do cliente.
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagemPreview(URL.createObjectURL(file));
    }
  };

  if (!usuario) return <p className="loading">Carregando perfil...</p>;

  const isAluno = usuario.role === "ROLE_ALUNO";

  return (
    <div className="perfil-container">
      <div className="perfil-card">
        {/* Adicionado Título Moderno */}
        <h2 className="perfil-titulo">
          {isAluno ? "Meu Perfil de Aluno" : "Perfil da Empresa"}
        </h2>
        
        <div className="perfil-top">
          
          <div className="foto-container">
            <img
              src={imagemPreview || "/default-avatar.png"}
              alt="Foto de perfil"
              className="foto-perfil"
            />
            {editando && (
              <>
                <label htmlFor="input-foto" className="editar-foto">
                  <FaPencilAlt size={16} />
                </label>
                <input
                  id="input-foto"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </>
            )}
          </div>

          <div className="perfil-info">
            <CampoEditavel
              label="Email"
              name="email"
              value={usuario.email}
              readOnly={true}
              editando={false} // Email nunca é editável aqui
            />

            {isAluno ? (
              <>
                <CampoEditavel
                  label="Nome"
                  name="nome"
                  value={usuario.aluno?.nome || ""}
                  onChange={handleChange}
                  editando={editando}
                  // Adicionei key para forçar re-render, evitando bugs de estado
                  key={`aluno-nome-${editando}`} 
                />
                <CampoEditavel
                  label="Curso"
                  name="curso"
                  value={usuario.aluno?.curso || ""}
                  onChange={handleChange}
                  editando={editando}
                  key={`aluno-curso-${editando}`}
                />
                <CampoEditavel
                  label="Matrícula"
                  name="matricula"
                  value={usuario.aluno?.matricula || ""}
                  onChange={handleChange}
                  editando={editando}
                  key={`aluno-matricula-${editando}`}
                />
              </>
            ) : (
              <>
                <CampoEditavel
                  label="Nome da Empresa"
                  name="nome"
                  value={usuario.empresa?.nome || ""}
                  onChange={handleChange}
                  editando={editando}
                  key={`empresa-nome-${editando}`}
                />
                <CampoEditavel
                  label="CNPJ"
                  name="cnpj"
                  value={usuario.empresa?.cnpj || ""}
                  onChange={handleChange}
                  editando={editando}
                  key={`empresa-cnpj-${editando}`}
                />
              </>
            )}

            <div className="botoes">
              {!editando ? (
                <button className="btn-principal" onClick={() => setEditando(true)}>
                  <FaPencilAlt size={14} style={{marginRight: '8px'}} />
                  Editar Perfil
                </button>
              ) : (
                <>
                  <button className="btn-cancelar" onClick={handleCancel}>
                    <FaTimes size={14} style={{marginRight: '8px'}} />
                    Cancelar
                  </button>
                  <button className="btn-principal btn-salvar" onClick={handleSave}>
                    Salvar Alterações
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CampoEditavel({ label, name, value, onChange, editando, readOnly }) {
  // Use 'isEditable' para controlar o estado da borda
  const isEditable = !readOnly && editando;
  
  return (
    <div className="campo">
      <label>{label}</label>
      <div className={`input-editavel ${isEditable ? 'is-editable' : ''}`}>
        <input
          name={name}
          value={value}
          onChange={onChange}
          readOnly={readOnly || !editando}
        />
        {/* Ícone só aparece se o campo for tecnicamente editável (não readOnly) */}
        {!readOnly && <FaPencilAlt className={`icone-editar ${isEditable ? 'visible' : ''}`} />}
      </div>
    </div>
  );
}