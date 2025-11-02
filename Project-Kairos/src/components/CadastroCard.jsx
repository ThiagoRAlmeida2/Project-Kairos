import { useState } from "react";
import axios from "axios";
import "../css/CadastroCard.css";

// Componente de alerta
function Alert({ message, type = "success", onClose }) {
  return (
    <div
      className={`alert ${type === "success" ? "success" : "error"}`}
      role="alert"
    >
      <div className="flex-1">{message}</div>
      {onClose && (
        <button onClick={onClose} className="close-btn">
          ✕
        </button>
      )}
    </div>
  );
}

export default function CadastroCard() {
  const [tipo, setTipo] = useState("ALUNO");

  // Estado único para todos os campos
  const [formData, setFormData] = useState({
    nome: "",
    curso: "",
    matricula: "",
    cnpj: "",
    email: "",
    telefone: "",
    senha: "",
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const payload =
        tipo === "ALUNO"
          ? {
              nome: formData.nome,
              curso: formData.curso,
              matricula: formData.matricula,
              email: formData.email,
              senha: formData.senha,
              role: "ROLE_ALUNO",
            }
          : {
              nome: formData.nome,
              cnpj: formData.cnpj,
              email: formData.email,
              telefone: formData.telefone,
              senha: formData.senha,
              role: "ROLE_EMPRESA",
            };

      await axios.post("http://localhost:8081/api/auth/register", payload);

      setAlertMessage("Cadastro realizado com sucesso!");
      setShowAlert(true);

      // Limpar os campos
      setFormData({
        nome: "",
        curso: "",
        matricula: "",
        cnpj: "",
        email: "",
        telefone: "",
        senha: "",
      });
    } catch (error) {
      console.error(error);
      setAlertMessage(
        error.response?.data ||
          "Erro ao cadastrar. Verifique os dados e tente novamente."
      );
      setShowAlert(true);
    }
  };

  return (
    <div className="card-container">
      <div className="card">
        <h1>📝 Faça o seu cadastro</h1>

        {/* Alert */}
        {showAlert && (
          <Alert
            message={alertMessage}
            type={alertMessage.includes("sucesso") ? "success" : "error"}
            onClose={() => setShowAlert(false)}
          />
        )}

        {/* Tabs */}
        <div className="tab-buttons">
          <button
            onClick={() => setTipo("ALUNO")}
            className={tipo === "ALUNO" ? "active-tab" : ""}
          >
🎓 Aluno
          </button>
          <button
            onClick={() => setTipo("EMPRESA")}
            className={tipo === "EMPRESA" ? "active-tab" : ""}
          >
🏢 Empresa
          </button>
        </div>

        {/* Formulário */}
        <div className="form-fields">
          {tipo === "ALUNO" ? (
            <>
              <label>
                Nome:*
                <input
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  type="text"
                  placeholder="Digite seu nome"
                />
              </label>
              <label>
                Curso:*
                <input
                  name="curso"
                  value={formData.curso}
                  onChange={handleChange}
                  type="text"
                  placeholder="Digite seu curso"
                />
              </label>
              <label>
                Matrícula:*
                <input
                  name="matricula"
                  value={formData.matricula}
                  onChange={handleChange}
                  type="text"
                  placeholder="Digite sua matrícula"
                />
              </label>
              <label>
                E-mail:*
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  placeholder="Digite seu e-mail"
                />
              </label>
              <label>
                Senha:*
                <input
                  name="senha"
                  value={formData.senha}
                  onChange={handleChange}
                  type="password"
                  placeholder="Digite sua senha"
                />
              </label>
            </>
          ) : (
            <>
              <label>
                Nome da Empresa:*
                <input
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  type="text"
                  placeholder="Digite o nome da empresa"
                />
              </label>
              <label>
                CNPJ:*
                <input
                  name="cnpj"
                  value={formData.cnpj}
                  onChange={handleChange}
                  type="text"
                  placeholder="Digite o CNPJ"
                />
              </label>
              <label>
                Telefone:*
                <input
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  type="tel"
                  placeholder="Digite o telefone"
                />
              </label>
              <label>
                Email:*
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  placeholder="Digite o email"
                />
              </label>
              <label>
                Senha:*
                <input
                  name="senha"
                  value={formData.senha}
                  onChange={handleChange}
                  type="password"
                  placeholder="Digite sua senha"
                />
              </label>
            </>
          )}
        </div>
        

        {/* Botão */}
        <button onClick={handleSubmit} className="submit-btn">
          ✅ Finalizar Cadastro
        </button>
      </div>
    </div>
  );
}
