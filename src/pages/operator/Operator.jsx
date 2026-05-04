
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



const getSlotUI = (priority, status, slotName) => {
  let classes = "flex items-center justify-center w-8 h-8 text-[13px] font-semibold border-[2.3px] transition-all ";
  let content = slotName; // Mặc định hiển thị tên slot (vd: A1)

  // 1. Xử lý viền theo Priority
  switch (priority) {
    case "STUDENT": classes += "border-cyan-400 "; break;
    case "LECTURER": classes += "border-red-500 "; break;
    case "STAFF": classes += "border-green-500 "; break;
    case "OTHER": classes += "border-gray-500 "; break;
    default: classes += "border-gray-300 "; break;
  }

  // 2. Xử lý nền và chữ theo Status
  switch (status) {
    case "OCCUPIED":
      classes += "bg-[#175c87] text-white/80 "; // Nền xanh thẫm, giấu chữ
      
      break;
    case "RESERVED":
      classes += "bg-[#175c87] text-white font-bold text-lg ";
      content = "X";
      break;
    case "UNKNOWN":
      classes += "bg-[#175c87] text-white font-extrabold text-lg ";
      content = "?";
      break;
    case "AVAILABLE":
    default:
      classes += "bg-transparent text-black/70 "; // Nền trong suốt, hiện tên slot
      break;
  }

  return { classes, content };
};

