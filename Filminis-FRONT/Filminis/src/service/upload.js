const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const PRESET = import.meta.env.VITE_CLOUDINARY_PRESET

// Envia a imagem ao Cloudinary e devolve só a URL
export async function uploadImage(file) {
    if (!CLOUD_NAME || !PRESET) return null

    const body = new FormData()
    body.append("file", file)
    body.append("upload_preset", PRESET)

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body }
    )

    if (!response.ok) throw new Error("Não foi possível enviar o pôster.")

    return (await response.json()).secure_url
}