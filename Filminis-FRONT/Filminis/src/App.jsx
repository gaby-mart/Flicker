// 1. Adicione a importação do BrowserRouter no topo do App.jsx:
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/home/Home";
import Layout from "./components/jsx/Layout";
import Login from "./pages/login/Login";
import MovieDetail from "./pages/movie/MovieDetail"
import Management from "./pages/management/Management";


function App() {
  return (
    <BrowserRouter>
      <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/filme" element={<MovieDetail />} />
                <Route path="/management" element={<Management/>}/>
              </Route>

              <Route path="login" element={<Login/>}>
                {/*Rota de cadastro de usuarios */}
              </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;