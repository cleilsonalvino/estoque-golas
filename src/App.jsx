import './App.css'
import { useState } from 'react'
import Dateatual from './components/Dateatual'
import Header from './components/Header'
import Select from './components/Select'
import Atuallyquantity from './components/Atuallyquantity'

function App() {



  return (
    <main>
    <Header/>
    <Dateatual/>
    <Select/>
  <br />
<Atuallyquantity/>
</main>
  )
}

export default App
