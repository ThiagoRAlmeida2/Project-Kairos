import { createBrowserRouter } from "react-router-dom";
import CadastroCard from "../components/CadastroCard"; // ajuste o caminho se necessário

// Rota inicial exibindo o card de cadastro
const router = createBrowserRouter([
  {
    path: "/",
    element: <CadastroCard />,
  },
]);

export default router;
