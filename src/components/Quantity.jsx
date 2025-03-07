import React from 'react'

const Quantity = () => {
  return (
    <fieldset>
    <legend>Digite a quantidade: </legend>
    <input
      type="number"
      id="adjustmentInput"
      min={1}
      className="custom-number-input"
      placeholder="quantidade"
    />
  </fieldset>
  )
}

export default Quantity