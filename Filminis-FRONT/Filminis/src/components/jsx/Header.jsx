import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../css/Header.css";
import lupa from "../../assets/images/lupa.svg";
import defaultAvatar from "../../assets/images/defaul-login.jpg";
import { getMe } from "../../service/http";

export default function Header() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const busca = searchParams.get("busca") ?? "";

    const [foto, setFoto] = useState(null);

    useEffect(() => {
        let ativo = true;

        getMe()
            .then((user) => {
                if (ativo) setFoto(user.foto || null);
            })
            .catch(() => {
                // sem login ou erro na API: mantém a imagem padrão
            });

        return () => {
            ativo = false;
        };
    }, []);

    function handleChange(e) {
        const termo = e.target.value;
        navigate(termo ? `/?busca=${encodeURIComponent(termo)}` : "/", {
            replace: true,
        });
    }

    return (
        <header className="topbar">
            <label className="topbar-search">
                <img src={lupa} alt="" width="14" height="14" />
                <input
                    type="text"
                    placeholder="Insira o filme desejado"
                    value={busca}
                    onChange={handleChange}
                />
            </label>

            <div className="topbar-actions">
                <button className="topbar-bell" aria-label="Notificações">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="2"
                         strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                    </svg>
                    <span className="topbar-dot" />
                </button>

                <button
                    type="button"
                    className="topbar-avatar-btn"
                    aria-label="Ver dados do usuário"
                    onClick={() => navigate("/user")}
                >
                    <img
                        className="topbar-avatar"
                        src={foto || defaultAvatar}
                        alt=""
                        onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = defaultAvatar;
                        }}
                    />
                </button>
            </div>
        </header>
    );
}