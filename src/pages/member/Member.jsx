
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import thêm hook điều hướng
import axios from "axios";

import Bycicle_img from '../../assets/bycicle.svg';
import BK_whitebg from '../../assets/bk-whitebg.png';
import vnflag from '../../assets/Flag_of_Vietnam.svg';
import ukflag from '../../assets/Flag_of_the_United_Kingdom_(3-5).svg';
import user_icon from '../../assets/user-icon.svg';
import option_icon from '../../assets/option-icon.svg';
import smaller_icon from '../../assets/smaller_icon.svg';
import logout_icon from '../../assets/logout-icon.svg';


const Member = () => {
  const navigate = useNavigate(); // Khởi tạo hàm navigate
  const [history, setHistory] = useState([]);
  const [payment, setPayment] = useState([]);
  const [activeTab, setActiveTab] = useState("HISTORY"); // quản lý tab
  // THÊM DÒNG NÀY: State để quản lý việc đang tải dữ liệu
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  // 1. Thêm State cho Toast thông báo
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });

  const showToast = (message, type = "error") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ visible: false, message: "", type: "success" }), 4000);
  };

  const username = sessionStorage.getItem("sebtl_username") || "User";

  // 2. Cài đặt Global Interceptor
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response, // Nếu gọi API thành công -> cho qua
      (error) => {
        // Bắt mọi lỗi 400, 401, 403, 404, 500 ở đây
        
        // Trích xuất key "error" theo đúng chuẩn của BE, nếu BE sập (500) thì báo lỗi mạng
        const errorMessage = error.response?.data?.error || "Hệ thống đang bảo trì hoặc mất kết nối (500).";
        
        // Hiển thị Toast với lỗi từ Backend
        showToast(errorMessage, "error");

        // Xử lý riêng biệt cho 401 (Sai token / Hết hạn token)
        if (error.response?.status === 401) {
          sessionStorage.clear();
          navigate("/login");
        }

        return Promise.reject(error);
      }
    );

    // Dọn dẹp interceptor khi rời khỏi trang
    return () => axios.interceptors.response.eject(interceptor);
  }, [navigate]);

  const fetchPayment = async () => {
    try {
      const token = sessionStorage.getItem("sebtl_token");
      const response = await axios.get("http://localhost:18080/member/payment", { headers: { Authorization: token } });
      setPayment(response.data);
    } catch (error) {
      // Không cần if (error.response?.status === 401) nữa vì Interceptor đã lo!
    }
  };


  useEffect(() => {
    const token = sessionStorage.getItem("sebtl_token");
    const role = sessionStorage.getItem("sebtl_role");

    if (!token || role !== "MEMBER") {
      console.log("Unauthorized access. Redirecting to login.");
      sessionStorage.clear(); 
      navigate("/login"); 
    }

    const fetchHistory = async () => {
      try {
        const response = await axios.get("http://localhost:18080/member/history", {
          headers: { Authorization: token }
        });
        setHistory(response.data);
      } catch (error) {
        if (error.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        // THÊM DÒNG NÀY: Dù thành công hay thất bại thì cũng tắt trạng thái loading
        setIsLoadingHistory(false); 
      }
    };


    fetchPayment();
    fetchHistory();

  }, [navigate]); 

  const handleLogout = () => {
    // Xóa sạch toàn bộ dữ liệu trong session
    sessionStorage.clear();
    // Điều hướng người dùng về lại trang login
    navigate("/login");
  };

  // 2. Viết hàm xử lý thanh toán (Tương đương executePayment cũ)
  const handlePayment = async (billId) => {
    if (!window.confirm("Redirecting to BKPay. Confirm payment?")) return;
    try {
      const token = sessionStorage.getItem("sebtl_token");
      const res = await axios.post(`http://localhost:18080/member/payment/${billId}`, {}, { headers: { Authorization: token } });
      showToast(res.data?.message || "Payment successful.", "success"); // Đổi alert thành Toast
      fetchPayment(); 
    } catch (error) {
      // Lỗi đã được Interceptor hiển thị bằng Toast, không cần alert("Payment failed") nữa.
    }
  };



  return (
    <div className="flex flex-col min-h-screen overflow-hidden bg-[#ECF0F5]">
      
      <div className="flex flex-row">
        <span className="bg-[#367FA9] flex flex-none justify-center items-center h-[65px] w-[230px] text-white font-bold">myBK/Parking-App</span>
        <div className="bg-[#3c8dbc] w-full flex flex-row justify-between">
          <img src={Bycicle_img} alt="somebycicle" className="w-[50px] pl-[10px]"/>
          <div className="flex flex-row items-center gap-2 pr-2">
            <img src={BK_whitebg} className="w-[25px] aspect-square"/>
            <span className="text-white">{username}</span>
            <img src={vnflag} className="w-[20px]" />
            <img src={ukflag} className="w-[20px]"/>
          </div>
        </div>
      </div>


      <div className="flex flex-row flex-1 gap-4">
        <div className="flex flex-col w-[230px] bg-[#222D32] pt-5 gap-6 ">
          <div className="flex flex-row h-[53px] w-full items-center gap-4.5 pl-3">
            {/**user and role info */}
            <img src={user_icon} className="aspect-square h-full"/>
            <div className="flex flex-col gap-0.5 mt-1">
              <span className="text-white font-bold leading-5">{username}</span>
              <div className="flex flex-row gap-1 h-[30px] items-center">
                <div className="w-[10px] h-[10px]  bg-green-400 rounded-[9999px]"></div>
                <div className="w-px h-7/10 bg-white"></div>
                  <div className="flex flex-col justify-center">
                    <span className="text-[10px] text-gray-400 leading-none">User role:</span>
                    <span className="text-white text-sm font-semibold leading-tight">LEARNER</span>
                  </div>
              </div>
            </div>
          </div>

          <div className="h-px w-9/10 bg-white/30 mx-auto"></div>

          <div className="flex flex-col gap-1">

            <div 
              onClick={() => setActiveTab("HISTORY")}
              className={`flex flex-row items-center justify-around gap-15 cursor-pointer ${activeTab == "HISTORY" ? "bg-[#151c1e]" : "hover:bg-[#151c1e]"}  py-2.5 group`}
            >
              <div className="flex flex-row items-center gap-2">
                <img src={option_icon} />
                <span className="text-white/70 group-hover:text-white">Ticket History</span>
              </div>
              <img src={smaller_icon} className="group-hover:-translate-x-[5px] duration-75"/>
            </div>

            <div
              onClick={() => setActiveTab("PAYMENT")}
              className={`flex flex-row items-center justify-around gap-12 cursor-pointer ${activeTab == "PAYMENT" ? "bg-[#151c1e]" : "hover:bg-[#151c1e]"}  py-2.5 group`}
            >
              <div className="flex flex-row items-center gap-2">
                <img src={option_icon} />
                <span className="text-white/70 group-hover:text-white">Payment History</span>
              </div>
              <img src={smaller_icon} className="group-hover:-translate-x-[5px] duration-75"/>
            </div>
          </div>

        </div>
        <div className="flex flex-col flex-1 gap-1">

          <div className="flex flex-row justify-between w-full pt-[7px] pr-3">
            <div className="flex flex-row items-baseline gap-5">
              <span className="text-[30px] text-black/90">Parking Infomation</span>
              <span className="text-[17px] text-black/50">Member application</span>
            </div>
            
            <div className="flex flex-row items-center gap-2 group">
              <div onClick={handleLogout} className="flex flex-row px-3 py-0.5 bg-[#9C0000] rounded-2xl gap-2 drop-shadow-xl/30 cursor-pointer hover:bg-[#db0909]">
                <img src={logout_icon} className="w-3.5"></img>
                <span className=" text-white">Log-out</span>
              </div>
              <img src={smaller_icon} className="-scale-x-100 brightness-40 w-2 group-hover:translate-x-[4px] duration-75"></img>
              <span className="text-black/50 text-[17px]">Login page</span>
            </div>
          </div>


          {activeTab === "HISTORY" &&
          <div className="flex flex-col bg-white drop-shadow-xl/50 flex-1 mb-4 mr-20 border-t-[#3C8DBC] border-t-[4px] rounded-[5px] px-2">
            <span className="text-[#0e4360] text-[30px] font-medium flex justify-center">Ticket History</span>
            <table>
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Parking spot</th>
                  <th>Licence plate</th>
                  <th>Entry time</th>
                  <th>Exit time</th>
                  <th>Ticket ID</th>
                </tr>
              </thead>
              <tbody id="history-body">
                {isLoadingHistory ? (
                  // 1. Nếu đang tải dữ liệu
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-gray-500 font-medium animate-pulse">
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : history.length === 0 ? (
                  // 2. Nếu đã tải xong nhưng mảng trống
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-gray-500">
                      No parking history found.
                    </td>
                  </tr>
                ) : (
                  // 3. Nếu có dữ liệu thì map ra bình thường
                  history.map((ticket) => (
                    <tr key={ticket.ticketId}>
                       {/* ... phần code map dữ liệu <td> của bạn giữ nguyên ... */}
                       <td>
                        {ticket.finished ? (
                          <span className="text-gray-400 font-bold">Finished</span>
                        ) : (
                          <span className="bg-green-600 font-bold animate-pulse text-white px-2 py-0.5 rounded-2xl">Active</span>
                        )}
                      </td>
                      <td>{ticket.parkingSpot || "N/A"}</td>
                      <td>{ticket.licensePlate}</td>
                      <td>{new Date(ticket.entryTime).toLocaleString()}</td>
                      <td>{ticket.exitTime ? new Date(ticket.exitTime).toLocaleString() : "-"}</td>
                      <td>#{ticket.ticketId}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>}

          {activeTab === "PAYMENT" &&
          <div className="flex flex-col bg-white drop-shadow-xl/50 flex-1 mb-4 mr-20 border-t-[#3C8DBC] border-t-[4px] rounded-[5px] px-2">
            <span className="text-[#0e4360] text-[30px] font-medium flex justify-center">Payment History</span>
            <table>
              <thead>
                <tr>
                  <th className="w-[200px]">Action</th>
                  <th>Status</th>
                  <th>Last Updated</th>
                  <th>Total Amount</th>
                  <th>Month</th>
                  <th>Bill ID</th>
                </tr>
              </thead>
              <tbody id="payment-body">
                {payment.length === 0 ? (
                  <tr>
                    {/* Sửa colSpan từ 5 thành 6 cho khớp với số lượng cột mới */}
                    <td colSpan="6" className="text-center">No payment history found.</td>
                  </tr>
                ) : (
                  payment.map((bill) => (
                    <tr key={bill.billId} >

                      {/* 1. Action */}
                      <td className="flex justify-center">
                        {bill.status !== "UNPAID" ? (
                          <span className="text-black/20">nothing</span>
                        ) : (
                          <span 
                            onClick={() => {handlePayment(bill.billId)}}
                            className="bg-green-600 font-bold text-white px-2 py-0.5 rounded-2xl cursor-pointer hover:bg-green-800"
                          >
                            Pay Now (BKPay)
                          </span>
                        )}
                      </td>

                      {/* 2. Status */}
                      <td>
                        {bill.status !== "UNPAID" ? (
                          <span className="text-gray-600 font-bold">PAID</span>
                        ) : (
                          <span className="text-orange-600 font-bold">UNPAID</span>
                        )}
                      </td>

                      {/* 3. Last Updated - Giả định key từ backend trả về là updatedAt. Bạn có thể đổi lại nếu BE dùng tên khác như lastUpdated */}
                      <td>
                         {bill.lastUpdated ? new Date(bill.lastUpdated).toLocaleString() : "-"}
                      </td>

                      {/* 4. Total Amount */}
                      <td>
                        {bill.amount}
                      </td>

                      {/* 5. Month */}
                      <td>
                        {bill.billingMonth}
                      </td>

                      {/* 6. Bill ID */}
                      <td>
                        #{bill.billId}
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          }

          <div className="h-[20px] w-[calc(100%+16px)] bg-white -ml-[16px] text-[10px] items-center justify-between flex pl-1">
            <span>Copyright © 2026 -<span className="text-blue-500"> Software Engineer</span> . All rights reserved.</span>
            <span className="pr-2">Version 3.6.6.7</span>
          </div>

          {toast.visible && (
            <div className={`fixed top-10 left-1/2 -translate-x-1/2 px-6 py-3 rounded-md shadow-2xl z-50 text-white text-[20px] font-bold transition-all duration-300 animate-fade-in-down ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
              {toast.type === "success" ? "✅ " : "⚠️ "} 
              {toast.message}
            </div>
          )}
        </div>


      </div>
    </div>
  );
}

export default Member;