// ATENÇÃO: enquanto o backend não tiver endpoint de solicitações,
// os pedidos ficam só neste navegador (localStorage). O admin NÃO os verá
// em outro computador. Troque o corpo destas funções por chamadas à API
// quando o endpoint existir.
const KEY = "movie_requests"

const readAll = () => {
    try {
        return JSON.parse(localStorage.getItem(KEY)) ?? []
    } catch {
        return []
    }
}

function save(request) {
    const list = readAll()
    list.push({
        ...request,
        id: Date.now(),
        status: "pendente",
        criado_em: new Date().toISOString(),
    })
    localStorage.setItem(KEY, JSON.stringify(list))
}

export async function requestDelete(movie, motivo = "") {
    save({ tipo: "excluir", id_filme: movie.id, titulo: movie.titulo, motivo })
}

export async function requestEdit(movie, alteracoes = {}) {
    save({ tipo: "editar", id_filme: movie.id, titulo: movie.titulo, alteracoes })
}

export const getRequests = () => readAll()

// Novas funções úteis seguindo a mesma lógica:

// Atualiza o status de uma solicitação (ex: para "aprovado" ou "rejeitado")
export async function updateRequestStatus(requestId, novoStatus) {
    const list = readAll()
    const updatedList = list.map(req => 
        req.id === requestId ? { ...req, status: novoStatus } : req
    )
    localStorage.setItem(KEY, JSON.stringify(updatedList))
}

// Remove uma solicitação do armazenamento local
export async function deleteRequest(requestId) {
    const list = readAll()
    const filteredList = list.filter(req => req.id !== requestId)
    localStorage.setItem(KEY, JSON.stringify(filteredList))
}