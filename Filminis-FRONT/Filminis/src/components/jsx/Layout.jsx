import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import Header from "./Header"
import Footer from "./Footer"
import "../css/Layout.css"

export default function Layout() {
    return (
        <div className="app-container">
            <Sidebar />
            
            <div className="main-wrapper">
                <Header />
                <main className="content-area">
                    <Outlet />
                </main>
                <Footer />
            </div>
        </div>
    )
}