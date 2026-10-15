import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ToastNotification from "../../components/jsx/ToastNotification";
import { getMovies, deleteMovie } from "../../service/http";
import Pagination from "../../components/jsx/Pagination.jsx";

import Edit from "../../assets/images/edit.svg";
import Delete from "../../assets/images/delete.svg";

import "./Management.css";

const normalize = (text) =>
  (text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

// Função para cortar o texto após um limite de caracteres e adicionar "..."
const truncateText = (text, maxLength = 60) => {
  if (!text) return "-";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
};

export default function Management() {
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Estados de paginação
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(6);

  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [toast, setToast] = useState({
    isOpen: false,
    message: "",
    type: "success",
  });

  // Carrega os filmes do backend do Flicker ao abrir a tela
  useEffect(() => {
    async function fetchMovies() {
      setLoading(true);
      try {
        const data = await getMovies();
        setMovies(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erro ao carregar filmes:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMovies();
  }, []);

  // Reseta para a primeira página sempre que o termo de busca mudar
  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  // Lógica de exclusão de filme
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    try {
      await deleteMovie(itemToDelete.id);
      setMovies((prev) => prev.filter((m) => m.id !== itemToDelete.id));
      setToast({ isOpen: true, message: "Filme excluído com sucesso!", type: "success" });
      setItemToDelete(null);
    } catch (err) {
      console.error(err);
      setToast({ isOpen: true, message: "Erro ao excluir filme.", type: "warning" });
    } finally {
      setDeleting(false);
    }
  };

  // Filtra os filmes dinamicamente com base no título
  const filteredMovies = movies.filter((movie) =>
    normalize(movie.titulo).includes(normalize(searchTerm))
  );

  // Cálculos da paginação
  const totalPages = Math.max(1, Math.ceil(filteredMovies.length / rowsPerPage));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedMovies = filteredMovies.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="app">
      <div className="app-container">
        <main className="main-wrapper">
          <div className="page-title">
            <h1>Gerenciamento de Filmes</h1>
          </div>

          <div className="management-header-actions">
            <span className="results-count">
              Total de filmes: {filteredMovies.length}
            </span>
          </div>

          {/* Tabela de listagem seguindo o design do Figma */}
          <div className="table-container">
            {loading ? (
              <p className="home-status">Carregando dados...</p>
            ) : (
              <>
                <table>
                  <thead>
                    <tr>
                      <th style={{ textAlign: "left" }}>Nome</th>
                      <th style={{ textAlign: "left" }}>Descrição</th>
                      <th style={{ textAlign: "center" }}>Data de aprovação</th>
                      <th style={{ textAlign: "right" }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedMovies.length > 0 ? (
                      paginatedMovies.map((movie) => (
                        <tr key={movie.id}>
                          <td className="movie-name-cell" style={{ textAlign: "left" }}>
                            {movie.titulo}
                          </td>
                          {/* Exibe o texto cortado por caracteres e mostra o texto completo no hover (title) */}
                          <td className="table-description" style={{ textAlign: "left" }} title={movie.sinopse}>
                            {truncateText(movie.sinopse, 50)}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            {movie.data_aprovacao || movie.criado_em || "-"}
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <div className="action-buttons-group" style={{ justifyContent: "flex-end" }}>
                              <button
                                className="action-btn edit"
                                title="Editar"
                                onClick={() => navigate(`/filme/editar?id=${movie.id}`)}
                              >
                                <img src={Edit} alt="Editar" />
                              </button>
                              <button
                                className="action-btn delete"
                                title="Deletar"
                                onClick={() => setItemToDelete(movie)}
                              >
                                <img src={Delete} alt="Deletar" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} style={{ textAlign: "center", padding: "20px" }}>
                          Nenhum registro encontrado.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                <Pagination
                  total={filteredMovies.length}
                  page={currentPage}
                  rowsPerPage={rowsPerPage}
                  onPageChange={setPage}
                  onRowsPerPageChange={(n) => {
                    setRowsPerPage(n);
                    setPage(1);
                  }}
                />
              </>
            )}
          </div>
        </main>
      </div>

      <ToastNotification
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Modal simples de confirmação de exclusão */}
      {itemToDelete && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Deseja excluir "{itemToDelete.titulo}"?</h3>
            <p>Esta ação não poderá ser desfeita.</p>
            <div className="modal-actions">
              <button 
                className="btn-cancel" 
                onClick={() => setItemToDelete(null)}
                disabled={deleting}
              >
                Cancelar
              </button>
              <button 
                className="btn-confirm-delete" 
                onClick={handleConfirmDelete}
                disabled={deleting}
              >
                {deleting ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}