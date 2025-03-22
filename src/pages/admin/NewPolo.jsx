import React, { useState } from 'react';
import '../css/newpolo.css'; // Ajustado o caminho do CSS

function NewPolo() {
  const [formData, setFormData] = useState({
    codigo: '',
    cor: '',
    gola: { quantidade: '' },
    punho: { quantidade: '' },
  });
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'golaQuantidade') {
      setFormData({ ...formData, gola: { quantidade: parseInt(value) || '' } });
    } else if (name === 'punhoQuantidade') {
      setFormData({ ...formData, punho: { quantidade: parseInt(value) || '' } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResponse(null);

    try {
      const res = await fetch('http://localhost:3000/polos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Erro na requisição');
      }

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError({ message: err.message });
    }
  };

  return (
    <div className="App">
      <h1>Criar Polo</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Código:</label>
          <input
            type="text"
            name="codigo"
            value={formData.codigo}
            onChange={handleChange}
            required
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
          />
        </div>
        <button type="submit">Criar Polo</button>
      </form>

      {response && (
        <div>
          <h2>{response.message}</h2>
          <pre>{JSON.stringify(response.data, null, 2)}</pre>
        </div>
      )}

      {error && (
        <div style={{ color: 'red' }}>
          <h2>Erro</h2>
          <p>{error.message}</p>
        </div>
      )}
    </div>
  );
}

export default NewPolo;