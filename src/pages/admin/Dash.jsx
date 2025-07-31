import React, { useEffect, useState } from "react";
import NewPolo from "./NewPolo";
import NewUser from "./NewUser";
import NavBar from "../../components/NavBar";
import ListUsers from "./ListUsers";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css"; // Importe o seu novo CSS
import Footer from "../../components/Footer";

// Importando os ícones
import { FaSearch, FaEdit } from "react-icons/fa";

function Dash() {
  const [dados, setDados] = useState([]);
  const [filteredDados, setFilteredDados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editPolo, setEditPolo] = useState(null);

  // Estado para armazenar o arquivo da foto selecionada no modal
  const [fotoFile, setFotoFile] = useState(null);

  const API_URL = "http://168.231.95.166:4000";

  // Função para buscar todos os dados dos polos
  const fetchDados = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/trazer-dados`);
      if (!response.ok) throw new Error(`Erro ao buscar os dados: ${response.status}`);
      const data = await response.json();
      setDados(data);
      setFilteredDados(data);
    } catch (err) {
      console.error("Erro ao buscar os dados:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDados();
  }, []);

  // --- FUNÇÃO CORRIGIDA: Apenas uma versão, usando FormData

const handleUpdatePolo = async (e) => {
  e.preventDefault();
  if (!editPolo) return;

  const formData = new FormData();
  
  // Envie os campos de texto simples
  formData.append('cor', editPolo.cor);
  
  // --- MUDANÇA PRINCIPAL AQUI ---
  // Envie as quantidades como campos separados, não como um objeto JSON.
  // Isso é mais compatível com o `FormData`.
  formData.append('golaQuantidade', editPolo.gola?.quantidade ?? 0);
  formData.append('punhoQuantidade', editPolo.punho?.quantidade ?? 0);

  // Adiciona o arquivo de foto, se houver um novo
  if (fotoFile) {
      formData.append('foto', fotoFile);
  }

  try {
      const response = await fetch(`${API_URL}/atualizar-polo/${editPolo.codigo}`, {
          method: "POST",
          body: formData, 
      });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.mensagem || "Erro ao atualizar o polo");
      }
      
      await response.json();
      fetchDados();
      setEditPolo(null);
      setFotoFile(null);
  } catch (err) {
      setError(err.message);
  }
};
  // Função para lidar com a mudança nos inputs do formulário de edição
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "golaQuantidade") {
      setEditPolo(prev => ({ ...prev, gola: { ...prev.gola, quantidade: Number(value) } }));
    } else if (name === "punhoQuantidade") {
      setEditPolo(prev => ({ ...prev, punho: { ...prev.punho, quantidade: Number(value) } }));
    } else {
      setEditPolo(prev => ({ ...prev, [name]: value }));
    }
  };

  // Funções para a barra de pesquisa
  const handleSearch = (term) => {
    if (term === "") {
      setFilteredDados(dados);
    } else {
      const results = dados.filter((item) =>
        item.cor.toLowerCase().includes(term.toLowerCase()) ||
        String(item.codigo).includes(term)
      );
      setFilteredDados(results);
    }
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    handleSearch(term);
  };

  const handleOpenEditModal = (polo) => {
    setEditPolo(polo);
    setFotoFile(null); // Limpa qualquer arquivo antigo ao abrir o modal
  };

  return (
    <div className="contentDash">
      <NavBar />
      <Footer />
      <main>
        <div className="acoes-card">
          <NewPolo refreshDados={fetchDados} />
          <NewUser />
          <ListUsers />
        </div>
        <p>Sistema expira em:  2027-03-28</p>

        <div className="table-container">
          <h2 className="page-title">Estoque de Polos</h2>
          
          <div className="search-container">
            <div className="input-group search-input-group">
              <input
                id="searchInput"
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Pesquisar por cor ou código..."
                className="form-control"
              />
              <span className="input-group-text">
                <FaSearch color="#6c757d" />
              </span>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">Carregando...</div>
          ) : error ? (
            <div className="alert alert-danger">Erro: {error}</div>
          ) : (
            <table className="table table-hover">
              <thead>
                <tr>
                  <th scope="col" style={{ width: '100px' }}>Foto</th> 
                  <th scope="col">Código</th>
                  <th scope="col">Cor</th>
                  <th scope="col">Gola</th>
                  <th scope="col">Punho</th>
                  <th scope="col" className="text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredDados.map((item) => (
                  <tr key={item.codigo}>
                    <td>
                      {item.foto ? (
                        <img 
                          src={`${API_URL}${item.foto}`} 
                          alt={`Polo cor ${item.cor}`} 
                          style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} 
                        />
                      ) : (
                        <div style={{ width: '60px', height: '60px', backgroundColor: '#e9ecef', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6c757d', fontSize: '12px', textAlign: 'center' }}>
                          Sem Foto
                        </div>
                      )}
                    </td>
                    <td>{item.codigo}</td>
                    <td>{item.cor}</td>
                    {/* --- CÉLULAS DA TABELA CORRIGIDAS --- */}
                    <td>{item.gola?.quantidade ?? 'N/A'}</td>
                    <td>{item.punho?.quantidade ?? 'N/A'}</td>
                    <td className="text-center">
                      <button className="btn btn-outline-primary btn-sm btn-edit-icon" onClick={() => handleOpenEditModal(item)}>
                        <FaEdit /> Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {editPolo && (
          <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Editar Polo</h5>
                  <button type="button" className="btn-close" onClick={() => setEditPolo(null)}></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleUpdatePolo}>
                    <div className="mb-3">
                      <label className="form-label">Código</label>
                      <input type="text" className="form-control" value={editPolo.codigo} disabled />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Cor</label>
                      <input type="text" className="form-control" name="cor" value={editPolo.cor} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Quantidade de Gola</label>
                      <input type="number" className="form-control" name="golaQuantidade" value={editPolo.gola?.quantidade || ''} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Quantidade de Punho</label>
                      <input type="number" className="form-control" name="punhoQuantidade" value={editPolo.punho?.quantidade || ''} onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="fotoInput" className="form-label">Alterar Foto</label>
                      <input 
                        type="file" 
                        className="form-control" 
                        id="fotoInput" 
                        name="foto"
                        onChange={(e) => setFotoFile(e.target.files[0])}
                      />
                      {fotoFile && <p className="mt-2 text-muted small">Novo arquivo: {fotoFile.name}</p>}
                    </div>
                    <div className="d-grid">
                      <button type="submit" className="btn btn-primary">Salvar Alterações</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
        {editPolo && <div className="modal-backdrop fade show"></div>}
      </main>

    </div>
  );
}

export default Dash;