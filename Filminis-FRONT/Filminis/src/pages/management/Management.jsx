//Componentes
import { useState, useEffect, useMemo } from "react"
import ToastNotification from "../../components/jsx/ToastNotification"
import { getMovies, deleteMovie } from "../../service/http"
import Pagination from "../../components/jsx/Pagination.jsx"
import FiltersManagement from "../../components/jsx/FiltersManagement.jsx"

//Styles
import "./Management.css"

const normalizar = (texto) =>
  String(texto ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()

const toCategoryList = (categorias) =>
  (Array.isArray(categorias) ? categorias : String(categorias ?? "").split(","))
    .map((c) => String(c).trim())
    .filter(Boolean)

// Aceita texto ou lista e corta após um limite
const truncateText = (value, maxLength = 60) => {
  const text = Array.isArray(value) ? value.join(", ") : String(value ?? "")
  if (!text) return "-"
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + "..."
}

export default function Management() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)

  // Filtros
  const [busca, setBusca] = useState("")
  const [genreFilter, setGenreFilter] = useState("")
  const [sortOrder, setSortOrder] = useState("")

  // Paginação
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(6)

  // Exclusão
  const [itemToDelete, setItemToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const [toast, setToast] = useState({
    isOpen: false,
    message: "",
    type: "success",
  })

  useEffect(() => {
    async function fetchMovies() {
      setLoading(true)
      try {
        const data = await getMovies()
        setMovies(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error("Erro ao carregar filmes:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchMovies()
  }, [])

  // Volta para a primeira página quando qualquer filtro muda
  useEffect(() => {
    setPage(1)
  }, [busca, genreFilter, sortOrder])

  // Gêneros disponíveis, extraídos dos filmes
  const genres = useMemo(() => {
    const set = new Set()
    movies.forEach((m) => toCategoryList(m.categorias).forEach((c) => set.add(c)))
    return [...set].sort((a, b) => a.localeCompare(b, "pt-BR"))
  }, [movies])

  // Busca + gênero + ordenação
  const filteredMovies = useMemo(() => {
    const termo = normalizar(busca)

    const result = movies.filter(
      (movie) =>
        (!termo || normalizar(movie.titulo).includes(termo)) &&
        (!genreFilter || toCategoryList(movie.categorias).includes(genreFilter))
    )

    if (!sortOrder) return result

    return [...result].sort((a, b) =>
      sortOrder === "asc"
        ? String(a.titulo).localeCompare(String(b.titulo), "pt-BR")
        : String(b.titulo).localeCompare(String(a.titulo), "pt-BR")
    )
  }, [movies, busca, genreFilter, sortOrder])

  // Paginação
  const totalPages = Math.max(1, Math.ceil(filteredMovies.length / rowsPerPage))
  const currentPage = Math.min(page, totalPages)
  const startIndex = (currentPage - 1) * rowsPerPage
  const paginatedMovies = filteredMovies.slice(startIndex, startIndex + rowsPerPage)

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return
    setDeleting(true)
    try {
      await deleteMovie(itemToDelete.id)
      setMovies((prev) => prev.filter((m) => m.id !== itemToDelete.id))
      setToast({ isOpen: true, message: "Filme excluído com sucesso!", type: "success" })
      setItemToDelete(null)
    } catch (err) {
      console.error(err)
      setToast({ isOpen: true, message: "Erro ao excluir filme.", type: "warning" })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <section className="management">
      <div className="page-title">
        <h1>Gerenciamento de Filmes</h1>
      </div>

      <div className="management-header-actions">
        <FiltersManagement
          busca={busca}
          setBusca={setBusca}
          genres={genres}
          genreFilter={genreFilter}
          setGenreFilter={setGenreFilter}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />
      </div>

      <div className="table-container">
        {loading ? (
          <p className="home-status">Carregando dados...</p>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Descrição</th>
                  <th>Gênero</th>
                  <th>Aprovado por</th>
                  <th>Data de aprovação</th>
                </tr>
              </thead>
              <tbody>
                {paginatedMovies.length > 0 ? (
                  paginatedMovies.map((movie) => (
                    <tr key={movie.id}>
                      <td className="movie-name-cell">{movie.titulo}</td>
                      <td className="table-description" title={movie.sinopse}>
                        {truncateText(movie.sinopse, 50)}
                      </td>
                      <td className="table-description" title={String(movie.categorias ?? "")}>
                        {truncateText(movie.categorias, 50)}
                      </td>
                      <td className="table-description" title={movie.aprovado_por}>
                        {truncateText(movie.aprovado_por, 50)}
                      </td>
                      <td>{movie.data_aprovacao || movie.criado_em || "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="table-empty">
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
                setRowsPerPage(n)
                setPage(1)
              }}
            />
          </>
        )}
      </div>

      <ToastNotification
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
      />

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
    </section>
  )
}