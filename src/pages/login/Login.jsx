import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { initialData } from "../../database/initData";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = () => {
   
    const account = initialData.ACCOUNT_DB.find(
      (acc) => acc.username === username && acc.password === password
    );

    if (!account) {
      alert("Wrong username or password!");
      return;
    }

    // Save current user (optional)
    localStorage.setItem("currentUser", JSON.stringify(account));

    // Redirect based on role
    switch (account.role) {
      case "member":
        navigate("/member");
        break;
      case "operator":
        navigate("/operator");
        break;
      case "admin":
        navigate("/admin");
        break;
      default:
        navigate("/login");
    }
    localStorage.setItem("user", JSON.stringify({ role: "member" }));

   /* navigate("/"); */// redirect after login
  };
  return (
   /* <div className="flex h-screen justify-center items-center text-pink-600 font-bold">
      phần này của sếp Nguyễn Lê Hải Quân nhóe 🩷🐧
    </div>  */
        <div className="flex h-screen">
      {/* LEFT */}
      <div className="w-[45%] bg-blue-900 text-white p-16 flex flex-col justify-center">
        <h1 className="text-3xl font-bold mb-2">🚗 BKPark</h1>
        <p className="opacity-80 mb-10">Smart Parking System</p>

        <div className="mb-10">
          <h4 className="text-sm">HCMUT - VNU</h4>
          <p className="text-sm opacity-70">
            Ho Chi Minh City University of Technology
          </p>
        </div>

        <div className="bg-white/10 p-4 rounded-lg text-sm">
          Real-time parking management with IoT integration, automatic billing,
          and smart guidance.
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-[55%] bg-gray-100 flex justify-center items-center">
        <div className="w-[380px]">
          <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
          <p className="text-gray-500 mb-6">
            Sign in to access the parking system
          </p>

          <div>
          <input
            className="w-full p-3 border rounded-lg mb-3"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            className="w-full p-3 border rounded-lg mb-3"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            className="w-full bg-blue-900 text-white p-3 rounded-lg font-semibold"
          >
            Login with HCMUT_SSO
          </button>
          </div>
            
        </div>
      </div>
    </div>

    
  )
}

