import axios from "axios";

// Função para gerar e-mails aleatórios
function randomEmail(role) {
  return `${role.toLowerCase()}_${Math.floor(Math.random() * 10000)}@example.com`;
}

// Dados do Aluno
const alunoData = {
  nome: "Thiago Ribeiro",
  curso: "Engenharia de Software",
  matricula: `MAT${Math.floor(Math.random() * 10000)}`,
  email: randomEmail("aluno"),
  senha: "123456",
  role: "ROLE_ALUNO",
};

// Dados da Empresa
const empresaData = {
  nome: "Kairos Tech",
  cnpj: `CNPJ${Math.floor(Math.random() * 10000)}`,
  email: randomEmail("empresa"),
  senha: "123456",
  role: "ROLE_EMPRESA",
};

// URL base do backend
const baseURL = "http://localhost:8081/api/auth";

// Função para registrar e logar
async function testUser(data, label) {
  try {
    // Registro
    await axios.post(`${baseURL}/register`, data);
    console.log(`✅ ${label} registrado com sucesso: ${data.email}`);

    // Login
    const loginResp = await axios.post(`${baseURL}/login`, {
      email: data.email,
      senha: data.senha,
    });
    console.log(`✅ ${label} logado com sucesso! Token JWT:`);
    console.log(loginResp.data.token);
  } catch (err) {
    if (err.response) {
      console.log(`❌ Erro em ${label}:`, err.response.data);
    } else {
      console.log(`❌ Erro em ${label}:`, err.message);
    }
  }
}

// Executa os testes
(async () => {
  console.log("=== Testando Aluno ===");
  await testUser(alunoData, "ROLE_ALUNO");

  console.log("\n=== Testando Empresa ===");
  await testUser(empresaData, "ROLE_EMPRESA");
})();
