import "../css/FiltersMovies.css"

const ChevronDown = () => (
    <svg className="select-arrow-icon" width="16" height="16" viewBox="0 0 24 24"
         fill="none" stroke="currentColor" strokeWidth="2"
         strokeLinecap="round" strokeLinejoin="round">
        <path d="m6 9 6 6 6-6" />
    </svg>
)

const Plus = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M12 5v14M5 12h14" />
    </svg>
)

// A em cima, Z embaixo, seta para cima
const SortAZ = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <text x="1" y="9" fontSize="8" fontWeight="700" fill="currentColor" stroke="none">A</text>
        <text x="1" y="22" fontSize="8" fontWeight="700" fill="currentColor" stroke="none">Z</text>
        <path d="M17 20V4M12 9l5-5 5 5" />
    </svg>
)

// Z em cima, A embaixo, seta para baixo
const SortZA = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <text x="1" y="9" fontSize="8" fontWeight="700" fill="currentColor" stroke="none">Z</text>
        <text x="1" y="22" fontSize="8" fontWeight="700" fill="currentColor" stroke="none">A</text>
        <path d="M17 4v16M12 15l5 5 5-5" />
    </svg>
)

export function FiltersMovies({
    genres = [],
    genreFilter,
    setGenreFilter,
    sortOrder,
    setSortOrder,
    onRequestMovie,
}) {
    return (
        <div className="filters-bar">
            {/* Dropdown de gêneros */}
            <div className="select-box">
                <select
                    value={genreFilter}
                    onChange={(e) => setGenreFilter(e.target.value)}
                    aria-label="Filtrar por gênero"
                >
                    <option value="">Gêneros</option>
                    {genres.map((genre) => (
                        <option key={genre} value={genre}>
                            {genre}
                        </option>
                    ))}
                </select>
                <ChevronDown />
            </div>

            {/* Botões A-Z / Z-A */}
            <div className="sort-buttons">
                <button
                    type="button"
                    className={`sort-btn ${sortOrder === "asc" ? "active" : ""}`}
                    onClick={() => setSortOrder(sortOrder === "asc" ? "" : "asc")}
                    title="Ordenar de A a Z"
                >
                    <SortAZ />
                </button>

                <button
                    type="button"
                    className={`sort-btn ${sortOrder === "desc" ? "active" : ""}`}
                    onClick={() => setSortOrder(sortOrder === "desc" ? "" : "desc")}
                    title="Ordenar de Z a A"
                >
                    <SortZA />
                </button>
            </div>

            {/* Solicitar novo filme */}
            <button type="button" className="request-btn" onClick={onRequestMovie}>
                <Plus />
                Solicitar Novo Filme
            </button>
        </div>
    )
}