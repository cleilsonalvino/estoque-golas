import { useState, useEffect } from "react";

const Quantity = ({ name }) => {
  // Estado para armazenar a nova quantidade (newQuantidade)
  const [newQuantidade, setNewQuantidade] = useState(0); // Inicializa com 0 ou com o valor que preferir

  // Atualiza o localStorage sempre que newQuantidade mudar
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem(name)) || {}; // Puxa o objeto do localStorage

    // Adiciona ou atualiza o campo "newQuantidade" no objeto
    storedData.newQuantidade = newQuantidade;

    // Atualiza o localStorage com a nova propriedade
    localStorage.setItem(name, JSON.stringify(storedData));
  }, [newQuantidade, name]);

  return (
    <fieldset className="quantity">
      <input
        type="number"
        min={1}
        className="custom-number-input"
        placeholder="Nova Quantidade"
        value={newQuantidade}
        onChange={(e) => setNewQuantidade(Number(e.target.value))} // Atualiza apenas o newQuantidade
      />
    </fieldset>
  );
};

export default Quantity;
