import { useState, useEffect } from "react";
import Sendaction from "./Sendaction";
import Quantity from "./Quantity";

const apiUrl = "https://sheetdb.io/api/v1/c3b94fdkjdhv1";

export default function EstoqueSelector() {
  const [itens, setItens] = useState([]);
  const [itemData, setItemData] = useState({});
  const [selectedGolaId, setSelectedGolaId] = useState("");
  const [selectedPunhoId, setSelectedPunhoId] = useState("");
  const [golaInfo, setGolaInfo] = useState({ cor: "", quantidade: "" });
  const [punhoInfo, setPunhoInfo] = useState({ cor: "", quantidade: "" });
    // Criamos estados separados
const [tipoGola, setTipoGola] = useState("");
const [tipoPunho, setTipoPunho] = useState("");

const handleTipoChangeGola = (event) => {
  const tipo = event.target.value;
  setTipoGola(tipo);

  // Recupera o objeto do localStorage
  let gola = JSON.parse(localStorage.getItem('gola')) || {};

  // Adiciona ou atualiza o atributo "tipo"
  gola.TIPO = tipo;

  // Salva o objeto atualizado de volta no localStorage
  localStorage.setItem('gola', JSON.stringify(gola));

  console.log("Tipo atualizado para:", tipo);
};


const handleTipoChangePunho = (event) => {
  const tipo = event.target.value;
  setTipoPunho(tipo);

  // Recupera o objeto do localStorage
  let punho = JSON.parse(localStorage.getItem('punho')) || {};

  // Adiciona ou atualiza o atributo "tipo"
  punho.tipo = tipo;

  // Salva o objeto atualizado de volta no localStorage
  localStorage.setItem('punho', JSON.stringify(punho));

  console.log("Tipo atualizado para Punho:", tipo);
};


  useEffect(() => {
    async function loadSheetDBData() {
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        const dataMap = {};
        data.forEach(item => {
          dataMap[item.ID] = { 
            GOLA: item.GOLA, 
            PUNHO: item.PUNHO, 
            COR: item.COR, 
            QUANTIDADE: Number(item.QUANTIDADE) 
          };
        });

        setItens(data);
        setItemData(dataMap);
      } catch (error) {
        console.error("Erro ao carregar dados do SheetDB:", error);
      }
    }

    loadSheetDBData();
  }, []);

  function updateGola(event) {
    const id = event.target.value;
    setSelectedGolaId(id);
    localStorage.setItem('gola', JSON.stringify({
      ID: id,
      QUANTIDADE: itemData[id]?.QUANTIDADE
    }))
    console.log(id)

    if (id && itemData[id]) {
      setGolaInfo({ cor: itemData[id].COR, quantidade: itemData[id].QUANTIDADE });
    } else {
      setGolaInfo({ cor: "", quantidade: "" });
    }
  }

  function updatePunho(event) {
    const id = event.target.value;
    setSelectedPunhoId(id);

    // Armazena apenas o ID no localStorage
    localStorage.setItem('punho', JSON.stringify({
      ID: id,
      QUANTIDADE: itemData[id]?.QUANTIDADE || 0 // Evita erro caso itemData[id] seja indefinido
    }));

    console.log(id);

    if (id && itemData[id]) {
      setPunhoInfo({ cor: itemData[id].COR, quantidade: itemData[id].QUANTIDADE });
    } else {
      setPunhoInfo({ cor: "", quantidade: "" });
    }
}




  return (
    <div>
      {/* Seleção de Gola */}
      <fieldset className="options-select">
        <div>
          <p>Selecione a Gola:</p>
          <select value={selectedGolaId} onChange={updateGola}>
            <option value="">Escolha uma gola</option>
            {itens
              .filter(item => item.GOLA) // Filtra apenas os que têm GOLA
              .map(item => (
                <option key={item.ID} value={item.ID}>{item.GOLA} - {item.COR}</option>
              ))
            }
          </select>
          <p>Cor: <strong>{golaInfo.cor}</strong></p>
          <p>Quantidade: <strong>{golaInfo.quantidade}</strong></p>
        </div>
        <Quantity name={"gola"}/>
        <Sendaction tipo={tipoGola} onChange={handleTipoChangeGola} name={'gola'}/>
      </fieldset>

      {/* Seleção de Punho */}
      <fieldset className="options-select">
        <div>
          <p>Selecione o Punho:</p>
          <select value={selectedPunhoId} onChange={updatePunho}>
            
            <option value="">Escolha um punho</option>
            {itens
              .filter(item => item.PUNHO) // Filtra apenas os que têm PUNHO
              .map(item => (
                <option key={item.ID} value={item.ID}>{item.PUNHO} - {item.COR}</option>
              ))
            }
          </select>
          <p>Cor: <strong>{punhoInfo.cor}</strong></p>
          <p>Quantidade: <strong>{punhoInfo.quantidade}</strong></p>
        </div>
        <Quantity name={"punho"}/>
        <Sendaction tipo={tipoPunho} onChange={handleTipoChangePunho} name={'punho'}/>
      </fieldset>
    </div>
  );
}
