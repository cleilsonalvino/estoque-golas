import { useState, useEffect } from "react";

const apiUrl = "https://sheetdb.io/api/v1/c3b94fdkjdhv1";

export default function EstoqueSelector() {
  const [itens, setItens] = useState([]);
  const [itemData, setItemData] = useState({});
  const [selectedId, setSelectedId] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [cor, setCor] = useState("");

  useEffect(() => {
    async function loadSheetDBData() {
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        const dataMap = {};
        data.forEach(item => {
          dataMap[item.ID] = { GOLA: item.GOLA, COR: item.COR, QUANTIDADE: Number(item.QUANTIDADE), PUNHO: item.PUNHO };
        });

        setItens(data);
        setItemData(dataMap);
      } catch (error) {
        console.error("Erro ao carregar dados do SheetDB:", error);
      }
    }

    loadSheetDBData();
  }, []);

  function updateQuantity(event) {
    const id = event.target.value;
    setSelectedId(id);

    if (id && itemData[id]) {
      setQuantidade(itemData[id].QUANTIDADE);
      setCor(itemData[id].COR);
    } else {
      setQuantidade("");
      setCor("");
    }
  }

  return (
    <div>
      <p >Selecione a opção correspondente:</p>
      <select id="tecidoSelect" value={selectedId} onChange={updateQuantity}>
        <option value="">Escolha um tecido</option>
        {itens.map(item => (
          <option key={item.ID} value={item.ID}>{item.GOLA}</option>
        ))}
      </select>

      <p>Cor: <strong>{cor}</strong></p>
      <p>Quantidade: <strong>{quantidade}</strong></p>
    </div>
  );
}
