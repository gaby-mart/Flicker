const DATA_URL = import.meta.env.VITE_DATA_URL || "http://localhost:8000"

async function get(path) {
    const response = await fetch(`${DATA_URL}${path}`)

    if (!response.ok) throw new Error(`Erro ${response.status} em ${path}`)

    return response.json()
}

// Lista todos os filmes (a busca por nome é feita no front, na Home)
export const getMovies = () => get("/listagem")

// Um filme pelo id
export async function getIdMovie(id) {
    try {
        return await get(`/filme?id=${id}`)
    } catch (erro) {
        console.error("Erro na API:", erro)
        return null
    }
}

// Listas auxiliares (úteis para filtros e formulários)
export const getActors = () => get("/atores")
export const getDirectors = () => get("/diretores")
export const getCategories = () => get("/categorias")
export const getProducers = () => get("/produtoras")
export const getLanguages = () => get("/linguagens")
export const getCountries = () => get("/paises")