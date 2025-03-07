if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
      navigator.serviceWorker.register('service-worker.js')
          .then(registration => {
              console.log('Service Worker registrado com sucesso:', registration);
          })
          .catch(error => {
              console.log('Falha ao registrar o Service Worker:', error);
          });
  });
}
const dataPedidoo = new Date().toLocaleDateString('pt-BR', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
});
const data = document.getElementById('data');
data.innerHTML = dataPedidoo


const apiUrl = "https://sheetdb.io/api/v1/c3b94fdkjdhv1"; // Substitua SEU_API_ID pelo ID da API do SheetDB
        const itemData = {}; // Objeto para armazenar os dados de cada item
      
        // Função para carregar os dados do SheetDB e preencher o select
        async function loadSheetDBData() {
          try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            
            const select = document.getElementById("tecidoSelect");
            
            data.forEach(item => {
              // Cria a opção para o select
              const option = document.createElement("option");
              option.value = item.ID; // Usa o ID como valor da opção
              option.textContent = item.GOLA;
              select.appendChild(option);
              
              // Armazena a quantidade inicial no objeto itemData
              itemData[item.ID] = { GOLA: item.GOLA, COR: item.COR, QUANTIDADE: Number(item.QUANTIDADE) };
            });
          } catch (error) {
            console.error("Erro ao carregar dados do SheetDB:", error);
          }
        }
      
        // Função para atualizar a quantidade ao selecionar uma opção
function updateQuantity() {
  const select = document.getElementById("tecidoSelect");
  const selectedId = select.value;
  const quantityInput = document.getElementById("quantityInput");
  const cor = document.getElementById("cor");
  cor.innerHTML = itemData[selectedId].COR;

  if (selectedId && itemData[selectedId]) {
    quantityInput.value = itemData[selectedId].QUANTIDADE;
  } else {
    quantityInput.value = "";
  }
}

const loader = document.getElementById('loader')
const result = document.getElementById('result')
// Função para ajustar a quantidade com base na entrada ou saída
function adjustQuantity() {
  const selectedId = document.getElementById("tecidoSelect").value;
  const adjustmentInput = document.getElementById("adjustmentInput").value;
  const quantityInput = document.getElementById("quantityInput");
  const isEntrada = document.getElementById("entrada").checked;
  const isSaida = document.getElementById("saida").checked;
  

  if (!selectedId || !adjustmentInput || (!isEntrada && !isSaida)) {
      alert("Por favor, selecione o tecido, a quantidade e o tipo de ajuste.");
      return;
  }

  loader.style.display = 'block'

  // Calcula nova quantidade
  let newQuantity = itemData[selectedId].QUANTIDADE;
  if (isEntrada) {
      newQuantity += Number(adjustmentInput);
  } else if (isSaida) {
      newQuantity -= Number(adjustmentInput);
      if (newQuantity < 0) {
          alert("A quantidade não pode ser negativa.");
          return;
      }
  }

  // Atualiza no itemData e na interface
  itemData[selectedId].QUANTIDADE = newQuantity;
  quantityInput.value = newQuantity;

  // Atualiza a quantidade no SheetDB e em seguida envia os dados
  updateQuantityInSheetDB(selectedId, newQuantity)
      .then(() => submitData()); // Chama submitData após a atualização
}

// Função para enviar a nova quantidade ao SheetDB
async function updateQuantityInSheetDB(id, newQuantity) {
  try {
      await fetch(`${apiUrl}/ID/${id}`, { // Inclui o ID na URL para especificar a linha
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ QUANTIDADE: newQuantity }) // Garante que a coluna esteja correta
      });
      alert("Quantidade atualizada com sucesso!");
      verificarEstoque();
  } catch (error) {
      console.error("Erro ao atualizar a quantidade no SheetDB:", error);
  }
}

        
const sheetDBUrl = 'https://sheetdb.io/api/v1/c3b94fdkjdhv1?sheet=Dados'; 

