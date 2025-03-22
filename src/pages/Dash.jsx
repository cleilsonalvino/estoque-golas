import React from "react";
import NewPolo from "./admin/NewPolo";
import NewUser from "./admin/NewUser";
import NavBar from "../components/NavBar";

function Dash() {
  return (
    <div>
      <NavBar/>
      <h1>Isso aqui vai ser a dashboard</h1>
      <NewPolo />
      <NewUser />
    </div>
  );
}

export default Dash;
