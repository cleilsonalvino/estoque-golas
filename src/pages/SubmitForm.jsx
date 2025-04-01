import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./css/submit.css";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

// Componente para registrar a entrada/saída de um polo
function SubmitForm() {
  const [codigoPolo, setCodigoPolo] = useState("");
  const [quantidade, setQuantidade] = useState(0);
  const [tipo, setTipo] = useState(""); // "entrada" ou "saida"
  const [golaPunho, setGolaPunho] = useState(""); // "gola" ou "punho"
  const [polos, setPolos] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Estado de carregamento
  const [errorMessage, setErrorMessage] = useState(""); // Para mostrar erros
  const navigate = useNavigate();

  // Carregar os polos disponíveis
  useEffect(() => {
    fetch("https://3.17.153.198:4000/trazer-dados") // Chame sua API para obter os polos
      .then((response) => response.json())
      .then((data) => {
        setPolos(data);
        setIsLoading(false); // Termina o carregamento após dados serem obtidos
      })
      .catch((error) => {
        console.error("Erro ao carregar os polos:", error);
        setErrorMessage("Erro ao carregar os polos. Tente novamente.");
        setIsLoading(false); // Termina o carregamento mesmo em erro
      });
  }, []);

  const poloSelecionado = polos.find((polo) => polo.codigo === codigoPolo);


  // Função para enviar os dados da entrada/saída
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (quantidade <= 0) {
      setErrorMessage("A quantidade deve ser maior que zero.");
      return;
    }

    const dados = {
      codigoPolo,
      quantidade,
      tipo,
      golaPunho,
    };

    try {
      const response = await fetch(
        "https://estoque-golas-server.onrender.com/estoque",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dados),
        }
      );
      const result = await response.json();
      if (result.success) {
        alert("Entrada/saída registrada com sucesso!");
        navigate("/dashboard"); // Ou outra página de sua escolha
      } else {
        setErrorMessage("Erro ao registrar entrada/saída.");
      }
    } catch (error) {
      console.error("Erro ao enviar dados:", error);
      setErrorMessage("Erro ao processar a requisição. Tente novamente.");
    }
  };

  // Exibição do formulário
  return (
    <div className="content">
      <NavBar />
      <div className="estoquePolo">
        <h2>Registrar Entrada/Saída do Polo</h2>

        {/* Exibe a mensagem de erro se existir */}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        {/* Exibe o carregamento enquanto os polos estão sendo buscados */}
        {isLoading ? (
          <p>Carregando polos...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="codigoPolo">Código do Polo:</label>
              <select
                id="codigoPolo"
                value={codigoPolo}
                onChange={(e) => setCodigoPolo(e.target.value)}
                required
              >
                <option value="">Selecione um Polo</option>
                {polos.map((polo) => (
                  <option key={polo.codigo} value={polo.codigo}>
                    {polo.codigo} - {polo.cor}
                  </option>
                ))}
              </select>
              <div>Quantidade Gola: {poloSelecionado ? poloSelecionado.gola.quantidade : "Selecione um polo"}</div>
<div>Quantidade Punho: {poloSelecionado ? poloSelecionado.punho.quantidade : "Selecione um polo"}</div>

            </div>

            <div>
              <label htmlFor="quantidade">Quantidade:</label>
              <input
                type="number"
                id="quantidade"
                value={quantidade}
                onChange={(e) => setQuantidade(Number(e.target.value))}
                min="1"
                required
              />
            </div>

            <div>
              <label htmlFor="tipo">Tipo de Ação:</label>
              <select
                id="tipo"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                required
              >
                <option value="">Selecione Tipo de Ação</option>
                <option value="entrada">Entrada</option>
                <option value="saida">Saída</option>
              </select>
            </div>

            <div>
              <label htmlFor="golaPunho">Selecione o Tipo:</label>
              <select
                id="golaPunho"
                value={golaPunho}
                onChange={(e) => setGolaPunho(e.target.value)}
                required
              >
                <option value="">Selecione Gola ou Punho</option>
                <option value="gola">Gola</option>
                <option value="punho">Punho</option>
              </select>
            </div>

            <button type="submit">Registrar</button>
          </form>
        )}
      </div>
      <Footer/>
    </div>
  );
}

export default SubmitForm;
