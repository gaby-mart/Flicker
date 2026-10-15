import { useState } from "react"
import "../css/MovieDetailCard.css"

// Primeiro campo que existir no objeto
const pick = (obj, ...keys) => {
    for (const key of keys) {
        if (obj?.[key] !== undefined && obj[key] !== null && obj[key] !== "") {
            return obj[key]
        }
    }
    return null
}

// Aceita texto, lista de textos ou lista de objetos { nome, sobrenome }
const nameOf = (v) => {
    if (v === null || v === undefined) return ""
    if (typeof v !== "object") return String(v)
    return [v.nome ?? v.name, v.sobrenome].filter(Boolean).join(" ")
}

const toText = (value) => {
    if (value === null || value === undefined) return "—"

    const list = Array.isArray(value) ? value : [value]
    const names = list.map(nameOf).filter(Boolean)

    return names.length ? names.join(", ") : "—"
}

const formatMoney = (value) => {
    const number = Number(value)
    if (value === null || Number.isNaN(number)) return "—"
    return number.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

export default function MovieDetailCard({ movie, canEdit, onEdit, onDelete }) {
    const [favorite, setFavorite] = useState(false)

    const posterUrl = pick(movie, "imagem", "poster")

    const rows = [
        ["Ano de lançamento", toText(pick(movie, "ano"))],
        ["Duração", toText(pick(movie, "duracao"))],
        ["Produtora", toText(pick(movie, "produtoras", "produtora"))],
        ["Direção", toText(pick(movie, "diretores", "diretor"))],
        ["Atores", toText(pick(movie, "atores"))],
        ["Origem", toText(pick(movie, "paises", "pais"))],
        ["Idiomas", toText(pick(movie, "linguagens", "linguagem"))],
        ["Gêneros", toText(pick(movie, "categorias"))],
        ["Orçamento", formatMoney(pick(movie, "orcamento"))],
    ]

    const description = pick(movie, "sinopse")

    return (
        <article className="movie-detail-card">
            <img
                className="movie-detail-poster"
                src={posterUrl}
                alt={`Poster do filme ${movie.titulo}`}
            />

            <div className="movie-detail-info">
                <div className="movie-detail-head">
                    <h1 className="movie-detail-title">{movie.titulo}</h1>

                    <button
                        type="button"
                        className={`movie-detail-fav ${favorite ? "active" : ""}`}
                        onClick={() => setFavorite((f) => !f)}
                        aria-label="Favoritar"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24"
                             fill={favorite ? "currentColor" : "none"}
                             stroke="currentColor" strokeWidth="1.8"
                             strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20.8 5.6a5.5 5.5 0 0 0-7.8 0L12 6.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 22l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
                        </svg>
                    </button>
                </div>

                <ul className="movie-detail-meta">
                    {rows.map(([label, value]) => (
                        <li key={label}>
                            <strong>{label}:</strong> {value}
                        </li>
                    ))}
                </ul>

                <p className="movie-detail-description">
                    {description || "Sem sinopse disponível."}
                </p>

                {canEdit && (
                    <div className="movie-detail-actions">
                        <button type="button" className="btn-edit" onClick={onEdit}>
                            Editar
                        </button>
                        <button type="button" className="btn-delete" onClick={onDelete}>
                            Excluir
                        </button>
                    </div>
                )}
            </div>
        </article>
    )
}