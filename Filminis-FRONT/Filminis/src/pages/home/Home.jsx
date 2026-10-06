import "./home.css";
import "../../styles/global.css";

// 1. Adicione esta linha de importação no topo:
import Header from "../../components/jsx/Header.jsx";

export default function Home(){
    return(
        <>
          <h1>Página Home carregou!</h1>
          <Header />
        </>
    );
}