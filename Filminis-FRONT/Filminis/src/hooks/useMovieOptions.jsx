import { useState } from "react"
import {
    getCategories, getProducers, getDirectors,
    getActors, getCountries, getLanguages,
} from "../service/http"

export default function useMovieOptions() {
    const [options, setOptions] = useState({})

    // Devolve as listas 
    async function loadOptions() {
        if (Object.keys(options).length > 0) return options

        const [categorias, produtoras, diretores, atores, paises, linguagens] =
            await Promise.all(
                [
                    getCategories(), getProducers(), getDirectors(),
                    getActors(), getCountries(), getLanguages(),
                ].map((p) => p.catch(() => []))
            )

        const loaded = { categorias, produtoras, diretores, atores, paises, linguagens }
        setOptions(loaded)
        return loaded
    }

    return { options, loadOptions }
}