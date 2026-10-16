//Coisa React
import { useCallback, useEffect, useMemo, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

//Componentes
import {
    getMovies,
    requestMovie,
    getCategories,
    getProducers,
    getDirectors,
    getActors,
    getCountries,
    getLanguages,
} from "../../service/http"
import { isLoggedIn } from "../../service/auth"
import { uploadImage } from "../../service/upload"
import MovieList from "../../components/jsx/MovieList"
import { FiltersMovies } from "../../components/jsx/FiltersMovies"
import Hero from "../../components/jsx/Hero.jsx"
import ModalMovieForm from "../../components/jsx/ModalMovieForm"
import ToastNotification from "../../components/jsx/ToastNotification"

//Styles
import "../../styles/global.css"
import "./Home.css"
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

// HH:MM:SS
const toTimeValue = (value) => {
    const [h = "00", m = "00"] = String(value).split(":")
    return `${h.padStart(2, "0")}:${m.padStart(2, "0")}:00`
}

export default function Home() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const busca = searchParams.get("busca") ?? ""

    const [movies, setMovies] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    // Filtros e paginação
    const [genreFilter, setGenreFilter] = useState("")
    const [sortOrder, setSortOrder] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    // Modal de solicitação de filme
    const [modalOpen, setModalOpen] = useState(false)
    const [sending, setSending] = useState(false)
    const [modalError, setModalError] = useState("")
    const [options, setOptions] = useState({})

    // Toast
    const [toast, setToast] = useState({ isOpen: false, message: "", type: "success" })

    const closeToast = useCallback(
        () => setToast((prev) => ({ ...prev, isOpen: false })),
        []
    )

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

    // Volta para a página 1 quando filtro ou busca mudam
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

    const totalPages = Math.ceil(filteredMovies.length / itemsPerPage) || 1

    const paginatedMovies = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage
        return filteredMovies.slice(start, start + itemsPerPage)
    }, [filteredMovies, currentPage])

    // Abre o modal e carrega as listas 
    async function openRequestModal() {
        if (!isLoggedIn()) return navigate("/login")

        setModalError("")
        setModalOpen(true)

        if (Object.keys(options).length === 0) {
            const [categorias, produtoras, diretores, atores, paises, linguagens] =
                await Promise.all(
                    [
                        getCategories(),
                        getProducers(),
                        getDirectors(),
                        getActors(),
                        getCountries(),
                        getLanguages(),
                    ].map((p) => p.catch(() => []))
                )

            setOptions({ categorias, produtoras, diretores, atores, paises, linguagens })
        }
    }

    // Envia a solicitação
    async function handleSubmitRequest({ form, poster }) {
        setSending(true)
        setModalError("")

        try {
            await requestMovie({
                titulo: form.titulo.trim(),
                ano: new Date(form.data).getFullYear(),
                sinopse: form.sinopse.trim(),
                duracao: toTimeValue(form.duracao), 
                orcamento: form.orcamento || "0",
                imagem: poster ? await uploadImage(poster) : null,
                categoria_id: form.categorias,
                produtora_id: form.produtoras,
                diretor_id: form.diretores,
                atores_ids: form.atores,
                pais_origem_id: form.paises,
                linguagem_id: form.linguagens,
            })

            setModalOpen(false)
            setToast({
                isOpen: true,
                message: "Solicitação enviada com sucesso! Aguarde a análise de um administrador.",
                type: "success",
            })
        } catch (err) {
            setModalError(err.message)
            setToast({
                isOpen: true,
                message: "Não foi possível enviar a solicitação.",
                type: "warning",
            })
        } finally {
            setSending(false)
        }
    }

    return (
        <section className="home">
            {/*HeroBanner*/}
            {!loading && !error && <Hero movies={movies.slice(0, 5)} />}

            <h2 className="section-title-center">RECOMENDAÇÕES</h2>

            <FiltersMovies
                genres={genres}
                genreFilter={genreFilter}
                setGenreFilter={setGenreFilter}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                onRequestMovie={openRequestModal}
            />

            {loading && <p className="home-status">Carregando os filmes...</p>}
            {error && <p className="home-status">{error}</p>}

            {!loading && !error && (
                <>
                    <MovieList movies={paginatedMovies} />

                    {/* Controles de paginação */}
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

            <ModalMovieForm
                isOpen={modalOpen}
                options={options}
                loading={sending}
                error={modalError}
                onSubmit={handleSubmitRequest}
                onCancel={() => setModalOpen(false)}
            />

            <ToastNotification
                isOpen={toast.isOpen}
                message={toast.message}
                type={toast.type}
                onClose={closeToast}
            />
        </section>
    )
}