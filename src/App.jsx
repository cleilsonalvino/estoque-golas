import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import NewUser from "./pages/admin/NewUser";
import Dash from "./pages/Dash";
import SubmitForm from "./pages/SubmitForm";
import NewPolo from "./pages/admin/NewPolo";

function App() {
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
