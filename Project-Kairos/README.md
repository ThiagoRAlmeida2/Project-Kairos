# Project Kairos

Este projeto é uma aplicação React.js configurada com Vite, TailwindCSS e Axios, pronta para se conectar a um backend.

---

## 🔹 Início rápido

Para rodar o projeto, basta seguir os passos abaixo:

1. Certifique-se de estar na pasta raiz do projeto:

```bash
cd /caminho/para/Project-Kairos
```

2. Instale todas as dependências:

```bash
npm install
```

3. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

4. Abra o navegador no endereço indicado, geralmente:

```
http://localhost:5173/
```

> ⚠️ **Atenção:** Não modifique a pasta `service`. Ela contém a configuração do Axios para comunicação com o backend, incluindo interceptors e base URL. Alterar esta pasta pode quebrar as requisições da aplicação.

---

## 🔹 Estrutura de pastas

Dentro da pasta `src`, temos a seguinte organização:

```
src/
 ├─ assets/       → Imagens, ícones e arquivos estáticos do frontend
 ├─ components/   → Componentes reutilizáveis da interface (botões, cards, formulários, etc.)
 ├─ css/          → Arquivos CSS globais e Tailwind (index.css)
 ├─ pages/        → Páginas principais do sistema (cada rota terá sua própria página aqui)
 ├─ router/       → Configuração do React Router, define rotas e navegação SPA
 |─ service/      → Configuração do Axios e serviços de requisições HTTP
 └─ main.jsx      → Ponto de entrada da aplicação React
```

---

## 🔹 Funcionalidade de cada pasta

* **assets**: Armazena imagens, ícones, fontes ou outros recursos estáticos.
* **components**: Componentes React reutilizáveis que podem ser usados em várias páginas.
* **css**: Arquivos de estilo globais, incluindo TailwindCSS.
* **pages**: Páginas da aplicação, cada uma corresponde a uma rota definida no React Router.
* **router**: Responsável pela configuração das rotas da aplicação (React Router).
* **service**: Contém a configuração do Axios e funções para realizar requisições ao backend. **Não deve ser alterada.**

---

## 🔹 Observações

* O projeto já possui as dependências principais instaladas: React, React Router, TailwindCSS, Axios, Vite.
* Para criar novas páginas ou componentes, siga a estrutura das pastas para manter o projeto organizado.
* Antes de iniciar o backend, verifique se a `baseURL` no arquivo `service/api.js` está configurada corretamente.

---
