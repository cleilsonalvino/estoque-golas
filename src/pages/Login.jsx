import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/login.css";
import Footer from "../components/Footer";

function Login() {
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false); // Estado para o loader
  const navigate = useNavigate();

  useEffect(() => {
    // Esconder o loader ao carregar a página
    setCarregando(false);
  }, []);

  // Função para enviar os dados de login
  function verificarUsuario(e) {
    e.preventDefault();
    setCarregando(true); // Exibir o loader

    const dados = { nome, senha };

    fetch("https://estoque-golas-server.onrender.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.autenticado) {
          localStorage.setItem("usuario", JSON.stringify(data.usuario));

          if (data.usuario.Eadmin === 1) {
            alert("Login bem-sucedido!");
            navigate("/dashboard");
          } else {
            navigate("/form");
          }
        } else {
          alert(data.mensagem);
        }
      })
      .catch((error) => {
        console.error("Erro:", error);
      })
      .finally(() => {
        setCarregando(false); // Esconder o loader depois da requisição
      });
  }

  return (
    <div className="TelaLogin">
      <h1>Controle de Estoque</h1>
      <p>Golas e Punhos</p>
      <form className="form" onSubmit={verificarUsuario}>
        <span className="input-span">
          <label htmlFor="nome" className="label">
            Nome
          </label>
          <input
            type="text"
            name="nome"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </span>
        <span className="input-span">
          <label htmlFor="senha" className="label">
            Senha
          </label>
          <input
            type="password"
            name="senha"
            id="senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </span>
        <input className="submit" type="submit" value="Entrar" />
        
        {/* Exibir o loader apenas se carregando for true */}
        {carregando && <div className="loader" id="loader"></div>}
      </form>

      <Footer />
    </div>
  );
}

export default Login;
