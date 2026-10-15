//Styles
import "./Login.css"

//Componentes
import RegisterCard from "../../components/jsx/RegisterCard"

//Imagens
import backgroundImg from "../../assets/images/background.svg"

export default function Register() {
    return (
        <section
            className="login-register"
            style={{ backgroundImage: `url(${backgroundImg})` }}
        >
            <RegisterCard/>
        </section>
    )
}