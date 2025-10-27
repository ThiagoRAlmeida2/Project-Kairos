// router/index.jsx
import React from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "../pages/App.jsx";
import Home from "../pages/Home.jsx";
import ProjetosList from "../pages/projeto.jsx";
import Eventos from "../pages/eventos.jsx";
import Perfil from "../pages/perfil.jsx";

export default createBrowserRouter([
  {
    element: <App />, // App continua renderizando Navbar
    children: [
      { index: true, element: <Home /> },              // "/"
      { path: "projetos", element: <ProjetosList /> }, // "/projetos"
      { path: "eventos", element: <Eventos /> },       // "/eventos"
      { path: "perfil", element: <Perfil /> },         // "/perfil"
    ],
  },
]);
