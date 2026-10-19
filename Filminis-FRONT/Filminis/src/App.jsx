import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/home/Home";
import Layout from "./components/jsx/Layout";
import ProtectedRoute from "./components/jsx/ProtectedRoute";
import Login from "./pages/login/Login";
import MovieDetail from "./pages/movie/MovieDetail"
import Management from "./pages/management/Management";
import Request from "./pages/request/request";
import User from "./pages/user/user"


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {/* Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/filme" element={<MovieDetail />} />

          {/* Exigem login */}
          <Route element={<ProtectedRoute />}>
            <Route path="/user" element={<User />} />
          </Route>

          {/* Somente administradores */}
          <Route element={<ProtectedRoute role="admin" />}>
            <Route path="/management" element={<Management />} />
            <Route path="/request" element={<Request />} />
          </Route>
        </Route>

        <Route path="login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;