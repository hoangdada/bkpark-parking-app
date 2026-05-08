import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; // Thêm dòng này
import Login from "./pages/login/Login.jsx";
import Member from "./pages/member/Member.jsx";
import Operator from "./pages/operator/Operator.jsx";
import Admin from "./pages/admin/Admin.jsx";
import Simulator from "./pages/simulator/Simulator.jsx"; // Nhớ import cả Simulator nếu có file

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/member" element={<Member />} />
        <Route path="/operator" element={<Operator />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/simulator" element={<Simulator />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;