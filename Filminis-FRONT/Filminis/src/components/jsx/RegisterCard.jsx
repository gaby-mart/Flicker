import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { login } from "../../service/auth"

import "../css/RegisterCard.css"

export default function LoginCard() {
    const navigate = useNavigate()

    const [form, setForm] = useState({ email: "", password: "" })
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

    async function handleSubmit(e) {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            await login(form.email, form.password)
            navigate("/", { replace: true })
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form className="auth-card" onSubmit={handleSubmit}>
            <h1 className="auth-title">Fazer Login</h1>

            <input
                className="auth-input"
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
            />

            <input
                className="auth-input"
                type="password"
                name="password"
                placeholder="Senha"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
            />

            {error && <p className="auth-error">{error}</p>}

            <button className="auth-submit" type="submit" disabled={loading}>
                {loading ? "Entrando..." : "Entrar"}
            </button>

            <p className="auth-terms">
                Ao entrar na sua conta, você declara estar ciente e de acordo
                com os Termos de Serviço e a Política de Privacidade do Flicker.
            </p>
        </form>
    )
}