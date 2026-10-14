import { NavLink, useNavigate, useLocation } from "react-router-dom"
import { isLoggedIn, logout } from "../../service/auth"

import "../css/Sidebar.css"

import logo from "../../assets/images/logo.svg"
import homeImg from "../../assets/images/home.svg"
import logoutImg from "../../assets/images/logout.svg"
import filmesImg from "../../assets/images/filmes.svg"
import loginImg from "../../assets/images/login.svg"

export default function Sidebar() {
    const navigate = useNavigate()
    useLocation() // relê o login a cada navegação

    const logged = isLoggedIn()

    async function handleLogout() {
        await logout()
        navigate("/login", { replace: true })
    }

    const menuItems = [
        { name: "Home", path: "/", icon: homeImg, end: true },
        { name: "Filmes", path: "/filmes", icon: filmesImg },
    ]

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
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.end}
                            className={({ isActive }) =>
                                `nav-item ${isActive ? "active" : ""}`
                            }
                        >
                            <img src={item.icon} alt="" className="icon-img" />
                            <span>{item.name}</span>
                        </NavLink>
                    ))}
                </nav>
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