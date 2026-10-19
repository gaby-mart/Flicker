import "../css/PaginationMovie.css";
import "../css/Pagination.css"

// Calcula quais números aparecem 
function getVisiblePages(current, totalPages, size = 5) {
  const count = Math.min(size, totalPages);
  const start = Math.min(
    Math.max(current - Math.floor(size / 2), 1),
    totalPages - count + 1
  );
  return Array.from({ length: count }, (_, i) => start + i);
}

export default function Pagination({
  total,
  page,
  rowsPerPage,
  rowsOptions = [6, 12, 24],
  onPageChange,
  onRowsPerPageChange,
}) {
  const totalPages = Math.max(1, Math.ceil(total / rowsPerPage));
  const firstItem = total === 0 ? 0 : (page - 1) * rowsPerPage + 1;
  const lastItem = Math.min(page * rowsPerPage, total);

  const pages = getVisiblePages(page, totalPages);

  return (
    <div className="pagination">
      {/* Lado esquerdo: linhas por página */}
      <div className="pagination-left">
        <label htmlFor="rows-per-page" className="pagination-label">
          Linhas por página
        </label>

        <select
          id="rows-per-page"
          className="pagination-select"
          value={rowsPerPage}
          onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
        >
          {rowsOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        <span className="pagination-range">
          <strong>
            {firstItem}-{lastItem}
          </strong>{" "}
          de <strong>{total}</strong>
        </span>
      </div>

      {/* Lado direito: setas  */}
      <nav className="pagination-nav" aria-label="Paginação">
        <button
          type="button"
          className="pagination-arrow"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Página anterior"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>

        {pages.map((p) => (
          <button
            key={p}
            type="button"
            className={`pagination-page ${p === page ? "active" : ""}`}
            onClick={() => onPageChange(p)}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </button>
        ))}

        <button
          type="button"
          className="pagination-arrow"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Próxima página"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </nav>
    </div>
  );
}