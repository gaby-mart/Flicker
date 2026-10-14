// 1. Adicione a importação do BrowserRouter no topo do App.jsx:
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/home/Home";
import Layout from "./components/jsx/Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
              <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
                {/* novas páginas com sidebar + header entram aqui */}
            </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;