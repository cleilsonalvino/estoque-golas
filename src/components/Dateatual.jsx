import React from 'react'

const Dateatual = () => {

        const dataPedidoo = new Date().toLocaleDateString('pt-BR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          });


  return (
    <fieldset>
    <legend>Data: </legend>
    <span style={{ backgroundColor: "white", padding: 5, color: "black" }}>
        {dataPedidoo}
    </span>
  </fieldset>
  )
}

export default Dateatual