import "../css/header.css";
import MagnifyingGlass from "../../../src/assets/images/lupa.svg";

const DATA_URL = import.meta.env.VITE_DATA_URL;

export default function Header({ searchTerm, setSearchTerm }) {
  return (
    <header className="app-header">
      {/* Lado Esquerdo: Campo de Busca com Lupa */}
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

      {/* Lado Direito: Login */}
      <div className="header-right"></div>
    </header>
  );
}