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
const baseURL = "http://localhost:8081/api";

// Armazena tokens JWT
const tokens = {};

// Função para registrar e logar usuário
async function testUser(data, label) {
  try {
    // Registro
    await axios.post(`${baseURL}/auth/register`, data);
    console.log(`✅ ${label} registrado: ${data.email}`);

    // Login
    const loginResp = await axios.post(`${baseURL}/auth/login`, {
      email: data.email,
      senha: data.senha,
    });
    tokens[label] = loginResp.data.token;
    console.log(`✅ ${label} logado! Token JWT:`, tokens[label]);
  } catch (err) {
    console.log(`❌ Erro em ${label}:`, err.response?.data || err.message);
  }
}

// Função para criar projeto (somente empresa)
async function criarProjeto(token, projeto) {
  try {
    const res = await axios.post(
      `${baseURL}/projetos`,
      projeto,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("✅ Projeto criado:", res.data);
  } catch (err) {
    console.log("❌ Erro ao criar projeto:", err.response?.data || err.message);
  }
}

// Função para listar projetos
async function listarProjetos(token) {
  try {
    const res = await axios.get(`${baseURL}/projetos`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("🔹 res.data bruto:", res.data);

    if (Array.isArray(res.data)) {
      console.log("📋 Lista de projetos:");
      res.data.forEach(p => {
        console.log(`- ${p.nome} | ${p.descricao} | Empresa: ${p.empresa?.nome}`);
      });
    } else {
      console.log("❌ O retorno não é um array, verifique o backend!");
    }
  } catch (err) {
    console.log("❌ Erro ao listar projetos:", err.response?.data || err.message);
  }
}

// Fluxo principal
(async () => {
  console.log("=== Testando Aluno ===");
  await testUser(alunoData, "ROLE_ALUNO");

  console.log("\n=== Testando Empresa ===");
  await testUser(empresaData, "ROLE_EMPRESA");

  console.log("\n=== Criando Projeto ===");
  await criarProjeto(tokens["ROLE_EMPRESA"], {
    nome: "Novo Projeto Teste",
    descricao: "Descrição de teste do projeto"
  });

  console.log("\n=== Listando Projetos ===");
  await listarProjetos(tokens["ROLE_EMPRESA"]);
})();
