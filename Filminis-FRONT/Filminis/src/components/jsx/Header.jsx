import { useState, useEffect } from "react";
import "../css/header.css";
import MagnifyingGlass from "../../../src/assets/images/lupa.svg";
import DefaultAvatar from "../../../src/assets/images/defaul-login.jpg" // adicione uma imagem padrão se tiver

export default function Header({ searchTerm, setSearchTerm }) {
  // 1. Declarar o estado do usuário
  const [user, setUser] = useState(null);

  // 2. Buscar as informações do usuário logado (ex: no localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Erro ao ler os dados do usuário:", e);
      }
    }
  }, []);

  return (
    <header className="app-header">
      {/* Lado Esquerdo: Campo de Busca */}
      <div className="header-left">
        <div className="search-box">
          <img src={MagnifyingGlass} alt="Lupa de busca" className="search-icon" />
          <input
            type="text"
            placeholder="Insira o filme desejado"
            className="search-input"
            value={searchTerm || ""}
            onChange={(e) => setSearchTerm && setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Lado Direito: Perfil do Usuário */}
      <div className="header-right">
        {user ? (
          <div className="profile-container">
            <img
              src={user.avatarUrl || user.foto || DefaultAvatar}
              alt={user.nome || "Foto de perfil"}
              className="user-avatar"
            />
          </div>
        ) : (
          <a href="/login" className="login-button">
            Entrar
          </a>
        )}
      </div>
    </header>
  );
}