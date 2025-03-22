import React, { useEffect, useState } from "react";
import NewPolo from "./NewPolo";
import NewUser from "./NewUser";
import NavBar from "../../components/NavBar";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import SearchDados from "./SearchDados";

function Dash() {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editPolo, setEditPolo] = useState(null);

  const fetchDados = async () => {
    try {
      const response = await fetch("http://localhost:3000/trazer-dados");
      if (!response.ok) throw new Error("Erro ao buscar os dados");
      const data = await response.json();
      setDados(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDados();
  }, []);

  const handleUpdatePolo = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/atualizar-polo/${editPolo.codigo}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cor: editPolo.cor,
          gola: { quantidade: editPolo.gola.quantidade },
          punho: { quantidade: editPolo.punho.quantidade },
        }),
      });
      if (!response.ok) throw new Error("Erro ao atualizar o polo");
      await response.json();
      fetchDados(); // Recarrega os dados
      setEditPolo(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "golaQuantidade") {
      setEditPolo({ ...editPolo, gola: { quantidade: Number(value) } });
    } else if (name === "punhoQuantidade") {
      setEditPolo({ ...editPolo, punho: { quantidade: Number(value) } });
    } else {
      setEditPolo({ ...editPolo, [name]: value });
    }
  };

  return (
    <div className="contentDash">
      <NavBar />
      <main>
        {/* Passa fetchDados como prop para NewPolo */}
        <div className="acoesDash">
          <NewPolo refreshDados={fetchDados} />
          <NewUser />
          <SearchDados />
        </div>
        <div className="container mt-5">
          <h2>Lista de Polos</h2>
          {loading ? (
            <div>Carregando...</div>
          ) : error ? (
            <div className="text-danger">Erro: {error}</div>
          ) : (
            <table className="table table-striped table-bordered">
              <thead className="thead-dark">
                <tr>
                  <th scope="col">Código</th>
                  <th scope="col">Cor</th>
                  <th scope="col">Gola</th>
                  <th scope="col">Punho</th>
                  <th scope="col">Ações</th>
                </tr>
              </thead>
              <tbody>
                {dados.map((item) => (
                  <tr key={item.codigo}>
                    <td>{item.codigo}</td>
                    <td>{item.cor}</td>
                    <td>{item.gola?.quantidade || "N/A"}</td>
                    <td>{item.punho?.quantidade || "N/A"}</td>
                    <td>
                      <button className="btn btn-warning btn-sm" onClick={() => setEditPolo(item)}>
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {editPolo && (
          <div className="modal fade show" style={{ display: "block" }} tabIndex="-1" aria-labelledby="editPoloModalLabel">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="editPoloModalLabel">Editar Polo</h5>
                  <button type="button" className="btn-close" onClick={() => setEditPolo(null)}></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleUpdatePolo}>
                    <div className="mb-3">
                      <label className="form-label">Código</label>
                      <input type="text" className="form-control" name="codigo" value={editPolo.codigo} disabled />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Cor</label>
                      <input type="text" className="form-control" name="cor" value={editPolo.cor} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Quantidade de Gola</label>
                      <input type="number" className="form-control" name="golaQuantidade" value={editPolo.gola.quantidade} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Quantidade de Punho</label>
                      <input type="number" className="form-control" name="punhoQuantidade" value={editPolo.punho.quantidade} onChange={handleChange} />
                    </div>
                    <button type="submit" className="btn btn-primary">Salvar</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
        {editPolo && <div className="modal-backdrop fade show" onClick={() => setEditPolo(null)}></div>}
      </main>
    </div>
  );
}

export default Dash;