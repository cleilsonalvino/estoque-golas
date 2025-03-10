//import { useState } from 'react'

const Atuallyquantity = () => {

  async function updateQuantityInSheetDB() {

    const dadosGola = JSON.parse(localStorage.getItem('gola')) || {};
    const dadosPunho = JSON.parse(localStorage.getItem('gola')) || {};

    console.log(dadosGola, dadosPunho)

    // try {
    //     await fetch(`${apiUrl}/ID/${id}`, { // Inclui o ID na URL para especificar a linha
    //         method: "PATCH",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify({ QUANTIDADE: newQuantity }) // Garante que a coluna esteja correta
    //     });
    //     alert("Quantidade atualizada com sucesso!");
    //     verificarEstoque();
    // } catch (error) {
    //     console.error("Erro ao atualizar a quantidade no SheetDB:", error);
    // }
  }

  return (
    <button onClick={updateQuantityInSheetDB}>Atualizar Quantidade</button>
  )
}

export default Atuallyquantity