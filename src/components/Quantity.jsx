import React from 'react'

const Quantity = () => {
  return (
    <fieldset className='quantity'>
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