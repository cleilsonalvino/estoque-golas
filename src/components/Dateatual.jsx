import React from 'react'

const Dateatual = () => {

        const dataPedidoo = new Date().toLocaleDateString('pt-BR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          });



  return (
    <fieldset className='options-select'>
    <legend>Data: {dataPedidoo}</legend>
      <legend>Seu nome: </legend>
      <select>
          <option value="">Selecione seu nome</option>
          <option value="Cleilson">CLEILSON</option>
          <option value="CRISTIANO">CRISTIANO</option>
          <option value="CEZAR">CEZAR</option>
          <option value="SIMONE">SIMONE</option>
      </select>
  </fieldset>
  )
}

export default Dateatual