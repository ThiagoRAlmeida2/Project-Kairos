import React from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "../pages/App.jsx";
import Home from "../pages/Home.jsx";


export default createBrowserRouter([
  {
    element: <App />,           // layout (Navbar/Footer)
    children: [
      { index: true, element: <Home /> }, // "/" -> Home
      // { path: "servicos", element: <ServicesPage /> }, // se precisar
    ],
  },
]);