const ParkingZone = ({ zoneLetter, startId, slotsData }) => {
  const endId = startId + 47; // Tính ra ID kết thúc của khu này (VD: 1 -> 48)
  const zoneSlots = [];

  // Tạo mảng 48 phần tử cho khu vực này
  for (let i = startId; i <= endId; i++) {
    // Dò tìm slotId tương ứng trong data từ BE gửi về
    const foundSlot = slotsData.find(s => s.slotId === i);
    
    zoneSlots.push({
      id: i,
      name: `${zoneLetter}${i - startId + 1}`, // Tạo tên như A1, A2, B1...
      priority: foundSlot ? foundSlot.priority : "OTHER", // Fallback nếu chưa có data
      status: foundSlot ? foundSlot.status : "AVAILABLE"  // Fallback nếu chưa có data
    });
  }

  return (
    <div className="flex flex-col mb-8">
      <span className="text-[#0e4360] font-bold text-lg mb-2">Zone {zoneLetter}</span>
      <div className="grid grid-cols-12 gap-1 w-max">
        {zoneSlots.map((slot, index) => {
          // Gọi hàm helper ở Step 2 để lấy class CSS và Nội dung text
          const { classes, content } = getSlotUI(slot.priority, slot.status, slot.name);
          
          return (
            <React.Fragment key={slot.id}>
              {index === 24 && (
                <div className="col-span-12 h-[2px] bg-gray-300 my-1"></div>
              )}
              <button 
                className={classes}
                title={`Slot: ${slot.name} | Tình trạng: ${slot.status}`} // Hover chuột vào sẽ thấy
              >
                {content}
              </button>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

// Component tổng quản lý bản đồ
const SeatMap = ({ slotsData }) => {
  return (
    <div className="flex flex-col relative w-full h-full p-4 overflow-y-auto">
      <div className="flex flex-row justify-center gap-65 w-full px-10 relative z-10">
        
        {/* CỘT TRÁI: Khu D (bắt đầu từ 145), Khu E (bắt đầu từ 193) */}
        <div className="flex flex-col justify-between">
          <div>
            <ParkingZone zoneLetter="D" startId={145} slotsData={slotsData} />
            <ParkingZone zoneLetter="E" startId={193} slotsData={slotsData} />
          </div>
          
          {/* Legend (Giữ nguyên code Legend của bạn) */}
          <div className="flex flex-row gap-10">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3"><div className="w-8 h-8 border-2 border-cyan-400"></div><span className="text-xl">Student priority</span></div>
              <div className="flex items-center gap-3"><div className="w-8 h-8 border-2 border-red-500"></div><span className="text-xl">Lecturer priority</span></div>
              <div className="flex items-center gap-3"><div className="w-8 h-8 border-2 border-green-500"></div><span className="text-xl">Staff priority</span></div>
              <div className="flex items-center gap-3"><div className="w-8 h-8 border-2 border-gray-500"></div><span className="text-xl">Other priority</span></div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3"><div className="w-8 h-8 bg-[#175c87]"></div><span className="text-xl">Occupied</span></div>
              <div className="flex items-center gap-3"><div className="w-8 h-8 bg-[#175c87] text-white flex justify-center items-center text-xl font-bold">X</div><span className="text-xl">Reserved</span></div>
              <div className="flex items-center gap-3"><div className="w-8 h-8 bg-[#175c87] text-white flex justify-center items-center text-xl font-extrabold">?</div><span className="text-xl">Maintain (unknown)</span></div>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: Khu C (bắt đầu từ 97), Khu B (bắt đầu từ 49), Khu A (bắt đầu từ 1) */}
        <div className="flex flex-col">
          <ParkingZone zoneLetter="C" startId={97} slotsData={slotsData} />
          <ParkingZone zoneLetter="B" startId={49} slotsData={slotsData} />
          <ParkingZone zoneLetter="A" startId={1} slotsData={slotsData} />
        </div>

      </div>
    
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-0">
        <svg className="w-48 h-48 text-[#e5e5e5] opacity-80" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L2 12h5v10h10V12h5L12 2z" />
        </svg>
        <span className="text-xl font-medium text-black/30 mt-2">Entry Gate</span>
      </div>
    </div>
  );
};

const Operator = () => {
  const navigate = useNavigate(); // Khởi tạo hàm navigate
  const [activeTab, setActiveTab] = useState("REALTIME"); // quản lý tab
  const [slotsData, setSlotsData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  // THÊM: 3 State quản lý trạng thái tải dữ liệu
  const [isLoadingSlots, setIsLoadingSlots] = useState(true);
  const [isLoadingAlerts, setIsLoadingAlerts] = useState(true);
  const [isLoadingTickets, setIsLoadingTickets] = useState(true);
  // 1. Thêm State cho Toast thông báo
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });

  const showToast = (message, type = "error") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ visible: false, message: "", type: "success" }), 4000);
  };

  // 2. Auth Check & Axios Interceptor (Chạy 1 lần khi load trang)
  useEffect(() => {
    const token = sessionStorage.getItem("sebtl_token");
    const role = sessionStorage.getItem("sebtl_role");

    // Khóa cửa: Nếu không có vé hoặc sai thẻ (không phải OPERATOR) thì đuổi về login
    if (!token || role !== "OPERATOR") {
      sessionStorage.clear();
      navigate("/login");
      return;
    }

    // Cài đặt Interceptor bắt mọi lỗi từ Backend
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        // Lấy thông báo lỗi chuẩn từ Backend hoặc báo lỗi mạng
        const errorMessage = error.response?.data?.error || "Hệ thống đang bảo trì hoặc mất kết nối (500).";
        showToast(errorMessage, "error");

        // Nếu lỗi 401 (Hết hạn/Sai token) -> Đá về login
        if (error.response?.status === 401) {
          sessionStorage.clear();
          navigate("/login");
        }
        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, [navigate]);

  // 1. Cập nhật fetchTickets
  const fetchTickets = async () => {
    setIsLoadingTickets(true); // Luôn hiện loading khi tải mới/clear search
    try {
      const token = sessionStorage.getItem("sebtl_token");
      const res = await axios.get("http://localhost:18080/operator/history", {
        headers: { Authorization: token }
      });
      setTickets(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy history:", error);
    } finally {
      setIsLoadingTickets(false);
    }
  };

  // 2. Cập nhật searchTickets
  const searchTickets = async () => {
    setIsLoadingTickets(true); // Hiện loading khi tìm kiếm
    if (!searchQuery.trim()) {
      fetchTickets();
      return;
    }
    try {
      const token = sessionStorage.getItem("sebtl_token");
      const res = await axios.get(`http://localhost:18080/operator/history/search?query=${searchQuery}`, {
        headers: { Authorization: token }
      });
      setTickets(res.data);
    } catch (error) {
      console.error("Lỗi khi search history:", error);
    } finally {
      setIsLoadingTickets(false);
    }
  };

  // 2. Hàm lấy dữ liệu từ cả 2 nguồn (Active và History)
  const fetchAlerts = async () => {
    try {
      const token = sessionStorage.getItem("sebtl_token");
      if (!token) return;
      const [activeRes, historyRes] = await Promise.all([
        axios.get("http://localhost:18080/operator/alerts/active", { headers: { Authorization: token } }),
        axios.get("http://localhost:18080/operator/alerts/history", { headers: { Authorization: token } })
      ]);
      const mergedAlerts = [...activeRes.data, ...historyRes.data];
      setAlerts(mergedAlerts);
    } catch (error) {
      console.error("Lỗi khi fetch alerts:", error);
    } finally {
      setIsLoadingAlerts(false); // Tắt loading sau lần đầu tiên
    }
  };

  const fetchSlots = async () => {
    try {
      const token = sessionStorage.getItem("sebtl_token");
      if (!token) return;
      const response = await axios.get("http://localhost:18080/operator/slots", {
        headers: { Authorization: token } 
      });
      setSlotsData(response.data);
    } catch (error) {
      // XÓA ĐOẠN IF 401 Ở ĐÂY VÌ INTERCEPTOR ĐÃ LO RỒI
    } finally {
      setIsLoadingSlots(false);
    }
  };

  // 3. Hàm xử lý khi bấm nút Resolve
  const handleResolveAlert = async (alertId) => {
    if (!window.confirm(`Xác nhận xử lý lỗi #${alertId}?`)) return;

    try {
      const token = sessionStorage.getItem("sebtl_token");
      const res = await axios.patch(
        `http://localhost:18080/operator/alerts/${alertId}/resolve`,
        {}, 
        { headers: { Authorization: token } }
      );

      // ĐỔI ALERT THÀNH TOAST THÀNH CÔNG
      showToast(res.data?.message || "Resolved successfully.", "success");
      fetchAlerts();
    } catch (error) {
      // Lỗi sẽ tự động được show bằng Toast thông qua Interceptor
    }
  };
  

  useEffect(() => {
    if (activeTab === "REALTIME") {
      fetchSlots();
      const intervalId = setInterval(fetchSlots, 10000);
      return () => clearInterval(intervalId);
    } 
    else if (activeTab === "ALERT") {
      fetchAlerts();
      const intervalId = setInterval(fetchAlerts, 10000);
      return () => clearInterval(intervalId);
    }
    else if (activeTab === "TICKET") {
      fetchTickets(); // Chỉ gọi 1 lần khi mở tab Ticket, không cần setInterval để tránh gián đoạn lúc đang gõ chữ tìm kiếm
    }
  }, [activeTab, navigate]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login')
  }


  return (
    <div className="flex flex-col min-h-screen overflow-hidden bg-[#ECF0F5]">
      
      <div className="flex flex-row">
        <span className="bg-[#367FA9] flex flex-none justify-center items-center h-[65px] w-[230px] text-white font-bold">myBK/Parking-App</span>
        <div className="bg-[#3c8dbc] w-full flex flex-row justify-between">
          <img src={Bycicle_img} alt="somebycicle" className="w-[50px] pl-[10px]"/>
          <div className="flex flex-row items-center gap-2 pr-2">
            <img src={BK_whitebg} className="w-[25px] aspect-square"/>
            <span className="text-white">Nguyễn Thanh Tùng</span>
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
              <span className="text-white font-bold leading-5">Nguyễn Thanh Tùng</span>
              <div className="flex flex-row gap-1 h-[30px] items-center">
                <div className="w-[10px] h-[10px]  bg-green-400 rounded-[9999px]"></div>
                <div className="w-px h-7/10 bg-white"></div>
                  <div className="flex flex-col justify-center">
                    <span className="text-[10px] text-gray-400 leading-none">User role:</span>
                    <span className="text-white text-sm font-semibold leading-tight">OPERATOR</span>
                  </div>
              </div>
            </div>
          </div>

          <div className="h-px w-9/10 bg-white/30 mx-auto"></div>

          <div className="flex flex-col gap-1">

            <div 
              onClick={() => setActiveTab("REALTIME")}
              className={`flex flex-row items-center justify-around gap-7 cursor-pointer ${activeTab == "REALTIME" ? "bg-[#151c1e]" : "hover:bg-[#151c1e]"}  py-2.5 group`}
            >
              <div className="flex flex-row items-center gap-2">
                <img src={option_icon} />
                <span className="text-white/70 group-hover:text-white">Real-time slot history</span>
              </div>
              <img src={smaller_icon} className="group-hover:-translate-x-[5px] duration-75"/>
            </div>

            <div
              onClick={() => setActiveTab("ALERT")}
              className={`flex flex-row items-center justify-around gap-12 cursor-pointer ${activeTab == "ALERT" ? "bg-[#151c1e]" : "hover:bg-[#151c1e]"}  py-2.5 group`}
            >
              <div className="flex flex-row items-center gap-2">
                <img src={option_icon} />
                <span className="text-white/70 group-hover:text-white">Alert management</span>
              </div>
              <img src={smaller_icon} className="group-hover:-translate-x-[5px] duration-75"/>
            </div>
            <div
              onClick={() => setActiveTab("TICKET")}
              className={`flex flex-row items-center justify-around gap-20 cursor-pointer ${activeTab == "TICKET" ? "bg-[#151c1e]" : "hover:bg-[#151c1e]"}  py-2.5 group`}
            >
              <div className="flex flex-row items-center gap-2">
                <img src={option_icon} />
                <span className="text-white/70 group-hover:text-white">Ticket history</span>
              </div>
              <img src={smaller_icon} className="group-hover:-translate-x-[5px] duration-75"/>
            </div>

          </div>

        </div>
        <div className="flex flex-col flex-1 gap-1">

          <div className="flex flex-row justify-between w-full pt-[7px] pr-3">
            <div className="flex flex-row items-baseline gap-5">
              <span className="text-[30px] text-black/90">Parking Management</span>
              <span className="text-[17px] text-black/50">Operator application</span>
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

          {activeTab === "REALTIME" && (
            <div className="flex flex-col bg-white drop-shadow-xl/50 flex-1 mb-4 mr-20 border-t-[#3C8DBC] border-t-[4px] rounded-[5px] px-2 relative">
              <span className="text-[#0e4360] text-[30px] font-medium flex justify-center">Real-time slot view</span>
              
              {isLoadingSlots ? (
                <div className="flex flex-col items-center justify-center flex-1 gap-4">
                  <div className="w-12 h-12 border-4 border-[#3C8DBC] border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-gray-500 font-medium">Loading...</span>
                </div>
              ) : (
                <SeatMap slotsData={slotsData}/>
              )}
            </div>
          )}
          {activeTab === "ALERT" && (
          <div className="flex flex-col bg-white drop-shadow-xl/50 flex-1 mb-4 mr-20 border-t-[#3C8DBC] border-t-[4px] rounded-[5px] px-2">
            <span className="text-[#0e4360] text-[30px] font-medium flex justify-center">Alert management</span>
            <table>
              <thead>
                <tr>
                  <th className="w-[150px]">Action</th>
                  <th>Type</th>
                  <th>Message</th>
                  <th>Timestamp</th>
                  <th>Alert ID</th>
                </tr>
              </thead>
              <tbody>
                {isLoadingAlerts ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-gray-500 font-medium animate-pulse">
                      Loading...
                    </td>
                  </tr>
                ) : alerts.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-gray-500">No alerts found.</td>
                  </tr>
                ) : (
                  alerts.map((alert) => (
                    <tr key={alert.alertId}>
                      {/* 1. Action: Hiện nút Resolve nếu chưa xử lý, ngược lại hiện Resolved */}
                      <td className="flex justify-center">
                        {!alert.acknowledged ? (
                          <span
                            onClick={() => handleResolveAlert(alert.alertId)}
                            className="bg-green-600 font-bold text-white px-2 py-0.5 rounded-2xl cursor-pointer hover:bg-green-800"
                          >
                            Resolve
                          </span>
                        ) : (
                          <span className="text-black/20 font-bold">Resolved</span>
                        )}
                      </td>

                      {/* 2. Type: Để màu đỏ đậm nếu chưa xử lý cho dễ nhận diện */}
                      <td>
                        <span className={!alert.acknowledged ? "text-red-600 font-bold" : "text-gray-500"}>
                          {alert.type}
                        </span>
                      </td>

                      {/* 3. Message */}
                      <td>{alert.message}</td>

                      {/* 4. Timestamp */}
                      <td>{new Date(alert.timestamp).toLocaleString()}</td>

                      {/* 5. Alert ID */}
                      <td>#{alert.alertId}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
          {activeTab === "TICKET" && (
          <div className="flex flex-col bg-white drop-shadow-xl/50 flex-1 mb-4 mr-20 border-t-[#3C8DBC] border-t-[4px] rounded-[5px] px-2 py-4 overflow-hidden">
            <span className="text-[#0e4360] text-[30px] font-medium flex justify-center mb-4">Ticket history</span>
            
            {/* Thanh Tìm Kiếm */}
            <div className="flex flex-row gap-3 mb-4 px-2 justify-center items-center">
              <input 
                type="text" 
                placeholder="Search Plate, Ticket ID, or User ID" 
                className="border-[1.5px] border-gray-300 rounded-[4px] px-3 py-1.5 w-[350px] outline-none focus:border-[#3C8DBC] transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchTickets()} // Nhấn Enter để search luôn
              />
              <button 
                onClick={searchTickets} 
                className="bg-[#3C8DBC] text-white px-4 py-1.5 rounded-[4px] hover:bg-[#2e6b8f] font-medium transition-colors"
              >
                Search
              </button>
              <button 
                onClick={() => { setSearchQuery(""); fetchTickets(); }} 
                className="bg-gray-500 text-white px-4 py-1.5 rounded-[4px] hover:bg-gray-600 font-medium transition-colors"
              >
                Clear
              </button>
            </div>

            {/* Bảng Dữ Liệu */}
            <div className="overflow-y-auto w-full flex-1">
              <table className="w-full">
                <thead className="sticky top-0 bg-gray-100 z-10">
                  <tr>
                    <th>Status</th>
                    <th>Type</th>
                    <th>Parking spot</th>
                    <th>Licence plate</th>
                    <th>Entry time</th>
                    <th>Exit time</th>
                    <th>Ticket ID</th>
                    <th>User ID</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoadingTickets ? (
                      <tr>
                        <td colSpan="8" className="text-center py-10 text-gray-500 font-medium animate-pulse">
                          Loading...
                        </td>
                      </tr>
                    ) : tickets.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="text-center py-4 text-gray-500">
                          No tickets found matching your search.
                        </td>
                      </tr>
                    ) : (
                    tickets.map((ticket) => (
                      <tr key={ticket.ticketId}>
                        {/* Status giống bên Member */}
                        <td className="text-center">
                          {ticket.finished ? (
                            <span className="text-gray-400 font-bold">Finished</span>
                          ) : (
                            <span className="bg-green-600 font-bold animate-pulse text-white px-2 py-0.5 rounded-2xl">Active</span>
                          )}
                        </td>

                        
                        <td className="text-center">{ticket.ticketType}</td>
                        
                        
                        <td className="text-center">{ticket.parkingSpot || "N/A"}</td>
                        
                        <td className="text-center">{ticket.licensePlate}</td>
                        
                        <td className="text-center">{new Date(ticket.entryTime).toLocaleString()}</td>
                        
                        <td className="text-center">{ticket.exitTime ? new Date(ticket.exitTime).toLocaleString() : "-"}</td>

                        <td className="text-center">#{ticket.ticketId}</td>
                        
                        {/* User ID - Bôi đậm để dễ nhìn */}
                        <td className="font-semibold text-center">{ticket.userId}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
  

          <div className="h-[20px] w-[calc(100%+16px)] bg-white -ml-[16px] text-[10px] items-center justify-between flex pl-1">
            <span>Copyright © 2026 -<span className="text-blue-500"> Software Engineer</span> . All rights reserved.</span>
            <span className="pr-2">Version 3.6.6.7</span>
          </div>

          {toast.visible && (
            <div className={`fixed top-10 left-1/2 -translate-x-1/2 px-6 py-3 rounded-md shadow-2xl z-50 text-white text[20px] font-bold transition-all duration-300 animate-fade-in-down ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
              {toast.type === "success" ? "✅ " : "⚠️ "} 
              {toast.message}
            </div>
          )}
        </div>


      </div>
    </div>
  );
}

export default Operator;