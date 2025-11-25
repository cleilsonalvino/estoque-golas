import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function UserListModal() {
  const [usuarios, setUsuarios] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); // Adicionado para feedback

  // Função para buscar a lista de usuários
  const fetchUsuarios = () => {
    setLoading(true);
    fetch("https://api-drf-golas.cleilsonalvino.com.br/usuarios", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao carregar a lista de usuários");
        }
        return response.json();
      })
      .then((data) => {
        setUsuarios(data);
        setErrorMessage("");
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro:", error);
        setErrorMessage("Erro ao carregar a lista de usuários. Tente novamente.");
        setLoading(false);
      });
  };

  // Função para excluir um usuário
  const deletarUsuario = (id) => {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) return;

    fetch(`https://api-drf-golas.cleilsonalvino.com.br/login/usuarios/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao excluir o usuário");
        }
        return response.json();
      })
      .then((data) => {
        setSuccessMessage(data.message); // Exibe mensagem de sucesso
        setErrorMessage("");
        fetchUsuarios(); // Atualiza a lista após exclusão
      })
      .catch((error) => {
        console.error("Erro:", error);
        setErrorMessage("Erro ao excluir usuário. Tente novamente.");
      });
  };

  // Carregar usuários quando o modal for aberto
  useEffect(() => {
    const modalElement = document.getElementById("userListModal");
    if (modalElement) {
      modalElement.addEventListener("shown.bs.modal", fetchUsuarios);
      return () => {
        modalElement.removeEventListener("shown.bs.modal", fetchUsuarios);
      };
    }
  }, []);

  return (
    <>
      <button
        type="button"
        className="btn btn-info"
        data-bs-toggle="modal"
        data-bs-target="#userListModal"
      >
        Lista de Usuários
      </button>

      <div
        className="modal fade"
        id="userListModal"
        tabIndex="-1"
        aria-labelledby="userListModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="userListModalLabel">
                Lista de Usuários
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {/* Mensagem de sucesso */}
              {successMessage && (
                <div className="alert alert-success">{successMessage}</div>
              )}
              {/* Mensagem de erro */}
              {errorMessage && (
                <div className="alert alert-danger">{errorMessage}</div>
              )}
              {loading ? (
                <div className="text-center">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Carregando...</span>
                  </div>
                </div>
              ) : usuarios.length === 0 ? (
                <p>Nenhum usuário encontrado.</p>
              ) : (
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nome</th>
                      <th>Senha</th>
                      <th>É Admin?</th>
                      <th>Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((usuario) => (
                      <tr key={usuario.id}>
                        <td>{usuario.id}</td>
                        <td>{usuario.nome}</td>
                        <td>{usuario.senha}</td>
                        <td>{usuario.Eadmin === 1 ? "Sim" : "Não"}</td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => deletarUsuario(usuario.id)}
                          >
                            Excluir
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserListModal;