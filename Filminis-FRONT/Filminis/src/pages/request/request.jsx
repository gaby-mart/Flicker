import { useCallback, useEffect, useState } from "react"

import { getRequests, updateRequestStatus } from "../../service/request"
import { getPendingMovies, getIdMovie, approveMovie, updateMovie, deleteMovie } from "../../service/http"
import { pick, movieRows } from "../../service/movieFormat"
import useMovieOptions from "../../hooks/useMovieOptions"
import ToastNotification from "../../components/jsx/ToastNotification"

import "./request.css"

const LABELS = {
    titulo: "Título",
    ano: "Ano",
    sinopse: "Sinopse",
    duracao: "Duração",
    orcamento: "Orçamento",
    imagem: "Pôster",
    categorias: "Gêneros",
    produtoras: "Produtoras",
    diretores: "Direção",
    atores: "Elenco",
    paises: "Origem",
    linguagens: "Idiomas",
}

const labelOf = (o) => [o.nome ?? o.name, o.sobrenome].filter(Boolean).join(" ")

// id do item
const idOf = (o) =>
    o.id ?? Object.entries(o).find(([k]) => k.startsWith("id_") && k !== "id_genero")?.[1]

function formatValue(key, val, lists) {
    if (Array.isArray(val)) {
        const list = lists[key] ?? []
        const names = val.map((id) => {
            const found = list.find((o) => Number(idOf(o)) === Number(id))
            return found ? labelOf(found) : `#${id}`
        })
        return names.join(", ") || "—"
    }

    if (key === "orcamento") {
        const n = Number(val)
        return Number.isNaN(n)
            ? String(val)
            : n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
    }

    if (key === "duracao") {
        const [h = "0", m = "0"] = String(val).split(":")
        return `${Number(h)}h ${m.padStart(2, "0")}min`
    }

    if (key === "imagem") return "Novo pôster enviado"

    return String(val)
}

function MovieInfo({ movie }) {
    return (
        <>
            <ul className="request-meta">
                {movieRows(movie).map(([label, value]) => (
                    <li key={label}>
                        <strong>{label}:</strong> {value}
                    </li>
                ))}
            </ul>

            <p className="request-description">
                {pick(movie, "sinopse") || "Sem sinopse disponível."}
            </p>
        </>
    )
}

