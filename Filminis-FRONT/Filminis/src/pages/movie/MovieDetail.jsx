import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

import { getIdMovie, deleteMovie } from "../../service/http"
import { isAdmin } from "../../service/auth"
import MovieDetailCard from "../../components/jsx/MovieDetailCard"

import "./MovieDetail.css"

export default function MovieDetail() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const id = searchParams.get("id")

    const [movie, setMovie] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        async function loadMovie() {
            setLoading(true)
            setError("")

            const data = await getIdMovie(id)
            const found = Array.isArray(data) ? data[0] : data

            if (!found || found.error) setError("Não foi possível carregar este filme.")
            else setMovie(found)

            setLoading(false)
        }

        if (id) loadMovie()
        else {
            setError("Filme não informado.")
            setLoading(false)
        }
    }, [id])

    async function handleDelete() {
        if (!window.confirm(`Excluir "${movie.titulo}"?`)) return

        try {
            await deleteMovie(id)
            navigate("/", { replace: true })
        } catch (err) {
            alert(err.message)
        }
    }

    return (
        <section className="movie-detail-page">
            {loading && <p className="movie-detail-status">Carregando detalhes...</p>}
            {!loading && error && <p className="movie-detail-status">{error}</p>}

            {!loading && !error && movie && (
                <MovieDetailCard
                    movie={movie}
                    canEdit={isAdmin()}
                    onEdit={() => navigate(`/filme/editar?id=${id}`)}
                    onDelete={handleDelete}
                />
            )}
        </section>
    )
}