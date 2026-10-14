//Styles
import "../css/Footer.css"

//Imagens
import logo from "../../assets/images/logo.svg"

export default function Footer(){
    return(
        <footer className= "footer">
            <div className="footer-top">
                <img src={logo} alt="Logo Flicker" className="footer-logo"/>
            </div>

            <div className="footer-bottom">
                <p>© 2026 Flicker. Todos os direitos reservados. Desenvolvido como projeto acadêmico para o curso de Desenvolvimento de Sistemas no SENAI "Roberto Mange".</p>
            </div>
        </footer>
    )
}