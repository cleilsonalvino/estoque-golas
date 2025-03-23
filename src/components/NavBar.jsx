import React from "react";
import "../pages/admin/index.css";

function NavBar() {
  const logout = () => {
    localStorage.removeItem("usuario");
    navigate("/login"); // Redireciona para a tela de login
  };

  return (
    <div className="w-100 mt-4 p-2">
      <a href="/" onClick={logout}>
        Sair
      </a>
    </div>
  );
}

export default NavBar;
