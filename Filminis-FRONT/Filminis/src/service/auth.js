const DATA_URL = import.meta.env.VITE_DATA_URL || "http://localhost:8000"

const ACCESS_KEY = "access_token"
const REFRESH_KEY = "refresh_token"

export const getToken = () => localStorage.getItem(ACCESS_KEY)
export const getRefreshToken = () => localStorage.getItem(REFRESH_KEY)

// A sessão vale enquanto houver refresh token (24h)
export const isLoggedIn = () => Boolean(getRefreshToken())

function clearTokens() {
    localStorage.removeItem(ACCESS_KEY)
    localStorage.removeItem(REFRESH_KEY)
}

// Lê o payload do JWT: { sub (e-mail), role, exp, type }
export function getUserFromToken() {
    const token = getToken()
    if (!token) return null

    try {
        const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")
        return JSON.parse(atob(base64))
    } catch {
        return null
    }
}

export const isAdmin = () => getUserFromToken()?.role === "admin"

export async function login(email, password) {
    // O backend lê form-urlencoded, não JSON
    const response = await fetch(`${DATA_URL}/send_loginho`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) throw new Error(data.error || "Falha no login")

    localStorage.setItem(ACCESS_KEY, data.access_token)
    localStorage.setItem(REFRESH_KEY, data.refresh_token)

    return data
}

async function refreshAccessToken() {
    const refresh_token = getRefreshToken()
    if (!refresh_token) return false

    const response = await fetch(`${DATA_URL}/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token }),
    })

    if (!response.ok) return false

    const data = await response.json()
    localStorage.setItem(ACCESS_KEY, data.access_token)

    return true
}

// fetch que envia o token e tenta renovar uma vez se vier 401
export async function authFetch(path, options = {}) {
    const doFetch = () =>
        fetch(`${DATA_URL}${path}`, {
            ...options,
            headers: {
                ...options.headers,
                Authorization: `Bearer ${getToken()}`,
            },
        })

    let response = await doFetch()

    if (response.status === 401) {
        if (await refreshAccessToken()) {
            response = await doFetch()
        } else {
            clearTokens()
        }
    }

    return response
}

export async function getMe() {
    const response = await authFetch("/me")

    if (!response.ok) throw new Error("Não autenticado")

    return response.json()
}

export async function logout() {
    const refresh_token = getRefreshToken()

    try {
        if (refresh_token) {
            await fetch(`${DATA_URL}/logout`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refresh_token }),
            })
        }
    } catch (err) {
        console.error(err)
    } finally {
        clearTokens()
    }
}

export async function register(dados) {
    const response = await fetch(`${DATA_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
    })

    const data = await response.json()

    if (!response.ok) throw new Error(data.error || "Erro ao cadastrar usuário")

    return data
}
