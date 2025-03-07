import './App.css'
import { useState } from 'react'
import Dateatual from './components/Dateatual'
import Header from './components/Header'
import Select from './components/Select'
import Sendaction from './components/Sendaction'
import Quantity from './components/Quantity'
import Atuallyquantity from './components/Atuallyquantity'

function App() {

  const [tipo, setTipo] = useState("");

  const handleTipoChange = (event) => {
    setTipo(event.target.value);
  };

  return (
    <main>
    <Header/>
    <Dateatual/>
    <Select/>
  <br />
<Sendaction tipo={tipo} onChange={handleTipoChange} />
<Quantity/>
<Atuallyquantity/>

  <br />
</main>
  )
}

export default App
