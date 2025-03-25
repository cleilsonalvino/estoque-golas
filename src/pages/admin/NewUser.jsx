import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function NewUserModal() {
  const [nome, setNome] = useState("");
  const [eAdmin, setEAdmin] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  function adicionarUsuario() {
    const dados = {
      nome: nome,
      eadmin: eAdmin,
    };

    fetch("https://estoque-golas-server.onrender.com/novousuario", {
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
        setNome("");
        setEAdmin(0);
        setErrorMessage("");

        // Fechar modal automaticamente
        const modalElement = document.getElementById("newUserModal");
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        modalInstance.hide();
      })
      .catch((error) => {
        console.error("Erro:", error);
        setErrorMessage("Erro ao adicionar usuário. Tente novamente.");
      });
  }

  return (
    <>
      <button
        type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#newUserModal"
      >
        Criar Novo Usuário
      </button>

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
              {errorMessage && (
                <div className="alert alert-danger">{errorMessage}</div>
              )}
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

                <div className="mb-3 d-flex align-items-center">
                  <p className="form-label">É admin?</p>
                  <div className="form-check d-flex align-items-center">
                    <input
                      type="radio"
                      name="eadmin"
                      id="sim"
                      value={1}
                      checked={eAdmin === 1}
                      onChange={() => setEAdmin(1)}
                      className="m-3"
                    />
                    <label htmlFor="sim" className="form-check-label">
                      Sim
                    </label>
                  </div>
                  <div className="form-check d-flex align-items-center">
                    <input
                      type="radio"
                      name="eadmin"
                      id="nao"
                      value={0}
                      checked={eAdmin === 0}
                      onChange={() => setEAdmin(0)}
                      className="m-3"
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
