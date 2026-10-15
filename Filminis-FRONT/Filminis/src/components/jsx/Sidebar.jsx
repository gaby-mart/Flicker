import { NavLink, useNavigate, useLocation } from "react-router-dom"
import { isLoggedIn, isAdmin, logout } from "../../service/auth"

import "../css/Sidebar.css"

import logo from "../../assets/images/logo.svg"
import homeImg from "../../assets/images/home.svg"
import logoutImg from "../../assets/images/logout.svg"
import filmesImg from "../../assets/images/filmes.svg"
import loginImg from "../../assets/images/login.svg"
import solicitacaoImg from "../../assets/images/solicitacao.svg"
import gerenciamentoImg from "../../assets/images/gerenciamento.svg"

function NavItem({ path, name, icon, end }) {
    return (
        <NavLink
            to={path}
            end={end}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
        >
            <img src={icon} alt="" className="icon-img" />
            <span>{name}</span>
        </NavLink>
    )
}

export default function Sidebar() {
    const navigate = useNavigate()
    useLocation() // relê o login e o papel a cada navegação

    const logged = isLoggedIn()
    const admin = logged && isAdmin()

    async function handleLogout() {
        await logout()
        navigate("/login", { replace: true })
    }

    return (
        <aside className="sidebar">
            <div className="sidebar-top">
                <NavLink to="/" className="sidebar-brand">
                    <img src={logo} alt="Flicker" />
                </NavLink>

                <div className="section">
                    <span className="section-title">Geral</span>
                    <hr className="sidebar-divider" />
                </div>

                <nav className="sidebar-nav">
                    <NavItem path="/" name="Home" icon={homeImg} end />
                    <NavItem path="/filmes" name="Filmes" icon={filmesImg} />
                </nav>

                {/* Somente para administradores */}
                {admin && (
                    <>
                        <div className="section section-admin">
                            <span className="section-title">Administração</span>
                            <hr className="sidebar-divider" />
                        </div>

                        <nav className="sidebar-nav">
                            <NavItem
                                path="/solicitacoes"
                                name="Solicitações"
                                icon={solicitacaoImg}
                            />
                            <NavItem
                                path="/management"
                                name="Gerenciamento"
                                icon={gerenciamentoImg}
                            />
                        </nav>
                    </>
                )}
            </div>

            {logged ? (
                <button className="nav-item sidebar-logout" onClick={handleLogout}>
                    <img src={logoutImg} alt="" className="icon-img" />
                    <span>Logout</span>
                </button>
            ) : (
                <NavLink to="/login" className="nav-item sidebar-logout">
                    <img src={loginImg} alt="" className="icon-img" />
                    <span>Login</span>
                </NavLink>
            )}
        </aside>
    )
}