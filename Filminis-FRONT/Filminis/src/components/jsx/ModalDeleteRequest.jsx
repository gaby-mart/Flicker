import { useEffect, useState } from "react"
import "../css/ModalMovieForm.css"

const MAX_LENGTH = 500
const REQUIRED = "Por favor, preencha esse campo para continuar"

export default function ModalDeleteRequest({ isOpen, movie, loading, error, onSubmit, onCancel }) {
    const [reason, setReason] = useState("")
    const [fieldError, setFieldError] = useState("")

    useEffect(() => {
        if (isOpen) {
            setReason("")
            setFieldError("")
        }
    }, [isOpen])

    useEffect(() => {
        if (!isOpen) return
        const onKey = (e) => e.key === "Escape" && onCancel()
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [isOpen, onCancel])

    if (!isOpen) return null

    function handleSubmit(e) {
        e.preventDefault()

        if (!reason.trim()) return setFieldError(REQUIRED)
        if (reason.length > MAX_LENGTH) return setFieldError("Texto muito longo.")

        setFieldError("")
        onSubmit(reason.trim())
    }

    return (
        <div className="mf-overlay" onClick={onCancel}>
            <form
                className="mf-box mf-box--small"
                role="dialog"
                aria-modal="true"
                onClick={(e) => e.stopPropagation()}
                onSubmit={handleSubmit}
            >
                <button type="button" className="mf-close" onClick={onCancel} aria-label="Fechar">×</button>

                <h2 className="mf-title">Deletar Filme</h2>
                <p className="mf-subtitle">
                    Apenas administradores podem excluir itens do catálogo. Insira o motivo
                    da solicitação para encaminhá-la para avaliação.
                </p>

                {movie && <p className="mf-movie-name">{movie.titulo}</p>}

                <label className="mf-field">
                    <span>Motivo</span>
                    <textarea
                        rows={6}
                        value={reason}
                        onChange={(e) => {
                            setReason(e.target.value)
                            setFieldError("")
                        }}
                        placeholder="Descrição"
                    />
                    <small className="mf-counter">{reason.length}/{MAX_LENGTH} caracteres</small>
                    {fieldError && <small className="mf-error">{fieldError}</small>}
                </label>

                {error && <p className="mf-form-error">{error}</p>}

                <button type="submit" className="mf-submit" disabled={loading}>
                    {loading ? "Enviando..." : "Enviar Solicitação"}
                </button>
            </form>
        </div>
    )
}