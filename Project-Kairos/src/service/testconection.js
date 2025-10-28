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
    await axios.post(`${baseURL}/auth/register`, data);
    console.log(`✅ ${label} registrado: ${data.email}`);

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

// Armazena projetos criados
let projetosCriados = [];

// Função para criar projeto (público)
async function criarProjeto(projeto) {
  try {
    const res = await axios.post(baseURL, projeto);
    console.log(`✅ Projeto criado: ${res.data.nome}`);
    projetosCriados.push(res.data);
  } catch (err) {
    console.log("❌ Erro ao criar projeto:", err.response?.data || err.message);
  }
}

// Função para encerrar projeto (público)
async function encerrarProjeto(id) {
  try {
    await axios.post(`${baseURL}/${id}/encerrar`);
    console.log(`🛑 Projeto com ID ${id} encerrado`);
  } catch (err) {
    console.log("❌ Erro ao encerrar projeto:", err.response?.data || err.message);
  }
}

// Função para listar projetos (público)
async function listarProjetos() {
  try {
    const res = await axios.get(baseURL);
    if (Array.isArray(res.data)) {
      console.log("\n📋 Lista de Projetos:");
      res.data.forEach(p => {
        console.log(
          `- ${p.nome} | ${p.descricao} | Encerrado: ${p.encerrado ? "Sim" : "Não"}`
        );
      });
    } else {
      console.log("❌ Retorno não é array:", res.data);
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

  const tokenEmpresa = tokens["ROLE_EMPRESA"]; // <-- agora o token já existe

   console.log("=== Criando projetos ===");
  await criarProjeto({ nome: "Projeto A", descricao: "Teste A" });
  await criarProjeto({ nome: "Projeto B", descricao: "Teste B" });

  console.log("\n=== Encerrando o primeiro projeto ===");
  if (projetosCriados.length > 0) {
    await encerrarProjeto(projetosCriados[0].id);
  }

  console.log("\n=== Listando todos os projetos ===");
  await listarProjetos();
})();
