const Sendaction = ({ tipo, onChange, name }) => {
  return (
    <fieldset>
      <legend>Selecione a opção correspondente:</legend>
      <div className="select-radio">
        <input
          type="radio"
          name={name} // Nome único
          id={`${name}-entrada`}
          value="entrada"
          checked={tipo === "entrada"}
          onChange={onChange}
        />
        <label htmlFor={`${name}-entrada`}>Entrada</label>

        <input
          type="radio"
          name={name} // Nome único
          id={`${name}-saida`}
          value="saida"
          checked={tipo === "saida"}
          onChange={onChange}
        />
        <label htmlFor={`${name}-saida`}>Saída</label>
      </div>
    </fieldset>
  );
};

export default Sendaction;
