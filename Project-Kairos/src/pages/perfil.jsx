// src/pages/Perfil.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/perfil.css";
import { FaPencilAlt } from "react-icons/fa";

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
    setUsuario((prev) => ({
      ...prev,
      aluno: prev.aluno ? { ...prev.aluno, [name]: value } : prev.aluno,
      empresa: prev.empresa ? { ...prev.empresa, [name]: value } : prev.empresa,
    }));
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
      alert("Perfil atualizado com sucesso!");
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
      alert("Erro ao salvar alterações");
    }
  };

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
        {/* Foto e campos lado a lado */}
        <div className="perfil-top">
          <div className="foto-container">
            <img
              src={imagemPreview || "/default-avatar.png"}
              alt="Foto de perfil"
              className="foto-perfil"
            />
            <label htmlFor="input-foto" className="editar-foto">
              <FaPencilAlt />
            </label>
            <input
              id="input-foto"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          <div className="perfil-info">
            <CampoEditavel
              label="Email"
              name="email"
              value={usuario.email}
              readOnly={true}
            />

            {isAluno ? (
              <>
                <CampoEditavel
                  label="Nome"
                  name="nome"
                  value={usuario.aluno?.nome || ""}
                  onChange={handleChange}
                  editando={editando}
                />
                <CampoEditavel
                  label="Curso"
                  name="curso"
                  value={usuario.aluno?.curso || ""}
                  onChange={handleChange}
                  editando={editando}
                />
                <CampoEditavel
                  label="Matrícula"
                  name="matricula"
                  value={usuario.aluno?.matricula || ""}
                  onChange={handleChange}
                  editando={editando}
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
                />
                <CampoEditavel
                  label="CNPJ"
                  name="cnpj"
                  value={usuario.empresa?.cnpj || ""}
                  onChange={handleChange}
                  editando={editando}
                />
              </>
            )}

            <div className="botoes">
              {!editando ? (
                <button className="btn-editar" onClick={() => setEditando(true)}>
                  Editar Perfil
                </button>
              ) : (
                <button className="btn-salvar" onClick={handleSave}>
                  Salvar Alterações
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CampoEditavel({ label, name, value, onChange, editando, readOnly }) {
  return (
    <div className="campo">
      <label>{label}</label>
      <div className="input-editavel">
        <input
          name={name}
          value={value}
          onChange={onChange}
          readOnly={readOnly || !editando}
        />
        {!readOnly && <FaPencilAlt className="icone-editar" />}
      </div>
    </div>
  );
}
