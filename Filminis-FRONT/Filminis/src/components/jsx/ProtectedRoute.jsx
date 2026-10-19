import { useEffect, useState } from "react"
import { Navigate, Outlet, useLocation } from "react-router-dom"

import { getMe } from "../../service/http"

// Protege as minhas rotas

export default function ProtectedRoute({ role }) {
    const location = useLocation()
    const [status, setStatus] = useState("loading") 

    useEffect(() => {
        let ativo = true

        getMe()
            .then((user) => {
                if (!ativo) return
                setStatus(!role || user.role === role ? "ok" : "forbidden")
            })
            .catch(() => {
                if (ativo) setStatus("guest")
            })

        return () => {
            ativo = false
        }
    }, [role])

    if (status === "loading") return null
    if (status === "guest") return <Navigate to="/login" replace state={{ from: location }} />
    if (status === "forbidden") return <Navigate to="/" replace />

    return <Outlet />
}