import React, { useState } from "react";

function NewUser() {
  const [nome, setNome] = useState("");
  const [eAdmin, setEAdmin] = useState(0); // Agora inicia com 0

  function adicionarUsuario() {
    const dados = {
      nome: nome,
      eadmin: eAdmin // Enviando 0 ou 1 em vez de true/false
    };

    fetch("http://localhost:3000/novousuario", { // Alterar URL se necessário
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(dados)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error("Erro ao salvar os dados");
      }
      return response.json();
    })
    .then(data => {
      console.log("Dados salvos!", data);
      setNome(""); // Limpa o nome
      setEAdmin(0); // Reseta a opção de admin para 0
    })
    .catch(error => console.error("Erro:", error));
  }

  return (
    <div>
      <h1>Criar novo usuário</h1>

      <p>Nome</p>
      <input
        type="text"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />

      <p>É admin?</p>
      <label htmlFor="sim">Sim</label>
      <input
        type="radio"
        name="eadmin"
        id="sim"
        value={1} // Agora envia 1
        checked={eAdmin === 1}
        onChange={() => setEAdmin(1)}
      />
      <br />
      <label htmlFor="nao">Não</label>
      <input
        type="radio"
        name="eadmin"
        id="nao"
        value={0} // Agora envia 0
        checked={eAdmin === 0}
        onChange={() => setEAdmin(0)}
      />

      <button onClick={adicionarUsuario}>Adicionar</button>
    </div>
  );
}

export default NewUser;
