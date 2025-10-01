import { createBrowserRouter } from "react-router-dom";

// Por enquanto só rota inicial
const router = createBrowserRouter([
  {
    path: "/",
    element: <div className="text-center mt-10 text-2xl font-bold">Hello World 🚀</div>,
  },
]);


export default router;
