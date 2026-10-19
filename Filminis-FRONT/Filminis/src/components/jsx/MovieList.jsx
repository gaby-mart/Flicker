import { Link } from "react-router-dom"
import "../css/MovieList.css" 

export default function MovieList({ movies = [] }) {
    return (
        <section className="movie-section">
            {movies.length === 0 ? (
                <p className="home-status">Nenhum filme encontrado.</p>
            ) : (
                <div className="movie-grid">
                    {movies.map((movie) => (
                        <article key={movie.id} className="movie-card">
                            <Link to={`/filme?id=${movie.id}`} className="movie-card-link">
                                <button 
                                    type="button" 
                                    className="movie-options-btn"
                                    onClick={(e) => {
                                        e.preventDefault() // Evita abrir o link ao clicar nos pontos
                                    }}
                                    title="Opções"
                                >
                                    <span></span><span></span><span></span>
                                </button>

                                <img
                                    src={movie.imagem}
                                    alt={`Pôster do filme ${movie.titulo}`}
                                    className="movie-poster"
                                />

                                <div className="movie-info">
                                    <h3 className="movie-title">{movie.titulo}</h3>
                                </div>
                            </Link>
                        </article>
                    ))}
                </div>
            )}
        </section>
    )
}