export default function Request() {
    const [requests, setRequests] = useState([])
    const [lists, setLists] = useState({})
    const [loading, setLoading] = useState(true)
    const [busyKey, setBusyKey] = useState(null)
    const [toast, setToast] = useState({ isOpen: false, message: "", type: "success" })

    const { loadOptions } = useMovieOptions()

    const closeToast = useCallback(
        () => setToast((prev) => ({ ...prev, isOpen: false })),
        []
    )

    const notify = (message, type = "success") =>
        setToast({ isOpen: true, message, type })

    useEffect(() => {
        loadData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    async function loadData() {
        setLoading(true)

        // Listas de nomes para traduzir os ids dos pedidos de edição
        try {
            setLists(await loadOptions())
        } catch (err) {
            console.error("Erro ao carregar listas:", err)
        }

        // Adições: filmes pendentes no banco (GET /filmesPendentes)
        let additions = []
        try {
            const pending = await getPendingMovies()
            const list = Array.isArray(pending) ? pending : []

            additions = await Promise.all(
                list.map(async (m) => {
                    // tenta buscar o filme completo; se não achar, usa o que a listagem trouxe
                    const detail = await getIdMovie(m.id)
                    const movie = { ...m, ...(detail ?? {}) }

                    return {
                        key: `add-${m.id}`,
                        tipo: "adicionar",
                        id_filme: m.id,
                        titulo: movie.titulo,
                        poster: pick(movie, "imagem", "poster"),
                        movie,
                    }
                })
            )
        } catch (err) {
            console.error(err)
            notify("Não foi possível carregar os filmes pendentes.", "warning")
        }

        // Edições e exclusões
        const changes = getRequests()
            .filter((r) => r.status === "pendente")
            .map((r) => ({ ...r, key: `req-${r.id}` }))

        setRequests([...additions, ...changes])
        setLoading(false)
    }

    const removeFromList = (key) =>
        setRequests((prev) => prev.filter((r) => r.key !== key))

    async function handleAccept(req) {
        setBusyKey(req.key)

        try {
            if (req.tipo === "adicionar") {
                await approveMovie(req.id_filme)
            } else {
                if (req.tipo === "editar") await updateMovie(req.id_filme, req.alteracoes)
                if (req.tipo === "excluir") await deleteMovie(req.id_filme)

                await updateRequestStatus(req.id, "aprovado")
            }

            removeFromList(req.key)
            notify("Solicitação aprovada e aplicada com sucesso!")
        } catch (err) {
            console.error(err)
            notify(err.message || "Erro ao processar a solicitação.", "warning")
        } finally {
            setBusyKey(null)
        }
    }

    async function handleReject(req) {
        setBusyKey(req.key)

        try {
            if (req.tipo === "adicionar") {
                await deleteMovie(req.id_filme)
            } else {
                await updateRequestStatus(req.id, "rejeitado")
            }

            removeFromList(req.key)
            notify("Solicitação rejeitada.")
        } catch (err) {
            console.error(err)
            notify(err.message || "Erro ao rejeitar a solicitação.", "warning")
        } finally {
            setBusyKey(null)
        }
    }

    return (
        <section className="requests">
            <div className="page-title">
                <h1>Solicitações Pendentes</h1>
            </div>

            <div className="requests-list-container">
                {loading && <p className="no-requests">Carregando solicitações...</p>}

                {!loading && requests.length === 0 && (
                    <p className="no-requests">Nenhuma solicitação pendente no momento.</p>
                )}

                {!loading &&
                    requests.map((req) => (
                        <div key={req.key} className="request-card">
                            <div className="request-poster-wrapper">
                                {req.poster ? (
                                    <img src={req.poster} alt={req.titulo} className="request-poster" />
                                ) : (
                                    <div className="request-poster request-poster-empty" />
                                )}
                            </div>

                            <div className="request-content">
                                <div className="request-card-header">
                                    <h3>{req.titulo}</h3>
                                    {req.tipo === "excluir" && <span className="badge-action delete-badge">Deletar</span>}
                                    {req.tipo === "adicionar" && <span className="badge-action add-badge">Adicionar</span>}
                                    {req.tipo === "editar" && <span className="badge-action edit-badge">Editar</span>}
                                </div>

                                {req.tipo === "excluir" && (
                                    <div className="request-details">
                                        <p className="request-label">Motivo da solicitação:</p>
                                        <p className="request-text-block">
                                            {req.motivo || "Nenhum motivo informado."}
                                        </p>
                                    </div>
                                )}

                                {req.tipo === "adicionar" && <MovieInfo movie={req.movie} />}

                                {req.tipo === "editar" && (
                                    <div className="request-details">
                                        <p className="request-label">Itens Editados:</p>
                                        <ul className="edit-list">
                                            {Object.entries(req.alteracoes ?? {}).map(([key, val]) => (
                                                <li key={key}>
                                                    <strong>{LABELS[key] ?? key}:</strong>{" "}
                                                    {formatValue(key, val, lists)}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div className="request-actions">
                                    <button
                                        className="btn-accept"
                                        disabled={busyKey === req.key}
                                        onClick={() => handleAccept(req)}
                                    >
                                        {busyKey === req.key ? "Processando..." : "Aceitar"}
                                    </button>
                                    <button
                                        className="btn-reject"
                                        disabled={busyKey === req.key}
                                        onClick={() => handleReject(req)}
                                    >
                                        Rejeitar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>

            <ToastNotification
                isOpen={toast.isOpen}
                message={toast.message}
                type={toast.type}
                onClose={closeToast}
            />
        </section>
    )
}