function submitData() {

  const tecido = document.getElementById('tecidoSelect').selectedOptions[0].text; // Obtenha o nome do tecido
  let quantidade = parseInt(document.getElementById('adjustmentInput').value);
  const dataPedido = new Date().toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  

  // Verifica se a saída foi selecionada
  const isSaida = document.getElementById("saida").checked;
  

  if (isSaida) {
      quantidade = -Math.abs(quantidade); // Torna a quantidade negativa
  }

  if ( !tecido || isNaN(quantidade)) {
      alert('Por favor, preencha todos os campos.');
      return;
  }

  // Criar o objeto com os dados a serem enviados
  const entry = {
      DATA: dataPedido,
      TIPO: tecido,
      QUANTIDADE: quantidade
  };

  // Enviar os dados para o SheetDB
  fetch(sheetDBUrl, {
      method: 'POST', // Usar POST para enviar dados
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(entry) // Enviar como um objeto JSON
  })
  .then(response => {
      if (response.ok) {
          
        loader.style.display = 'none'
        result.style.display = 'block'

        setInterval(()=>{
          result.style.display = 'none'
        }, 2000)

          
          // Limpar os campos
          document.getElementById('data').value = '';
          document.getElementById('tecidoSelect').value = '';
          document.getElementById('adjustmentInput').value = '';
      } else {
          alert('Erro ao enviar os dados. Código de status: ' + response.status);
      }
  })
  .catch(error => {
      console.error('Erro:', error);
      alert('Erro ao enviar os dados.');
  });
}

// // Lista de tecidos que precisam ter no mínimo 10 unidades
// const tecidosComMinimo10 = ["1", "11", "14", "16"];

// // Função para verificar tecidos com mínimo de 10 unidades
// function verificarMinimo10(quantidade, tecido) {
//   if (quantidade < 10) {
//     return `<li style="background-color: #fff; margin: 10px 0; padding: 10px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">⚠️ <strong>Tecido "${tecido}"</strong>: ${quantidade} unidades (mínimo: 10)</li>`;
//   }
//   return '';
// }

// Função para verificar tecidos com mínimo de 3 unidades
// function verificarMinimo3(quantidade, tecido) {
//   if (quantidade === 0) {
//     return `<li style="background-color: #fff; margin: 10px 0; padding: 10px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">⚠️ <strong>Tecido "${tecido}"</strong>: acabou (${quantidade} unidades)</li>`;
//   } else if (quantidade < 3) {
//     return `<li style="background-color: #fff; margin: 10px 0; padding: 10px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">⚠️ <strong>Tecido "${tecido}"</strong>: quase acabando (${quantidade} unidades)</li>`;
//   }
//   return '';
// }

// async function verificarEstoque() {
//   try {
//     const response = await fetch(apiUrl, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     });

//     if (!response.ok) {
//       throw new Error(`Erro ao buscar dados: ${response.status} - ${response.statusText}`);
//     }

//     const dados = await response.json();

//     let emailBody = `
//       <html>
//         <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333;">
//           <h1 style="color: #007BFF;">Relatório de Estoque - Itens com Quantidade Baixa</h1>
//           <p>Prezado(a),</p>
//           <p>Segue abaixo o relatório de tecidos com estoque baixo:</p>
//           <ul style="list-style-type: none; padding: 0;">`;

//     // Percorrer cada item e verificar a quantidade
//     dados.forEach(item => {
//       const quantidade = parseInt(item.QUANTIDADE, 10); // Converter para número
//       const tecido = item.TECIDO.trim(); // Remover espaços extras do nome do tecido

//       // Verificar se a conversão deu certo
//       if (isNaN(quantidade)) {
//         console.error(`Quantidade inválida para o tecido "${tecido}"`);
//         return; // Ignorar este item se a quantidade não for válida
//       }

//       // Adicionar informações personalizadas no corpo do e-mail
//       if (tecidosComMinimo10.includes(item.ID)) {
//         emailBody += verificarMinimo10(quantidade, tecido);
//       } else {
//         emailBody += verificarMinimo3(quantidade, tecido);
//       }
//     });

//     emailBody += `
//           </ul>
//           <div style="margin-top: 20px; font-size: 0.9em; color: #777;">
//             <p>Atenciosamente,<br />Cleilson, Controle de Estoque</p>
//             <p><small>Este é um e-mail automático. Por favor, não responda.</small></p>
//           </div>
//         </body>
//       </html>`;

//     // Enviar o e-mail com os dados gerados
//     const emailResponse = await fetch('https://sendemails-lqua.onrender.com/send-email', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         to: 'fardamentosdr@gmail.com',
//         subject: 'Relatório de Estoque - Itens com Baixa Quantidade',
//         html: emailBody,  // Usar HTML para o corpo do e-mail
//       })
//     });

//     // Verificar se a resposta é válida e pode ser convertida para JSON
//     if (!emailResponse.ok) {
//       throw new Error(`Erro ao enviar o e-mail: ${emailResponse.status} - ${emailResponse.statusText}`);
//     }

//     const emailData = await emailResponse.json();
//     console.log("E-mail enviado com sucesso:", emailData);

//   } catch (error) {
//     console.error("Erro:", error);
//   }
// }



    

    // Carrega os dados ao carregar a página
    document.addEventListener("DOMContentLoaded", loadSheetDBData);
