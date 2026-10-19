import { useCallback, useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

import { getIdMovie } from "../../service/http"
import { isLoggedIn } from "../../service/auth"
import { requestDelete, requestEdit } from "../../service/request"
import { uploadImage } from "../../service/upload"
import useMovieOptions from "../../hooks/useMovieOptions"
import MovieDetailCard from "../../components/jsx/MovieDetailCard"
import ModalMovieForm from "../../components/jsx/ModalMovieForm"
import ModalDeleteRequest from "../../components/jsx/ModalDeleteRequest"
import ToastNotification from "../../components/jsx/ToastNotification"

import "./MovieDetail.css"

export default function MovieDetail() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const id = searchParams.get("id")

    const [movie, setMovie] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    // Modais
    const { options, loadOptions } = useMovieOptions()
    const [editOpen, setEditOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [sending, setSending] = useState(false)
    const [modalError, setModalError] = useState("")

    // Toast
    const [toast, setToast] = useState({ isOpen: false, message: "", type: "success" })
    const closeToast = useCallback(
        () => setToast((prev) => ({ ...prev, isOpen: false })),
        []
    )

    useEffect(() => {
        async function loadMovie() {
            setLoading(true)
            setError("")

            try {
                const data = await getIdMovie(id)
                const found = Array.isArray(data) ? data[0] : data

                if (!found || found.error) {
                    setError("Não foi possível carregar este filme.")
                } else {
                    setMovie(found)
                }
            } catch (err) {
                console.error(err)
                setError("Erro ao carregar detalhes do filme.")
            } finally {
                setLoading(false)
            }
        }

        if (id) {
            loadMovie()
        } else {
            setError("Filme não informado.")
            setLoading(false)
        }
    }, [id])

    async function openEditModal() {
        if (!isLoggedIn()) return navigate("/login")

        setModalError("")
        try {
            await loadOptions()
            setEditOpen(true)
        } catch (err) {
            console.error(err)
            setToast({
                isOpen: true,
                message: "Erro ao carregar opções para edição.",
                type: "warning",
            })
        }
    }

    // Edição
    async function handleSubmitEdit({ form, poster }) {
        setSending(true)
        setModalError("")

        try {
            const alteracoes = {
                titulo: form.titulo.trim(),
                ano: new Date(form.data).getFullYear(),
                sinopse: form.sinopse.trim(),
                duracao: `${form.duracao.slice(0, 5)}:00`,
                orcamento: String(form.orcamento || "0"),
                categorias: form.categorias,
                produtoras: form.produtoras,
                diretores: form.diretores,
                atores: form.atores,
                paises: form.paises,
                linguagens: form.linguagens,
            }

            if (poster) {
                alteracoes.imagem = await uploadImage(poster)
            }

            await requestEdit(movie, alteracoes)

            setEditOpen(false)
            setToast({
                isOpen: true,
                message: "Solicitação de edição enviada! Aguarde a análise de um administrador.",
                type: "success",
            })
        } catch (err) {
            setModalError(err.message || "Erro desconhecido")
            setToast({
                isOpen: true,
                message: "Não foi possível enviar a solicitação.",
                type: "warning",
            })
        } finally {
            setSending(false)
        }
    }

    // Exclusão
    function openDeleteModal() {
        if (!isLoggedIn()) return navigate("/login")

        setModalError("")
        setDeleteOpen(true)
    }

    async function handleSubmitDelete(reason) {
        setSending(true)
        setModalError("")

        try {
            await requestDelete(movie, reason)

            setDeleteOpen(false)
            setToast({
                isOpen: true,
                message: "Solicitação de exclusão enviada! Aguarde a análise de um administrador.",
                type: "success",
            })
        } catch (err) {
            setModalError(err.message || "Erro ao solicitar exclusão")
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
        <section className="movie-detail-page">
            {loading && <p className="movie-detail-status">Carregando detalhes...</p>}
            {!loading && error && <p className="movie-detail-status">{error}</p>}

            {!loading && !error && movie && (
                <MovieDetailCard
                    movie={movie}
                    onEdit={openEditModal}
                    onDelete={openDeleteModal}
                />
            )}

            <ModalMovieForm
                isOpen={editOpen}
                mode="edit"
                initialData={movie}
                options={options}
                loading={sending}
                error={modalError}
                onSubmit={handleSubmitEdit}
                onCancel={() => setEditOpen(false)}
            />

            <ModalDeleteRequest
                isOpen={deleteOpen}
                movie={movie}
                loading={sending}
                error={modalError}
                onSubmit={handleSubmitDelete}
                onCancel={() => setDeleteOpen(false)}
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