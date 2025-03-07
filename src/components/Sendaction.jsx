const Sendaction = ({ tipo, onChange }) => {
    return (
      <fieldset>
        <legend>Selecione a opção correspondente:</legend>
        <div className="select-radio">
          <input
            type="radio"
            name="entradasousaidas"
            id="entrada"
            value="entrada"
            checked={tipo === "entrada"}
            onChange={onChange}
          />
          <label htmlFor="entrada">Entrada</label>
  
          <input
            type="radio"
            name="entradasousaidas"
            id="saida"
            value="saida"
            checked={tipo === "saida"}
            onChange={onChange}
          />
          <label htmlFor="saida">Saída</label>
        </div>
      </fieldset>
    );
  };

export default Sendaction