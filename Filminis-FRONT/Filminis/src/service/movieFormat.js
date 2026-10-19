// service/movieFormat.js
// Helpers de formatação compartilhados entre MovieDetailCard e a tela de solicitações.

export const pick = (obj, ...keys) => {
    for (const key of keys) {
        if (obj?.[key] !== undefined && obj[key] !== null && obj[key] !== "") {
            return obj[key]
        }
    }
    return null
}

const nameOf = (v) => {
    if (v === null || v === undefined) return ""
    if (typeof v !== "object") return String(v)
    return [v.nome ?? v.name, v.sobrenome].filter(Boolean).join(" ")
}

export const toText = (value) => {
    if (value === null || value === undefined) return "—"

    const list = Array.isArray(value) ? value : [value]
    const names = list.map(nameOf).filter(Boolean)

    return names.length ? names.join(", ") : "—"
}

export const formatMoney = (value) => {
    const number = Number(value)
    if (value === null || Number.isNaN(number)) return "—"
    return number.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

// "03:15:00" -> "3h 15min"
export const formatDuration = (value) => {
    if (!value) return "—"
    const [h = "0", m = "0"] = String(value).split(":")
    return `${Number(h)}h ${m.padStart(2, "0")}min`
}

// Mesmas linhas do card de detalhes do filme
export const movieRows = (movie) => [
    ["Ano de lançamento", toText(pick(movie, "ano"))],
    ["Duração", formatDuration(pick(movie, "duracao"))],
    ["Produtora", toText(pick(movie, "produtoras", "produtora"))],
    ["Direção", toText(pick(movie, "diretores", "diretor"))],
    ["Atores", toText(pick(movie, "atores"))],
    ["Origem", toText(pick(movie, "paises", "pais"))],
    ["Idiomas", toText(pick(movie, "linguagens", "linguagem"))],
    ["Gêneros", toText(pick(movie, "categorias"))],
    ["Orçamento", formatMoney(pick(movie, "orcamento"))],
]