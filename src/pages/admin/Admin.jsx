
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

const formatVND = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

// Hàm biến chuỗi "1-3, 5" thành mảng [1, 2, 3, 5]
const parseRangeString = (input) => {
  const ids = new Set();
  input.split(',').forEach(part => {
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(n => parseInt(n.trim(), 10));
      if (!isNaN(start) && !isNaN(end) && start <= end) {
        for (let i = start; i <= end; i++) ids.add(i);
      }
    } else {
      const num = parseInt(part.trim(), 10);
      if (!isNaN(num)) ids.add(num);
    }
  });
  return Array.from(ids);
};

// Hàm helper lấy UI cho Admin: Chỉ quan tâm đến màu viền Priority
// 1. Hàm helper lấy UI cho Admin: Kích thước y hệt Operator, nhưng chỉ đổi màu viền, không tô nền
const getAdminSlotUI = (priority, slotName) => {
  let classes = "flex items-center justify-center w-8 h-8 text-[13px] font-semibold border-[2.3px] bg-transparent transition-all ";
  
  switch (priority) {
    case "STUDENT": classes += "border-cyan-400 text-black/70"; break;
    case "LECTURER": classes += "border-red-500 text-black/70"; break;
    case "STAFF": classes += "border-green-500 text-black/70"; break;
    case "OTHER": classes += "border-gray-500 text-black/70"; break;
    default: classes += "border-gray-300 text-gray-400"; break;
  }
  return { classes, content: slotName };
};

