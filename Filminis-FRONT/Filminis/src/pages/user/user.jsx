import { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { getMe } from "../../service/http"
import { logout } from "../../service/auth" // ajuste para a sua função de logout

import "./user.css"

import logoutImg from "../../assets/images/logout.svg"

export default function User() {
    const navigate = useNavigate()

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const closeToast = useCallback(
        () => setToast((prev) => ({ ...prev, isOpen: false })),
        []
    )

    useEffect(() => {
        async function load() {
            try {
                setUser(await getMe())
            } catch (err) {
                console.error(err)
                setToast({
                    isOpen: true,
                    message: err.message || "Não foi possível carregar seus dados.",
                    type: "warning",
                })
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    function handleLogout() {
        logout()
        navigate("/login")
    }

    if (loading) return <p className="profile-status">Carregando seus dados...</p>
    if (!user) return <p className="profile-status">Não foi possível carregar seus dados.</p>

    const displayName = user.apelido || user.nome

    return (
        <section className="profile">
            <aside className="profile-card profile-side">
                {user.foto ? (
                    <img src={user.foto} alt={displayName} className="profile-avatar" />
                ) : (
                    <div className="profile-avatar profile-avatar-empty">
                        {user.nome?.[0]?.toUpperCase()}
                    </div>
                )}

                <h2 className="profile-name">{displayName}</h2>

                <button type="button" className="profile-logout" onClick={handleLogout}>
                    <img src={logoutImg} alt="Encerrar sessão"/>
                    Logout
                </button>
            </aside>

            <div className="profile-card profile-data">
                <h1>Dados do usuário</h1>

                <div className="profile-field">
                    <span>Nome</span>
                    <div className="profile-value">{user.nome || "—"}</div>
                </div>

                <div className="profile-field">
                    <span>Apelido</span>
                    <div className="profile-value">{user.apelido || "—"}</div>
                </div>

                <div className="profile-field">
                    <span>Email</span>
                    <div className="profile-value">{user.email || "—"}</div>
                </div>
            </div>
        </section>
    )
}