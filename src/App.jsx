import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import NewUser from "./pages/admin/NewUser";
import Dash from "./pages/admin/Dash";
import SubmitForm from "./pages/SubmitForm";
import NewPolo from "./pages/admin/NewPolo";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    // Verifica se o usuário está no localStorage
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (usuario) {
      // Verifica se o usuário é admin ou não
      if (usuario.Eadmin === 1) {
        navigate("/dashboard"); // Redireciona para o dashboard se for admin
      } else {
        navigate("/form"); // Redireciona para o formulário se não for admin
      }
    }
  }, [navigate]);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/new-user" element={<NewUser />} />
        <Route path="/dashboard" element={<Dash />} />
        <Route path="/form" element={<SubmitForm />} />
        <Route path="/new-polo" element={<NewPolo />} />
      </Routes>
    </div>
  );
}

export default App;
