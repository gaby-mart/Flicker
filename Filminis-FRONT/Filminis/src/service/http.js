import { authFetch } from "./auth"

const DATA_URL = import.meta.env.VITE_DATA_URL || "http://localhost:8000"

async function get(path) {
    const response = await fetch(`${DATA_URL}${path}`)
    if (!response.ok) throw new Error(`Erro ${response.status} em ${path}`)
    return response.json()
}

async function send(path, options, fallback) {
    const response = await authFetch(path, options)
    const data = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(data.error || fallback)
    return data
}

const jsonBody = (method, body) => ({
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
})

export const getMovies = () => get("/listagem")

export async function getIdMovie(id) {
    try {
        return await get(`/filme?id=${id}`)
    } catch (erro) {
        console.error("Erro na API:", erro)
        return null
    }
}

export const getActors = () => get("/atores")
export const getDirectors = () => get("/diretores")
export const getCategories = () => get("/categorias")
export const getProducers = () => get("/produtoras")
export const getLanguages = () => get("/linguagens")
export const getCountries = () => get("/paises")

export const requestMovie = (dados) =>
    send("/cadastrani", jsonBody("POST", dados), "Erro ao enviar a solicitação")

// Restrito para administradores
export const getPendingMovies = () =>
    send("/filmesPendentes", {}, "Erro ao buscar filmes pendentes")

export const approveMovie = (id) =>
    send(`/aprovafilme?id=${id}`, { method: "PUT" }, "Erro ao aprovar o filme")

export const updateMovie = (id, alteracoes) =>
    send(`/filme?id=${id}`, jsonBody("PATCH", alteracoes), "Erro ao editar o filme")

export const deleteMovie = (id) =>
    send(`/filme?id=${id}`, { method: "DELETE" }, "Erro ao excluir o filme")

export const getMe = () =>
    send("/me", {}, "Erro ao buscar os dados do usuário")

export const updateMe = (dados) =>
    send("/me", jsonBody("PATCH", dados), "Erro ao atualizar o perfil")