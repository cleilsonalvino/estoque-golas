import { configDotenv } from "dotenv";

const Atuallyquantity = () => {

  async function updateQuantityInSheetDB() {

    const dadosGola = JSON.parse(localStorage.getItem('gola')) || null;
    const dadosPunho = JSON.parse(localStorage.getItem('punho')) || null;
    
    const apiUrl = "https://sheetdb.io/api/v1/c3b94fdkjdhv1";
    
    async function atualizarEstoque() {
      try {
        // Atualiza a quantidade da Gola
        if (dadosGola && dadosGola.ID) {
            let newQuantityGola = dadosGola.QUANTIDADE; // Inicia com a quantidade original
    
            if (dadosGola.TIPO === "entrada") {
                newQuantityGola += dadosGola.newQuantidade; // Se for entrada, soma a nova quantidade
            } else if (dadosGola.TIPO === "saída") {
                newQuantityGola -= dadosGola.newQuantidade; // Se for saída, subtrai a nova quantidade
            }
    
            // Atualiza o estoque da gola
            await fetch(`${apiUrl}/ID/${dadosGola.ID}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ QUANTIDADE: newQuantityGola })
            });
    
            console.log("Quantidade da gola atualizada!");
        }
    
        // Atualiza a quantidade do Punho
        if (dadosPunho && dadosPunho.ID) {
            let newQuantityPunho = dadosPunho.QUANTIDADE; // Inicia com a quantidade original
    
            if (dadosPunho.TIPO === "entrada") {
                newQuantityPunho += dadosPunho.newQuantidade; // Se for entrada, soma a nova quantidade
            } else if (dadosPunho.TIPO === "saída") {
                newQuantityPunho -= dadosPunho.newQuantidade; // Se for saída, subtrai a nova quantidade
            }
    
            // Atualiza o estoque do punho
            await fetch(`${apiUrl}/ID/${dadosPunho.ID}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ QUANTIDADE: newQuantityPunho })
            });
    
            console.log("Quantidade do punho atualizada!");
        }
    
        // Alerta de sucesso e verificação do estoque
        alert("Estoque atualizado com sucesso!");
        verificarEstoque(); // Chama a função para verificar o estoque após a atualização
    } catch (error) {
        console.error("Erro ao atualizar a quantidade no SheetDB:", error);
    }
    
    }
    
    // Chamar a função para atualizar o estoque
    atualizarEstoque();
    
  }

  return (
    <button onClick={updateQuantityInSheetDB}>Atualizar Quantidade</button>
  )
}

export default Atuallyquantity