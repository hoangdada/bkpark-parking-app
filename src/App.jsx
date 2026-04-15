import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { initializeDatabases } from './database/dbSetup';

import Login from "./pages/login/Login.jsx";
import Member from "./pages/member/Member.jsx";
import Operator from "./pages/operator/Operator.jsx";
import Admin from "./pages/admin/Admin.jsx";
import Simulator from "./pages/simulator/Simulator.jsx";

function App() {
  useEffect(() => {
    initializeDatabases(); // Khởi tạo DB ngay khi App chạy
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/member" element={<Member />} />
        <Route path="/operator" element={<Operator />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/simulator" element={<Simulator />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;