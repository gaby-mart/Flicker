import { Link } from "react-router-dom"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination, EffectFade } from "swiper/modules"

import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/effect-fade"
import "../css/Hero.css"

export default function Hero({ movies = [] }) {
    if (movies.length === 0) return null

    return (
        <Swiper
            className="banner"
            modules={[Autoplay, Pagination, EffectFade]}
            effect="fade"
            loop={movies.length > 1}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
        >
            {movies.map((movie) => (
                <SwiperSlide key={movie.id}>
                    <div
                        className="banner-slide"
                        style={{
                            backgroundImage: `url(${movie.banner ?? movie.imagem})`,
                        }}
                    >
                        <div className="banner-info">
                            <h1 className="banner-title">{movie.titulo}</h1>

                            {(movie.sinopse || movie.descricao) && (
                                <p className="banner-text">
                                    {movie.sinopse || movie.descricao}
                                </p>
                            )}

                            <Link to={`/filme?id=${movie.id}`} className="banner-btn">
                                Saiba mais
                            </Link>
                        </div>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    )
}