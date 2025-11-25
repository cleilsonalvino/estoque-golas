import React, { useState } from "react";


function NewPoloModal({refreshDados}) {
  const [formData, setFormData] = useState({
    codigo: "",
    cor: "",
    gola: { quantidade: "" },
    punho: { quantidade: "" },
  });
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "golaQuantidade") {
      setFormData({ ...formData, gola: { quantidade: parseInt(value) || "" } });
    } else if (name === "punhoQuantidade") {
      setFormData({ ...formData, punho: { quantidade: parseInt(value) || "" } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResponse(null);

    try {
      const res = await fetch("https://api-drf-golas.cleilsonalvino.com.br/polos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Erro na requisição");
      }

      const data = await res.json();
      setResponse(data);
      refreshDados()
    } catch (err) {
      setError({ message: err.message });
    }
  };

  return (
    <>
      {/* Botão para abrir o modal */}
      <button
        type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#newPoloModal"
      >
        Criar Nova Polo
      </button>

      {/* Modal */}
      <div
        className="modal fade"
        id="newPoloModal"
        tabIndex="-1"
        aria-labelledby="newPoloModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="newPoloModalLabel">
                Criar Polo
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="newpolo">
                <form onSubmit={handleSubmit}>
                  <div>
                    <label>Código:</label>
                    <input
                      type="text"
                      name="codigo"
                      value={formData.codigo}
                      onChange={handleChange}
                      required
                      className="form-control" // Estilo Bootstrap
                    />
                  </div>
                  <div>
                    <label>Cor:</label>
                    <input
                      type="text"
                      name="cor"
                      value={formData.cor}
                      onChange={handleChange}
                      required
                      className="form-control" // Estilo Bootstrap
                    />
                  </div>
                  <div>
                    <label>Quantidade de Gola:</label>
                    <input
                      type="number"
                      name="golaQuantidade"
                      value={formData.gola.quantidade}
                      onChange={handleChange}
                      min="0"
                      required
                      className="form-control" // Estilo Bootstrap
                    />
                  </div>
                  <div>
                    <label>Quantidade de Punho:</label>
                    <input
                      type="number"
                      name="punhoQuantidade"
                      value={formData.punho.quantidade}
                      onChange={handleChange}
                      min="0"
                      required
                      className="form-control" // Estilo Bootstrap
                    />
                  </div>
                  <button type="submit" className="btn btn-primary mt-3">
                    Criar Polo
                  </button>
                </form>

                {response && (
                  <div className="mt-3">
                    <h2>{response.message}</h2>
                    <pre>{JSON.stringify(response.data, null, 2)}</pre>
                  </div>
                )}

                {error && (
                  <div className="mt-3 text-danger">
                    <h2>Erro</h2>
                    <p>{error.message}</p>
                  </div>
                )}
              </div>
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

export default NewPoloModal;