// 2. Component ParkingZone: Layout lưới chuẩn 100% của Operator
const AdminParkingZone = ({ zoneLetter, startId, slotsData }) => {
  const endId = startId + 47;
  const zoneSlots = [];

  for (let i = startId; i <= endId; i++) {
    const foundSlot = slotsData.find(s => s.slotId === i);
    zoneSlots.push({
      id: i,
      name: `${zoneLetter}${i - startId + 1}`,
      priority: foundSlot ? foundSlot.priority : "OTHER"
    });
  }

  return (
    <div className="flex flex-col mb-8">
      <span className="text-[#0e4360] font-bold text-lg mb-2">Zone {zoneLetter}</span>
      <div className="grid grid-cols-12 gap-1 w-max">
        {zoneSlots.map((slot, index) => {
          const { classes, content } = getAdminSlotUI(slot.priority, slot.name);
          return (
            <React.Fragment key={slot.id}>
              {/* Dòng kẻ chia đôi Zone */}
              {index === 24 && (
                <div className="col-span-12 h-[2px] bg-gray-300 my-1"></div>
              )}
              <button 
                className={classes}
                title={`Slot: ${slot.name} | Priority: ${slot.priority}`}
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

// 3. Component tổng quản lý bản đồ: Bố cục cột trái/phải và Entry Gate y hệt Operator
// (Đã chèn thêm props để chuẩn bị cho Phase Bulk Update)
const AdminSeatMap = ({ slotsData, bulkSlotInput, setBulkSlotInput, bulkPriority, setBulkPriority, handleBulkUpdate }) => {
  return (
    <div className="flex flex-col relative w-full h-full p-4 overflow-y-auto">
      <div className="flex flex-row justify-center gap-65 w-full px-10 relative z-10">
        
        {/* CỘT TRÁI: Khu D, Khu E */}
        <div className="flex flex-col justify-between">
          <div>
            <AdminParkingZone zoneLetter="D" startId={145} slotsData={slotsData} />
            <AdminParkingZone zoneLetter="E" startId={193} slotsData={slotsData} />
          </div>
          
          {/* CỤM UI DƯỚI CÙNG (Dựa theo Frame 107.jpg) */}
          <div className="flex flex-col mt-4">
            
            {/* Form Bulk Update */}
            <div className="flex flex-col bg-white p-3 rounded-lg shadow-md border border-gray-300 w-max mb-6">
              <span className="font-bold text-[16px] mb-2 text-black/80">Priority Update:</span>
              <div className="flex flex-row gap-2">
                <input
                  type="text"
                  placeholder="IDs (e.g., 10-15, 20)"
                  className="border-[1.5px] border-gray-300 rounded px-2 text-sm w-[150px] outline-none focus:border-[#3C8DBC]"
                  value={bulkSlotInput}
                  onChange={(e) => setBulkSlotInput(e.target.value)}
                />
                <select
                  className="border-[1.5px] border-gray-300 text-gray-600 rounded px-2 text-sm outline-none cursor-pointer"
                  value={bulkPriority}
                  onChange={(e) => setBulkPriority(e.target.value)}
                >
                  <option value="default" hidden>-- Role --</option>
                  <option value="STAFF">STAFF</option>
                  <option value="LECTURER">LECTURER</option>
                  <option value="STUDENT">STUDENT</option>
                  <option value="OTHER">OTHER</option>
                </select>
                <button
                  onClick={handleBulkUpdate}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold text-sm px-4 py-1.5 rounded cursor-pointer"
                >
                  Apply bulk update
                </button>
              </div>
              <span className="text-[20px] text-black mt-2 italic">
                *Guide: A(1-48). B(49-96). C(97-144). D(145-192). E(193-240)
              </span>
            </div>

            {/* Legend - Chỉ gồm 4 Priority */}
            <div className="grid grid-cols-2 gap-y-4 gap-x-8">
              <div className="flex items-center gap-3"><div className="w-8 h-8 border-[2.3px] border-green-500"></div><span className="text-xl">Staff priority</span></div>
              <div className="flex items-center gap-3"><div className="w-8 h-8 border-[2.3px] border-cyan-400"></div><span className="text-xl">Student priority</span></div>
              <div className="flex items-center gap-3"><div className="w-8 h-8 border-[2.3px] border-gray-500"></div><span className="text-xl">Other priority</span></div>
              <div className="flex items-center gap-3"><div className="w-8 h-8 border-[2.3px] border-red-500"></div><span className="text-xl">Lecturer priority</span></div>
            </div>

          </div>
        </div>

        {/* CỘT PHẢI: Khu C, Khu B, Khu A */}
        <div className="flex flex-col">
          <AdminParkingZone zoneLetter="C" startId={97} slotsData={slotsData} />
          <AdminParkingZone zoneLetter="B" startId={49} slotsData={slotsData} />
          <AdminParkingZone zoneLetter="A" startId={1} slotsData={slotsData} />
        </div>

      </div>
    
      {/* Mũi tên Entry Gate */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-0">
        <svg className="w-48 h-48 text-[#e5e5e5] opacity-80" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L2 12h5v10h10V12h5L12 2z" />
        </svg>
        <span className="text-xl font-medium text-black/30 mt-2">Entry Gate</span>
      </div>
    </div>
  );
};

const Admin = () => {
  const navigate = useNavigate(); // Khởi tạo hàm navigate
  const [activeTab, setActiveTab] = useState("PRICE"); // quản lý tab
  const [tickets, setTickets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [role, setRole] = useState("default"); // cho select của price
  // State để lưu cục dữ liệu giá và state cho ô input
  const [prices, setPrices] = useState({}); 
  const [newPriceInput, setNewPriceInput] = useState("");
  // State lưu danh sách slot
  const [slotsData, setSlotsData] = useState([]); 
  // THÊM: State cho Bulk Update
  const [bulkSlotInput, setBulkSlotInput] = useState("");
  const [bulkPriority, setBulkPriority] = useState("default");
  // THÊM: 3 State quản lý trạng thái tải dữ liệu cho Admin
  const [isLoadingPrices, setIsLoadingPrices] = useState(true);
  const [isLoadingSlots, setIsLoadingSlots] = useState(true);
  const [isLoadingTickets, setIsLoadingTickets] = useState(true);
  // 1. Thêm State cho Toast thông báo
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });

  const username = sessionStorage.getItem("sebtl_username") || "User";

  const showToast = (message, type = "error") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ visible: false, message: "", type: "success" }), 4000);
  };

  // 2. Auth Check & Axios Interceptor (Chạy 1 lần khi load trang)
  useEffect(() => {
    const token = sessionStorage.getItem("sebtl_token");
    const role = sessionStorage.getItem("sebtl_role");

    // Khóa cửa: Nếu không có token hoặc sai role (không phải ADMIN) thì đuổi về login
    if (!token || role !== "ADMIN") {
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

  // Trong handleBulkUpdate:
  const handleBulkUpdate = async () => {
    if (bulkPriority === "default") {
      showToast("Please select a role to apply.", "error"); // Đổi alert thành showToast
      return;
    }
    const slotArray = parseRangeString(bulkSlotInput);
    if (slotArray.length === 0) {
      showToast("Invalid slot format. Please use numbers and ranges like 1-5, 8", "error");
      return;
    }
    if (!window.confirm(`Change ${slotArray.length} slots to ${bulkPriority}?`)) return;

    try {
      const token = sessionStorage.getItem("sebtl_token");
      const res = await axios.patch(
        "http://localhost:18080/admin/slots/bulk",
        { slotIds: slotArray, priority: bulkPriority }, 
        { headers: { Authorization: token } }
      );

      // Đổi alert thành Toast Success
      showToast(res.data?.message || `Successfully updated ${slotArray.length} slots.`, "success");
      
      setBulkSlotInput("");
      setBulkPriority("default");
      fetchSlots(); 
    } catch (error) {
       // Không cần alert nữa, Interceptor đã bắt lỗi
    }
  };

  // 1. Cập nhật fetchSlots
  const fetchSlots = async () => {
    try {
      const token = sessionStorage.getItem("sebtl_token");
      if (!token) return;
      const response = await axios.get("http://localhost:18080/admin/slots", {
        headers: { Authorization: token }
      });
      setSlotsData(response.data);
    } catch (error) {
      if (error.response?.status === 401) navigate("/login");
      console.error("Lỗi lấy dữ liệu slots:", error);
    } finally {
      setIsLoadingSlots(false); // Tắt loading slots
    }
  };

  // 2. Cập nhật fetchPrice
  const fetchPrice = async () => {
    try {
      const token = sessionStorage.getItem("sebtl_token");
      const res = await axios.get("http://localhost:18080/admin/price", {
        headers: { Authorization: token }
      });
      setPrices(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy giá:", error);
      if (error.response?.status === 401) navigate("/login");
    } finally {
      setIsLoadingPrices(false); // Tắt loading prices
    }
  };

  // Trong handleUpdatePrice:
  const handleUpdatePrice = async () => {
    if (role === "default") {
      showToast("Please select a role to update.", "error");
      return;
    }
    if (!newPriceInput || isNaN(newPriceInput) || Number(newPriceInput) < 0) {
      showToast("Please enter a valid price.", "error");
      return;
    }

    try {
      const token = sessionStorage.getItem("sebtl_token");
      const res = await axios.put(
        `http://localhost:18080/admin/price?priority=${role}&newPrice=${newPriceInput}`, 
        {}, 
        { headers: { Authorization: token } }
      );

      // Đổi alert thành Toast Success
      showToast(res.data?.message || "Price updated successfully.", "success");
      
      setNewPriceInput("");
      setRole("default");
      fetchPrice();
    } catch (error) {
       // Không cần alert nữa, Interceptor đã bắt lỗi
    }
  };

// 3. Cập nhật fetchTickets
  const fetchTickets = async () => {
    setIsLoadingTickets(true); // Bật loading mỗi khi tải lại danh sách
    try {
      const token = sessionStorage.getItem("sebtl_token");
      const res = await axios.get("http://localhost:18080/admin/history", {
        headers: { Authorization: token }
      });
      setTickets(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy history:", error);
    } finally {
      setIsLoadingTickets(false); // Tắt loading tickets
    }
  };

  // 4. Cập nhật searchTickets
  const searchTickets = async () => {
    setIsLoadingTickets(true); // Bật loading khi bắt đầu tìm kiếm
    if (!searchQuery.trim()) {
      fetchTickets();
      return;
    }

    try {
      const token = sessionStorage.getItem("sebtl_token");
      const res = await axios.get(`http://localhost:18080/admin/history/search?query=${searchQuery}`, {
        headers: { Authorization: token }
      });
      setTickets(res.data);
    } catch (error) {
      console.error("Lỗi khi search history:", error);
    } finally {
      setIsLoadingTickets(false); // Tắt loading sau khi search xong
    }
  };


  useEffect(() => {
    if (activeTab === "SLOT") {
      fetchSlots();
    } 
    else if (activeTab === "PRICE") {
      fetchPrice();
    }
    else if (activeTab === "HISTORY") {
      fetchTickets(); // Chỉ gọi 1 lần khi mở tab Ticket, không cần setInterval để tránh gián đoạn lúc đang gõ chữ tìm kiếm
    }
  }, [activeTab, navigate]); 

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
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
                    <span className="text-white text-sm font-semibold leading-tight">ADMIN</span>
                  </div>
              </div>
            </div>
          </div>

          <div className="h-px w-9/10 bg-white/30 mx-auto"></div>

          <div className="flex flex-col gap-1">

            <div 
              onClick={() => setActiveTab("PRICE")}
              className={`flex flex-row items-center justify-around gap-10 cursor-pointer ${activeTab == "PRICE" ? "bg-[#151c1e]" : "hover:bg-[#151c1e]"}  py-2.5 group`}
            >
              <div className="flex flex-row items-center gap-2">
                <img src={option_icon} />
                <span className="text-white/70 group-hover:text-white">Price management</span>
              </div>
              <img src={smaller_icon} className="group-hover:-translate-x-[5px] duration-75"/>
            </div>

            <div
              onClick={() => setActiveTab("SLOT")}
              className={`flex flex-row items-center justify-around gap-12 cursor-pointer ${activeTab == "SLOT" ? "bg-[#151c1e]" : "hover:bg-[#151c1e]"}  py-2.5 group`}
            >
              <div className="flex flex-row items-center gap-2">
                <img src={option_icon} />
                <span className="text-white/70 group-hover:text-white">Slot management</span>
              </div>
              <img src={smaller_icon} className="group-hover:-translate-x-[5px] duration-75"/>
            </div>

            <div
              onClick={() => setActiveTab("HISTORY")}
              className={`flex flex-row items-center justify-around gap-17 cursor-pointer ${activeTab == "HISTORY" ? "bg-[#151c1e]" : "hover:bg-[#151c1e]"}  py-2.5 group`}
            >
              <div className="flex flex-row items-center gap-2">
                <img src={option_icon} />
                <span className="text-white/70 group-hover:text-white">Ticket History</span>
              </div>
              <img src={smaller_icon} className="group-hover:-translate-x-[5px] duration-75"/>
            </div>
          </div>

        </div>
        <div className="flex flex-col flex-1 gap-1">

          <div className="flex flex-row justify-between w-full pt-[7px] pr-3">
            <div className="flex flex-row items-baseline gap-5">
              <span className="text-[30px] text-black/90">Parking Management</span>
              <span className="text-[17px] text-black/50">Admin application</span>
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


          {activeTab === "PRICE" &&
          <div className="flex flex-col bg-white drop-shadow-xl/50 flex-1 mb-4 mr-20 border-t-[#3C8DBC] border-t-[4px] rounded-[5px] px-2 gap-4">
            <span className="text-[#0e4360] text-[30px] font-medium flex justify-center">Price management</span>
            {/* Thêm từ điển map tên hiển thị ngay trên <table> hoặc ngoài component đều được, ở đây để sát cho dễ nhìn */}
            <table className="w-5/10">
              <thead>
                <tr>
                  <th className="w-4/10">Role</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {isLoadingPrices ? (
                  <tr>
                    <td colSpan="2" className="text-center py-4 text-gray-500 font-medium animate-pulse">
                      Loanding...
                    </td>
                  </tr>
                ) : Object.keys(prices).length === 0 ? (
                  <tr>
                    <td colSpan="2" className="text-center py-4 text-gray-500">No prices found.</td>
                  </tr>
                ) : (
                  Object.entries(prices).map(([roleKey, priceValue]) => {
                    const roleDisplayNames = {
                      STUDENT: "Student members",
                      STAFF: "Staff members",
                      LECTURER: "Faculty members",
                      OTHER: "Temporary visitors"
                    };
                    return (
                      <tr key={roleKey}>
                        <td>{roleDisplayNames[roleKey] || roleKey}</td>
                        <td>{formatVND(priceValue)}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
            <div className="flex flex-row gap-3">
              <select 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                // Logic đổi màu nằm ở đây
                className={`
                  border-[2px] border-solid rounded-[4px] cursor-pointer ml-4 pl-2 pr-2 py-2 outline-none 
                  ${role === "default" ? "text-black/55 border-black/20" : "text-black border-black/90  "}
                `}
              >
                <option value="default" hidden>-- choose the role you want to config --</option>
                
                <option value="STAFF" className="text-black">STAFF</option>
                <option value="LECTURER" className="text-black">LECTURER</option>
                <option value="STUDENT" className="text-black">STUDENT</option>
                <option value="OTHER" className="text-black">OTHER</option>
              </select>
              {/* SỬA: Gắn value và onChange cho input */}
              <input 
                type="number" 
                id="newPrice" 
                placeholder="Enter new price" 
                className="border-[2px] border-solid border-black/20 rounded-[4px] pl-2"
                value={newPriceInput}
                onChange={(e) => setNewPriceInput(e.target.value)}
              />

              {/* SỬA: Thay console.log("hi") bằng handleUpdatePrice */}
              <button 
                onClick={handleUpdatePrice} 
                className="border border-solid border-black/20 bg-yellow-500 text-white font-bold px-4 rounded-[4px] cursor-pointer hover:bg-yellow-600" 
              >
                Update Price
              </button>
            </div>
          </div>}

          {activeTab === "SLOT" && (
            <div className="flex flex-col bg-white drop-shadow-xl/50 flex-1 mb-4 mr-20 border-t-[#3C8DBC] border-t-[4px] rounded-[5px] px-2 relative overflow-hidden">
              <span className="text-[#0e4360] text-[30px] font-medium flex justify-center">Slot management</span>
              
              {isLoadingSlots ? (
                <div className="flex flex-col items-center justify-center flex-1 gap-4">
                  <div className="w-12 h-12 border-4 border-[#3C8DBC] border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-gray-500 font-medium">Loading...</span>
                </div>
              ) : (
                <AdminSeatMap 
                  slotsData={slotsData} 
                  bulkSlotInput={bulkSlotInput}
                  setBulkSlotInput={setBulkSlotInput}
                  bulkPriority={bulkPriority}
                  setBulkPriority={setBulkPriority}
                  handleBulkUpdate={handleBulkUpdate}
                />
              )}
            </div>
          )}

          {activeTab === "HISTORY" && (
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

export default Admin;