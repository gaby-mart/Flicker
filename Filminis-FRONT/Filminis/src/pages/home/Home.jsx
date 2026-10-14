import { useEffect, useMemo, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

import { getMovies } from "../../service/http"
import MovieList from "../../components/jsx/MovieList"
import { FiltersMovies } from "../../components/jsx/FiltersMovies"
import "../../styles/global.css"
import "../../components/css/Pagination.css" 

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

export default function Home() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const busca = searchParams.get("busca") ?? ""

    const [movies, setMovies] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    // Status filtros e paginação
    const [genreFilter, setGenreFilter] = useState("")
    const [sortOrder, setSortOrder] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10 // Limite de 5 cards por página

    useEffect(() => {
        async function loadMovies() {
            try {
                const data = await getMovies()
                setMovies(Array.isArray(data) ? data : [])
            } catch (err) {
                console.error(err)
                setError("Não foi possível carregar os filmes!")
            } finally {
                setLoading(false)
            }
        }

        loadMovies()
    }, [])

    // Reseta para a página 1 sempre que o filtro ou busca mudarem
    useEffect(() => {
        setCurrentPage(1)
    }, [busca, genreFilter, sortOrder])

    const genres = useMemo(() => {
        const set = new Set()
        movies.forEach((m) => toCategoryList(m.categorias).forEach((c) => set.add(c)))
        return [...set].sort((a, b) => a.localeCompare(b, "pt-BR"))
    }, [movies])

    const filteredMovies = useMemo(() => {
        const termo = normalizar(busca)

        const result = movies.filter((movie) => {
            const matchTitle = !termo || normalizar(movie.titulo).includes(termo)
            const matchGenre =
                !genreFilter || toCategoryList(movie.categorias).includes(genreFilter)
            return matchTitle && matchGenre
        })

        if (!sortOrder) return result

        return [...result].sort((a, b) =>
            sortOrder === "asc"
                ? String(a.titulo).localeCompare(String(b.titulo), "pt-BR")
                : String(b.titulo).localeCompare(String(a.titulo), "pt-BR")
        )
    }, [movies, busca, genreFilter, sortOrder])

    // Cálculo da paginação (apenas 5 por vez)
    const totalPages = Math.ceil(filteredMovies.length / itemsPerPage) || 1
    const paginatedMovies = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage
        return filteredMovies.slice(start, start + itemsPerPage)
    }, [filteredMovies, currentPage])

    return (
        <section className="home">
            <h2 className="section-title-center">RECOMENDAÇÕES</h2>

            <FiltersMovies
                genres={genres}
                genreFilter={genreFilter}
                setGenreFilter={setGenreFilter}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                onRequestMovie={() => navigate("/solicitar-filme")}
            />

            {loading && <p className="home-status">Carregando os filmes...</p>}
            {error && <p className="home-status">{error}</p>}

            {!loading && !error && (
                <>
                    <MovieList movies={paginatedMovies} />

                    {/* Controles de Paginação */}
                    {totalPages > 1 && (
                        <div className="pagination-container">
                            <button
                                className="pagination-arrow"
                                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                &lt;
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    className={`pagination-number ${currentPage === page ? "active" : ""}`}
                                    onClick={() => setCurrentPage(page)}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                className="pagination-arrow"
                                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                &gt;
                            </button>
                        </div>
                    )}
                </>
            )}
        </section>
    )
}