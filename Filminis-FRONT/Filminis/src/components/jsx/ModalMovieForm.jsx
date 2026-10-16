import { useEffect, useRef, useState } from "react"
import MultiSelect from "./MultiSelect"
import "../css/ModalMovieForm.css"

const MAX_LENGTH = 1000
const REQUIRED = "Por favor, preencha esse campo para continuar"

const INITIAL = {
    titulo: "",
    data: "",
    duracao: "",
    orcamento: "",
    sinopse: "",
    produtoras: [],
    categorias: [],
    diretores: [],
    atores: [],
    paises: [],
    linguagens: [],
}

export default function ModalMovieForm({ isOpen, options, loading, error, onSubmit, onCancel }) {
    const [form, setForm] = useState(INITIAL)
    const [poster, setPoster] = useState(null)
    const [dragging, setDragging] = useState(false)
    const [errors, setErrors] = useState({})
    const [formError, setFormError] = useState("")
    const fileRef = useRef(null)

    useEffect(() => {
        if (isOpen) {
            setForm(INITIAL)
            setPoster(null)
            setErrors({})
            setFormError("")
        }
    }, [isOpen])

    useEffect(() => {
        if (!isOpen) return
        const onKey = (e) => e.key === "Escape" && onCancel()
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [isOpen, onCancel])

    if (!isOpen) return null

    const set = (name, value) => {
        setForm((prev) => ({ ...prev, [name]: value }))
        setErrors((prev) => ({ ...prev, [name]: "" }))
    }

    const handleChange = (e) => set(e.target.name, e.target.value)

    function pickFile(file) {
        if (!file) return
        if (!file.type.startsWith("image/")) {
            setFormError("Selecione um arquivo de imagem.")
            return
        }
        setFormError("")
        setPoster(file)
    }

    function handleSubmit(e) {
        e.preventDefault()
        const errs = {}

        if (!form.titulo.trim()) errs.titulo = REQUIRED
        if (!form.data) errs.data = REQUIRED
        if (!form.duracao) errs.duracao = REQUIRED
        if (!form.sinopse.trim()) errs.sinopse = REQUIRED
        else if (form.sinopse.length > MAX_LENGTH) errs.sinopse = "Texto muito longo."
        if (form.categorias.length === 0) errs.categorias = "Selecione ao menos um gênero"
        if (form.produtoras.length === 0) errs.produtoras = "Selecione ao menos uma produtora"

        if (Object.keys(errs).length) {
            setErrors(errs)
            setFormError("Por favor, verifique os campos destacados.")
            return
        }

        setFormError("")
        onSubmit({ form, poster })
    }

    const opt = (key) => options[key] ?? []

    return (
        <div className="mf-overlay" onClick={onCancel}>
            <form
                className="mf-box"
                role="dialog"
                aria-modal="true"
                onClick={(e) => e.stopPropagation()}
                onSubmit={handleSubmit}
            >
                <button type="button" className="mf-close" onClick={onCancel} aria-label="Fechar">×</button>

                <h2 className="mf-title">Cadastrar Filme</h2>
                <p className="mf-subtitle">
                    Insira os dados do filme desejado. Sua solicitação será analisada e
                    aprovada por um administrador antes de entrar na plataforma.
                </p>

                <label className="mf-field">
                    <span>Título</span>
                    <input name="titulo" value={form.titulo} onChange={handleChange} placeholder="Título" />
                    {errors.titulo && <small className="mf-error">{errors.titulo}</small>}
                </label>

                <label className="mf-field">
                    <span>Data de lançamento</span>
                    <input name="data" type="date" value={form.data} onChange={handleChange} />
                    {errors.data && <small className="mf-error">{errors.data}</small>}
                </label>

                <MultiSelect label="Produtora" placeholder="Produtora" options={opt("produtoras")}
                    value={form.produtoras} onChange={(v) => set("produtoras", v)} error={errors.produtoras} />

                <MultiSelect label="Gênero" placeholder="Gênero" options={opt("categorias")}
                    value={form.categorias} onChange={(v) => set("categorias", v)} error={errors.categorias} />

                <MultiSelect label="Direção" placeholder="Diretor" options={opt("diretores")}
                    value={form.diretores} onChange={(v) => set("diretores", v)} />

                <MultiSelect label="Elenco" placeholder="Elenco" options={opt("atores")}
                    value={form.atores} onChange={(v) => set("atores", v)} />

                <MultiSelect label="Origem" placeholder="Origem" options={opt("paises")}
                    value={form.paises} onChange={(v) => set("paises", v)} />

                <MultiSelect label="Idioma" placeholder="Idioma" options={opt("linguagens")}
                    value={form.linguagens} onChange={(v) => set("linguagens", v)} />

                <label className="mf-field">
                    <span>Duração (horas:minutos)</span>
                    <input
                        name="duracao"
                        type="time"
                        step="60"
                        value={form.duracao}
                        onChange={handleChange}
                    />
                    {errors.duracao && <small className="mf-error">{errors.duracao}</small>}
                </label>

                <label className="mf-field">
                    <span>Orçamento (R$)</span>
                    <input name="orcamento" inputMode="numeric" value={form.orcamento}
                        onChange={(e) => set("orcamento", e.target.value.replace(/\D/g, ""))}
                        placeholder="Somente números" />
                </label>

                <label className="mf-field">
                    <span>Descrição</span>
                    <textarea name="sinopse" rows={4} value={form.sinopse} onChange={handleChange}
                        placeholder="Descrição" />
                    <small className="mf-counter">{form.sinopse.length}/{MAX_LENGTH} caracteres</small>
                    {errors.sinopse && <small className="mf-error">{errors.sinopse}</small>}
                </label>

                <p className="mf-section">Pôster do filme</p>

                <div
                    className={`mf-dropzone ${dragging ? "dragging" : ""}`}
                    onClick={() => fileRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={(e) => { e.preventDefault(); setDragging(false); pickFile(e.dataTransfer.files[0]) }}
                >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                         strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 16V4M6 10l6-6 6 6M4 20h16" />
                    </svg>
                    <p>
                        {poster ? <strong>{poster.name}</strong> : <>Drag and drop files here <br />or <u>browse</u> to upload.</>}
                    </p>
                    <input ref={fileRef} type="file" accept="image/*" hidden
                        onChange={(e) => { pickFile(e.target.files[0]); e.target.value = "" }} />
                </div>

                {(formError || error) && <p className="mf-form-error">{formError || error}</p>}

                <button type="submit" className="mf-submit" disabled={loading}>
                    {loading ? "Enviando..." : "Enviar Solicitação"}
                </button>
            </form>
        </div>
    )
}