import './App.css'
import { useState, useEffect } from 'react'
import Dateatual from './components/Dateatual'
import Header from './components/Header'
import Select from './components/Select'
import Atuallyquantity from './components/Atuallyquantity'

function App() {

    // Estruturas iniciais dos objetos
    const estruturaInicialGola = { ID: "", QUANTIDADE: 0, TIPO: "" };
    const estruturaInicialPunho = { ID: "", QUANTIDADE: 0, TIPO: "" };

    // Verifica e cria os objetos no localStorage ao carregar a página
    useEffect(() => {
        if (!localStorage.getItem("gola")) {
            localStorage.setItem("gola", JSON.stringify(estruturaInicialGola));
        }
        if (!localStorage.getItem("punho")) {
            localStorage.setItem("punho", JSON.stringify(estruturaInicialPunho));
        }
    }, []); // Executa apenas uma vez ao iniciar a página

    // Estados para armazenar os dados
    const [dadosGola, setDadosGola] = useState(() => {
        return JSON.parse(localStorage.getItem("gola")) || estruturaInicialGola;
    });

    const [dadosPunho, setDadosPunho] = useState(() => {
        return JSON.parse(localStorage.getItem("punho")) || estruturaInicialPunho;
    });

    // Atualiza o localStorage sempre que os dados mudarem
    useEffect(() => {
        localStorage.setItem("gola", JSON.stringify(dadosGola));
    }, [dadosGola]);

    useEffect(() => {
        localStorage.setItem("punho", JSON.stringify(dadosPunho));
    }, [dadosPunho]);

  return (
    <main>
    <Header/>
    <Dateatual/>
    <Select/>
  <br />
<Atuallyquantity/>
</main>
  )
}

export default App
