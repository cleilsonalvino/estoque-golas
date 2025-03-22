import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Necessário para os estilos do Bootstrap
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Necessário para o modal funcionar

function NewUserModal() {
  const [nome, setNome] = useState("");
  const [eAdmin, setEAdmin] = useState(0); // Inicia com 0

  function adicionarUsuario() {
    const dados = {
      nome: nome,
      eadmin: eAdmin, // Enviando 0 ou 1
    };

    fetch("http://localhost:3000/novousuario", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao salvar os dados");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Dados salvos!", data);
        setNome(""); // Limpa o nome
        setEAdmin(0); // Reseta a opção de admin para 0
      })
      .catch((error) => console.error("Erro:", error));
  }

  return (
    <>
      {/* Botão para abrir o modal */}
      <button
        type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#newUserModal"
      >
        Criar Novo Usuário
      </button>

      {/* Modal */}
      <div
        className="modal fade"
        id="newUserModal"
        tabIndex="-1"
        aria-labelledby="newUserModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="newUserModalLabel">
                Criar Novo Usuário
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="nome" className="form-label">
                    Nome
                  </label>
                  <input
                    type="text"
                    id="nome"
                    className="form-control"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <p className="form-label">É admin?</p>
                  <div className="form-check">
                    <input
                      type="radio"
                      name="eadmin"
                      id="sim"
                      value={1}
                      checked={eAdmin === 1}
                      onChange={() => setEAdmin(1)}
                      className="form-check-input"
                    />
                    <label htmlFor="sim" className="form-check-label">
                      Sim
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      name="eadmin"
                      id="nao"
                      value={0}
                      checked={eAdmin === 0}
                      onChange={() => setEAdmin(0)}
                      className="form-check-input"
                    />
                    <label htmlFor="nao" className="form-check-label">
                      Não
                    </label>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Fechar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={adicionarUsuario}
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default NewUserModal;