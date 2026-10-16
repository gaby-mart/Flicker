const labelOf = (o) =>
    [o.nome ?? o.name, o.sobrenome].filter(Boolean).join(" ") || `#${o.id}`

export default function MultiSelect({ label, placeholder, options = [], value = [], onChange, error }) {
    const selected = options.filter((o) => value.includes(o.id))
    const available = options.filter((o) => !value.includes(o.id))

    return (
        <label className="mf-field">
            <span>{label}</span>

            <select
                value=""
                onChange={(e) => {
                    const id = Number(e.target.value)
                    if (id) onChange([...value, id])
                }}
            >
                <option value="">{placeholder}</option>
                {available.map((o) => (
                    <option key={o.id} value={o.id}>{labelOf(o)}</option>
                ))}
            </select>

            {selected.length > 0 && (
                <div className="mf-chips">
                    {selected.map((o) => (
                        <span key={o.id} className="mf-chip">
                            {labelOf(o)}
                            <button type="button" onClick={() => onChange(value.filter((v) => v !== o.id))}>
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            )}

            {error && <small className="mf-error">{error}</small>}
        </label>
    )
}