import BachKhoa_image from '../../assets/bk_name_vi.png';
import Bycicle_img from '../../assets/bycicle.svg';

import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate(); // Khởi tạo hàm điều hướng
  const [showError, setShowError] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    console.log("teeeee"); // test thui
    e.preventDefault();
    setShowError(false); // Reset thông báo lỗi mỗi lần nhấn Submit lại

    try {
      // Gọi API POST tới Backend (Port 18080)
      const response = await axios.post("http://localhost:18080/auth/login", {
        username: username,
        password: password,
      });

      // Nếu thành công (Status 200)
      if (response.status === 200) {
        const data = response.data;
        console.log("Đăng nhập thành công:", data);

        // LƯU VÀO SESSION STORAGE (Khớp hoàn toàn với logic auth.html của bạn)
        sessionStorage.setItem("sebtl_token", data.token);
        sessionStorage.setItem("sebtl_role", data.role);

        // Điều hướng dựa trên Role trả về từ Backend
        // Chúng ta chuyển role về chữ thường để khớp với định nghĩa Route (ví dụ: /admin, /member)
        const targetPath = `/${data.role.toLowerCase()}`;
        
        console.log("Đang điều hướng tới:", targetPath);
        navigate(targetPath);
      }
    } catch (error) {
      // Nếu có lỗi (Sai pass, user không tồn tại, hoặc lỗi server)
      console.error("Lỗi đăng nhập:", error);
      setShowError(true); // Kích hoạt hiển thị dòng chữ "Invalid credentials"
    }
  };

  return (
    <div className='flex flex-col bg-white min-h-screen'>
      
      <img src={BachKhoa_image} className='w-[450px] p-12 '></img>
      
      <div className='flex flex-col justify-center items-center '>

        <div className='w-[1400px]'>

          <div className='flex flex-col w-full h-[500px] pt-[12px] drop-shadow-xl/40  bg-white rounded-[10px] border border-black/20 border-solid'>
            <div className='h-[80px] bg-[#003F7F] flex flex-row gap-[10px] items-center'>
              <img src={Bycicle_img} alt="a bycicle" className='w-18 pl-[15px]' />
              <p className='text-white text-[35px] font-bold'>
                Parking Management Authentication Service
              </p>
            </div>

            <div className='flex flex-row p-[20px] h-full w-full gap-5'>

              <div className='bg-[#EEEEEE] rounded-[10px] h-full w-[47%] p-[20px] flex flex-col gap-3 '>

                <div className='flex flex-col gap-2'>
                  <p className='text-[#A80000] font-bold text-xl'>
                    Enter your Username and Password
                  </p>
                  <div className='h-px w-full bg-black/10'></div>
                </div>

                <form onSubmit={handleLogin}>
                  <div className='flex flex-col gap-2'>
                    <div className='flex flex-col'>
                      <label htmlFor="userinput" className='text-black/35 font-bold'>Username</label> 
                      <input 
                        type="text" 
                        name="userinput" 
                        id="userinput" 
                        placeholder='type in your user name!'
                        value={username}
                        onChange={(e) => {setUsername(e.target.value)}}
                        className='bg-[#E8F0FE] p-[6px] border-2 border-solid border-black/20 rounded-[5px] hover:border-black/70' /> 
                    </div>

                    <div className='flex flex-col'>
                      <label htmlFor="passwordinput" className='text-black/35 font-bold'>Password</label>
                      <input 
                        type="password" 
                        name='passwordinput' 
                        id="passwordinput" 
                        placeholder='type in your password!'
                        value={password}
                        onChange={(e) => {setPassword(e.target.value)}}
                        className='bg-[#E8F0FE] p-[6px] border-2 border-solid border-black/20 rounded-[5px] hover:border-black/70' />
                    </div>
                  </div>
                  
                  {showError && <p className="text-red-600">Invalid credentials</p>}

                  <div className='flex flex-row gap-3 mt-4'>
                    <input 
                      type="submit" 
                      value="Submit" 
                      className='cursor-pointer bg-[#0760BA] text-white font-semibold px-4 py-1 rounded-[6px] hover:bg-[#03386d]'/>
                    <input 
                      type="reset" 
                      value="Reset" 
                      className='cursor-pointer bg-[#0760BA] text-white font-semibold px-4 py-1 rounded-[6px] hover:bg-[#03386d]'/>
                  </div>
                </form>

              </div>

              <div className='flex flex-col gap-5 pt-3'>

                <div className='flex flex-col'>
                  <span className='text-[#A80000]'>Language</span>
                  <div className='flex flex-row gap-3 pl-3'>
                    <span>Vietnamese</span>
                    <div className='w-px bg-black/50'></div>
                    <span>English</span>
                  </div>
                </div>

                <div className='flex flex-col'>
                  <span className='text-[#A80000]'>Please note</span>
                  <div className='flex flex-col pl-3 gap-1.5'>
                    <p>
                      The Login page enables single sign-on to multiple websites at HCMUT. This means that you only have to enter your user name and password once for websites that subscribe to the Login page.
                    </p>
                    <p>
                      You will need to use your HCMUT Username and password to login to this site. The "HCMUT" account provides access to many resources including the HCMUT Information System, e-mail, ...
                    </p>
                    <p>
                      For security reasons, please Exit your web browser when you are done accessing services that require authentication!
                    </p>
                  </div>
                </div>

                <div className='flex flex-col'>
                  <span className='text-[#A80000]'>Technical support</span>
                  <div className='flex flex-row gap-3 pl-3'>
                    <span>
                      E-mail: support@hcmut.edu.vn
                    </span>
                    <div className='w-px bg-black/50'></div>
                    <span>Tel: (84-8) 38647256 - 7204</span>
                  </div>
                </div>


              </div>

            </div>
          </div>

          <p className='mt-[18px] leading-tight text-xs text-black/50'>
            Copyright © 2026-2027 Ho Chi Minh University of Technology. All rights reserved. <br></br>
            Powered by Software Enginering team
          </p>

        </div>

      </div>

      

    </div>
  );

}

export default Login;