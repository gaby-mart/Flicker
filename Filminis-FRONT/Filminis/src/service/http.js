const DATA_URL = import.meta.env.VITE_DATA_URL

export async function getMovies() {
    
    const response = await fetch(`${DATA_URL}/listagem`)
    
    if (!response.ok) throw new Error("Error on fetching movies data")
    console.log(response)
    return response.json()
}

export async function getIdMovie(id) {
    try{
        const response = await fetch(`http://localhost:8000/filme?id=${id}`)
        if(!response.ok){
            throw new Error("Erro on fetching movies data")
        }
        const dados = await response.json()
        return dados
    }catch(erro){
        console.error("Erro na API")
        return[];
    }
}