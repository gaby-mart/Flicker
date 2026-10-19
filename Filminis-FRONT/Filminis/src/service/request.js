const KEY = "movie_requests"

const readAll = () => {
    try {
        return JSON.parse(localStorage.getItem(KEY)) ?? []
    } catch {
        return []
    }
}

const writeAll = (list) => localStorage.setItem(KEY, JSON.stringify(list))

function save(request) {
    const list = readAll()
    list.push({
        ...request,
        id: Date.now(),
        status: "pendente",
        criado_em: new Date().toISOString(),
    })
    writeAll(list)
}

// Usuário
export async function requestDelete(movie, motivo = "") {
    save({
        tipo: "excluir",
        id_filme: movie.id,
        titulo: movie.titulo,
        poster: movie.poster || movie.imagem || null,
        motivo,
    })
}

// Usuário
export async function requestEdit(movie, alteracoes = {}) {
    save({
        tipo: "editar",
        id_filme: movie.id,
        titulo: movie.titulo,
        poster: movie.poster || movie.imagem || null,
        alteracoes,
    })
}

// Admin
export const getRequests = () => readAll()

export async function updateRequestStatus(requestId, status) {
    writeAll(readAll().map((r) => (r.id === requestId ? { ...r, status } : r)))
}