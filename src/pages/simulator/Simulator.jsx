import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Bycicle_img from "../../assets/bycicle.svg";
import BK_whitebg from "../../assets/bk-whitebg.png";
import vnflag from "../../assets/Flag_of_Vietnam.svg";
import ukflag from "../../assets/Flag_of_the_United_Kingdom_(3-5).svg";
import user_icon from "../../assets/user-icon.svg";
import option_icon from "../../assets/option-icon.svg";
import smaller_icon from "../../assets/smaller_icon.svg";
import logout_icon from "../../assets/logout-icon.svg";

const API_BASE = "http://localhost:18080";
const SIM_BASE = `${API_BASE}/api/simulation`;
const AUTO_REFRESH_INTERVAL = 2000;

const parseRangeString = (input) => {
  const ids = new Set();
  input
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .forEach((part) => {
      if (part.includes("-")) {
        const [start, end] = part.split("-").map((n) => parseInt(n.trim(), 10));
        if (!isNaN(start) && !isNaN(end) && start <= end) {
          for (let i = start; i <= end; i += 1) ids.add(i);
        }
      } else {
        const num = parseInt(part, 10);
        if (!isNaN(num)) ids.add(num);
      }
    });
  return Array.from(ids);
};

const stableStringify = (value) => {
  try {
    return JSON.stringify(value, Object.keys(value || {}).sort());
  } catch (error) {
    return "";
  }
};

const getSlotUI = (priority, status, slotName) => {
  let classes =
    "flex items-center justify-center w-8 h-8 text-[13px] font-semibold border-[2.3px] transition-all ";
  let content = slotName;

  switch (priority) {
    case "STUDENT":
      classes += "border-cyan-400 ";
      break;
    case "LECTURER":
      classes += "border-red-500 ";
      break;
    case "STAFF":
      classes += "border-green-500 ";
      break;
    case "OTHER":
      classes += "border-gray-500 ";
      break;
    default:
      classes += "border-gray-300 ";
      break;
  }

  switch (status) {
    case "OCCUPIED":
      classes += "bg-[#175c87] text-white/80 ";
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
      classes += "bg-transparent text-black/70 ";
      break;
  }

  return { classes, content };
};

const ParkingZone = ({ zoneLetter, startId, slotsData }) => {
  const endId = startId + 47;
  const zoneSlots = [];

  for (let i = startId; i <= endId; i += 1) {
    const foundSlot = slotsData.find((s) => s.slotId === i);
    zoneSlots.push({
      id: i,
      name: `${zoneLetter}${i - startId + 1}`,
      priority: foundSlot ? foundSlot.priority : "OTHER",
      status: foundSlot ? foundSlot.status : "AVAILABLE",
    });
  }

  return (
    <div className="flex flex-col mb-8">
      <span className="text-[#0e4360] font-bold text-lg mb-2">Zone {zoneLetter}</span>
      <div className="grid grid-cols-12 gap-1 w-max">
        {zoneSlots.map((slot, index) => {
          const { classes, content } = getSlotUI(slot.priority, slot.status, slot.name);
          return (
            <React.Fragment key={slot.id}>
              {index === 24 && <div className="col-span-12 h-[2px] bg-gray-300 my-1" />}
              <button
                className={classes}
                title={`Slot: ${slot.name} | Status: ${slot.status}`}
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

const SeatMap = ({ slotsData }) => {
  return (
    <div className="flex flex-col relative w-full h-full p-4 overflow-y-auto">
      <div className="flex flex-row justify-center gap-65 w-full px-10 relative z-10">
        <div className="flex flex-col justify-between">
          <div>
            <ParkingZone zoneLetter="D" startId={145} slotsData={slotsData} />
            <ParkingZone zoneLetter="E" startId={193} slotsData={slotsData} />
          </div>

          <div className="flex flex-row gap-10">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 border-2 border-cyan-400" />
                <span className="text-xl">Student priority</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 border-2 border-red-500" />
                <span className="text-xl">Lecturer priority</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 border-2 border-green-500" />
                <span className="text-xl">Staff priority</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 border-2 border-gray-500" />
                <span className="text-xl">Other priority</span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#175c87]" />
                <span className="text-xl">Occupied</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#175c87] text-white flex justify-center items-center text-xl font-bold">
                  X
                </div>
                <span className="text-xl">Reserved</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#175c87] text-white flex justify-center items-center text-xl font-extrabold">
                  ?
                </div>
                <span className="text-xl">Maintain (unknown)</span>
              </div>
            </div>
          </div>
        </div>

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

const Simulator = () => {
  const navigate = useNavigate();
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });
  const [slotsData, setSlotsData] = useState([]);
  const [signFailures, setSignFailures] = useState([]);
  const [signDirections, setSignDirections] = useState([]);
  const [activeTickets, setActiveTickets] = useState([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(true);
  const [isLoadingTickets, setIsLoadingTickets] = useState(true);
  const [systemMode, setSystemMode] = useState("UNKNOWN");
  const [lotStatus, setLotStatus] = useState("UNKNOWN");
  const [gateStatus, setGateStatus] = useState("UNKNOWN");
  const [entranceResult, setEntranceResult] = useState(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);
  const [actionLoading, setActionLoading] = useState(""); // Tracks which action is processing

  const cacheRef = useRef({
    slots: "",
    signFailures: "",
    signDirections: "",
    lotStatus: "",
    gateStatus: "",
    systemMode: "",
    activeTickets: "",
  });

  const [cardReaderStatus, setCardReaderStatus] = useState("success");
  const [cardReaderRole, setCardReaderRole] = useState("member");
  const [cardUserId, setCardUserId] = useState("");
  const [cardScanResult, setCardScanResult] = useState(null);

  const [cameraMode, setCameraMode] = useState("random");
  const [expectedPlate, setExpectedPlate] = useState("");
  const [plateScanResult, setPlateScanResult] = useState(null);

  const [arrivalSlotId, setArrivalSlotId] = useState("");
  const [departureSlotId, setDepartureSlotId] = useState("");
  
  // Payment Resolution Flow
  const [paymentModalData, setPaymentModalData] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState(null);

  const [exitUserId, setExitUserId] = useState("");
  const [exitPlate, setExitPlate] = useState("");

  const [sensorFailId, setSensorFailId] = useState("");
  const [sensorFailBulk, setSensorFailBulk] = useState("");
  const [sensorFixId, setSensorFixId] = useState("");
  const [sensorFixBulk, setSensorFixBulk] = useState("");

  const showToast = (message, type = "error") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ visible: false, message: "", type: "success" }), 4000);
  };

  const authHeaders = () => {
    const token = sessionStorage.getItem("sebtl_token");
    return token ? { Authorization: token } : {};
  };

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        const errorMessage =
          error.response?.data?.error || "System unavailable or network error.";
        showToast(errorMessage, "error");
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  const applyIfChanged = (key, nextValue, setter, normalize) => {
    const value = normalize ? normalize(nextValue) : nextValue;
    const nextSerialized = stableStringify(value);
    if (cacheRef.current[key] !== nextSerialized) {
      cacheRef.current[key] = nextSerialized;
      setter(value);
      return true;
    }
    return false;
  };

  const fetchAllStatus = (isInitial = false) => {
    const headers = authHeaders();

    // Fetch Slots
    axios.get(`${SIM_BASE}/slots`, { headers }).then((res) => {
      const changed = applyIfChanged("slots", res.data || [], setSlotsData);
      if (changed) setLastUpdatedAt(new Date());
      if (isInitial) setIsLoadingSlots(false);
    }).catch(console.error);

    // Fetch System Mode
    axios.get(`${SIM_BASE}/system-mode`, { headers }).then((res) => {
      applyIfChanged("systemMode", res.data?.mode ?? "UNKNOWN", setSystemMode);
    }).catch(console.error);

    // Fetch Sign Directions
    axios.get(`${SIM_BASE}/signs`, { headers }).then((res) => {
      applyIfChanged(
        "signDirections",
        res.data,
        setSignDirections,
        (data) => {
          if (!data || typeof data !== "object") return [];
          return Object.keys(data)
            .filter((key) => key.startsWith("sign_"))
            .map((key) => ({ signIndex: parseInt(key.split("_")[1], 10), direction: data[key] || "NONE" }))
            .sort((a, b) => a.signIndex - b.signIndex);
        }
      );
    }).catch(console.error);

    // Fetch Sign Failures
    axios.get(`${SIM_BASE}/sign-failure`, { headers }).then((res) => {
      applyIfChanged(
        "signFailures",
        res.data?.failures || [],
        setSignFailures,
        (failures) => {
          if (failures && typeof failures === "object" && !Array.isArray(failures)) {
            return Object.keys(failures).map((key) => ({ signIndex: parseInt(key, 10), failed: Boolean(failures[key]) }));
          }
          if (Array.isArray(failures)) {
            return failures.map((failed, index) => ({ signIndex: index, failed: Boolean(failed) }));
          }
          return [];
        }
      );
    }).catch(console.error);

    // Fetch Lot Status
    axios.get(`${SIM_BASE}/lot-status`, { headers }).then((res) => {
      applyIfChanged("lotStatus", res.data?.lotStatus ?? "UNKNOWN", setLotStatus);
    }).catch(console.error);

    // Fetch Gate Status
    axios.get(`${SIM_BASE}/gate-status`, { headers }).then((res) => {
      applyIfChanged("gateStatus", res.data?.isOpen ? "OPEN" : "CLOSED", setGateStatus);
    }).catch(console.error);

    // Fetch Active Tickets
    axios.get(`${SIM_BASE}/active-tickets`, { headers }).then((res) => {
      applyIfChanged("activeTickets", res.data, setActiveTickets, (data) => Array.isArray(data) ? data : []);
      if (isInitial) setIsLoadingTickets(false);
    }).catch(console.error);
  };

  useEffect(() => {
    fetchAllStatus(true);
    const intervalId = setInterval(() => fetchAllStatus(false), AUTO_REFRESH_INTERVAL);
    return () => clearInterval(intervalId);
  }, []);

  const handleToggleSystemMode = async () => {
    const nextMode = systemMode === "MONITOR" ? "NORMAL" : "MONITOR";
    try {
      await axios.post(`${SIM_BASE}/system-mode`, null, {
        headers: authHeaders(),
        params: { mode: nextMode },
      });
      showToast(`System mode changed to ${nextMode}`, "success");
      fetchAllStatus(false);
    } catch (error) {}
  };

  const slotStats = useMemo(() => {
    const total = slotsData.length;
    const stats = slotsData.reduce(
      (acc, slot) => {
        acc[slot.status] = (acc[slot.status] || 0) + 1;
        return acc;
      },
      { AVAILABLE: 0, OCCUPIED: 0, RESERVED: 0, UNKNOWN: 0 }
    );
    return { total, ...stats };
  }, [slotsData]);

  const handleScanCard = async () => {
    const isGuest = cardReaderRole === "guest";
    const userId = isGuest ? "-1" : cardUserId.trim();
    
    if (!isGuest && !userId) {
      showToast("User ID is required for member scans.");
      return;
    }

    const read = cardReaderStatus === "success";
    const response = await axios.get(`${SIM_BASE}/scan-card`, {
      headers: authHeaders(),
      params: { param: userId, read, isGuest },
    });
    setCardScanResult(response.data);
    showToast(response.data.message || `ID Detected: ${response.data.userId}`, "success");
  };

  const handleScanPlate = async () => {
    const response = await axios.get(`${SIM_BASE}/scan-plate`, {
      headers: authHeaders(),
      params: { mode: cameraMode, expectedPlate },
    });
    setPlateScanResult(response.data);
    showToast(`Plate scanned: ${response.data.licensePlate}`, "success");
  };

  const handleEntranceSequence = async () => {
    setActionLoading("entrance");
    try {
      const response = await axios.post(`${SIM_BASE}/entrance`, null, {
        headers: authHeaders(),
      });
      setEntranceResult(response.data || null);
      showToast("Vehicle entered successfully.", "success");
      
      // #5 Auto-fill the Arrival Slot Input
      if (response.data && response.data.slotId) {
        setArrivalSlotId(String(response.data.slotId));
      }

      fetchAllStatus(false);
      [1000, 4000, 7000].forEach((delay) => {
        setTimeout(() => fetchAllStatus(false), delay);
      });
    } catch (error) {
    } finally {
      setActionLoading("");
    }
  };

  const handleCarDeparture = async () => {
    const targetSlot = departureSlotId.trim();
    if (!targetSlot) {
      showToast("Slot ID is required for departure.");
      return;
    }
    
    setActionLoading("departure");
    try {
      const response = await axios.post(`${SIM_BASE}/car-departure`, null, {
        headers: authHeaders(),
        params: { slotId: targetSlot },
      });
      showToast("Car departure triggered. Opening resolution.", "success");
      
      if (response.data) {
        // #6 Auto-fill Exit Kiosk inputs
        setExitUserId(String(response.data.userId || ""));
        setExitPlate(String(response.data.licensePlate || ""));

        // Trigger payment modal if applicable
        if (response.data.ticketId !== "Unknown") {
          setPaymentModalData(response.data);
        }
      }
      
      fetchAllStatus(false);
    } catch (error) {
    } finally {
      setActionLoading("");
    }
  };

  const handleCarArrival = async () => {
    const targetSlot = arrivalSlotId.trim();
    if (!targetSlot) {
      showToast("Slot ID is required for arrival.");
      return;
    }
    await axios.post(`${SIM_BASE}/car-arrival`, null, {
      headers: authHeaders(),
      params: { slotId: targetSlot },
    });
    showToast("Car arrival simulated.", "success");
    fetchAllStatus(false);
  };

  const processPayment = async (isDirect) => {
    isDirect = Boolean(isDirect);
    if (!paymentModalData) return;
    try {
        const response = await axios.post(`${SIM_BASE}/pay`, null, {
            headers: authHeaders(),
            params: { 
                ticketType: paymentModalData.ticketType, 
                userId: paymentModalData.userId, 
                price: paymentModalData.price,
                paidDirectly: isDirect
            }
        });
        console.log("Payment Response:", response.data);
        showToast(response.data.message, "success");
        
        setExitUserId(response.data.userId || paymentModalData.userId);
        setExitPlate(response.data.licensePlate || paymentModalData.licensePlate);
        
        setPaymentModalData(null);
        setQrCodeUrl(null);
        fetchAllStatus(false);

        
    } catch (e) {console.error("Payment Error:", e); }
  };

  const generateQR = () => {
      const qrData = `Pay Ticket, UID: ${paymentModalData.userId}, Amount: $${paymentModalData.price}, Receiver: Parking Lot, Ticket Type: ${paymentModalData.ticketType}`;
      setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`);
  };

  const handleExit = async () => {
    if (!exitUserId.trim() || !exitPlate.trim()) {
      showToast("User ID and License Plate are required for exit.");
      return;
    }
    try {
      await axios.post(`${SIM_BASE}/exit`, null, {
        headers: authHeaders(),
        params: {
          userId: exitUserId.trim(),
          licensePlate: exitPlate.trim(),
        },
      });
      showToast("Vehicle exited successfully.", "success");
      setExitUserId("");
      setExitPlate("");
      fetchAllStatus(false);
    } catch (e) {}
  };

  const handleSensorFailure = async () => {
    if (!sensorFailId.trim()) return showToast("Slot ID is required.");
    await axios.post(`${SIM_BASE}/sensor-failure`, null, { headers: authHeaders(), params: { slotId: sensorFailId.trim() } });
    showToast("Sensor failure injected.", "success");
    fetchAllStatus(false);
  };

  const handleSensorFailureBulk = async () => {
    const ids = parseRangeString(sensorFailBulk);
    if (!ids.length) return showToast("Provide slot IDs for bulk failure.");
    await axios.post(`${SIM_BASE}/sensor-failure-bulk`, ids, { headers: { ...authHeaders(), "Content-Type": "application/json" } });
    showToast("Bulk sensor failure injected.", "success");
    fetchAllStatus(false);
  };

  const handleSensorFix = async () => {
    if (!sensorFixId.trim()) return showToast("Slot ID is required.");
    await axios.post(`${SIM_BASE}/sensor-fix`, null, { headers: authHeaders(), params: { slotId: sensorFixId.trim() } });
    showToast("Sensor fixed.", "success");
    fetchAllStatus(false);
  };

  const handleSensorFixBulk = async () => {
    const ids = parseRangeString(sensorFixBulk);
    if (!ids.length) return showToast("Provide slot IDs for bulk fix.");
    await axios.post(`${SIM_BASE}/sensor-fix-bulk`, ids, { headers: { ...authHeaders(), "Content-Type": "application/json" } });
    showToast("Bulk sensor fix completed.", "success");
    fetchAllStatus(false);
  };

  const handleToggleSign = async (signIndex, currentFailed) => {
    try {
      await axios.post(`${SIM_BASE}/sign-failure`, null, {
        headers: authHeaders(),
        params: { signIndex: signIndex, failed: !currentFailed },
      });
      showToast(`Sign ${signIndex} status updated.`, "success");
      fetchAllStatus(false);
    } catch (error) {}
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex flex-col min-h-screen overflow-hidden bg-[#ECF0F5]">
      <div className="flex flex-row">
        <span className="bg-[#367FA9] flex flex-none justify-center items-center h-[65px] w-[230px] text-white font-bold">
          myBK/Parking-App
        </span>
        <div className="bg-[#3c8dbc] w-full flex flex-row justify-between">
          <img src={Bycicle_img} alt="bike" className="w-[50px] pl-[10px]" />
          <div className="flex flex-row items-center gap-2 pr-2">
            <img src={BK_whitebg} className="w-[25px] aspect-square" />
            <span className="text-white">Simulator</span>
            <img src={vnflag} className="w-[20px]" />
            <img src={ukflag} className="w-[20px]" />
          </div>
        </div>
      </div>

      <div className="flex flex-row flex-1 gap-4">
        <div className="flex flex-col w-[230px] bg-[#222D32] pt-5 gap-6 ">
          <div className="flex flex-row h-[53px] w-full items-center gap-4.5 pl-3">
            <img src={user_icon} className="aspect-square h-full" />
            <div className="flex flex-col gap-0.5 mt-1">
              <span className="text-white font-bold leading-5">Simulator</span>
              <div className="flex flex-row gap-1 h-[30px] items-center">
                <div className="w-[10px] h-[10px] bg-green-400 rounded-[9999px]" />
                <div className="w-px h-7/10 bg-white" />
                <div className="flex flex-col justify-center">
                  <span className="text-[10px] text-gray-400 leading-none">User role:</span>
                  <span className="text-white text-sm font-semibold leading-tight">SIMULATOR</span>
                </div>
              </div>
            </div>
          </div>

          <div className="h-px w-9/10 bg-white/30 mx-auto" />

          <div className="flex flex-col gap-1">
            <div className="flex flex-row items-center justify-around gap-7 cursor-pointer bg-[#151c1e] py-2.5 group">
              <div className="flex flex-row items-center gap-2">
                <img src={option_icon} />
                <span className="text-white">Simulation console</span>
              </div>
              <img src={smaller_icon} className="group-hover:-translate-x-[5px] duration-75" />
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-1 gap-4 pr-6 pb-6">
          <div className="flex flex-row justify-between w-full pt-[7px] pr-3">
            <div className="flex flex-row items-baseline gap-5">
              <span className="text-[30px] text-black/90">Parking Management</span>
              <span className="text-[17px] text-black/50">Simulation console</span>
            </div>

            <div className="flex flex-row items-center gap-2 group">
              <div
                onClick={handleLogout}
                className="flex flex-row px-3 py-0.5 bg-[#9C0000] rounded-2xl gap-2 drop-shadow-xl/30 cursor-pointer hover:bg-[#db0909]"
              >
                <img src={logout_icon} className="w-3.5" />
                <span className="text-white">Log-out</span>
              </div>
              <img
                src={smaller_icon}
                className="-scale-x-100 brightness-40 w-2 group-hover:translate-x-[4px] duration-75"
              />
              <span className="text-black/50 text-[17px]">Login page</span>
            </div>
          </div>

          <div className="grid grid-cols-6 gap-3">
            <div className="bg-white border-t-[#3C8DBC] border-t-[4px] rounded-[5px] p-3 drop-shadow-xl/20 flex flex-col justify-between">
              <span className="text-sm text-black/50">System mode</span>
              <div className="text-2xl font-bold text-[#0e4360] flex items-center justify-between">
                <span>{systemMode}</span>
                <button
                  onClick={handleToggleSystemMode}
                  className="text-[10px] font-bold bg-[#3C8DBC] hover:bg-[#2e6b8f] text-white px-2 py-1 rounded"
                >
                  TOGGLE
                </button>
              </div>
            </div>
            <div className="bg-white border-t-[#3C8DBC] border-t-[4px] rounded-[5px] p-3 drop-shadow-xl/20">
              <span className="text-sm text-black/50">Gate status</span>
              <div className={`text-2xl font-bold ${gateStatus === 'OPEN' ? 'text-green-600' : 'text-[#9C0000]'}`}>{gateStatus}</div>
            </div>
            <div className="bg-white border-t-[#3C8DBC] border-t-[4px] rounded-[5px] p-3 drop-shadow-xl/20">
              <span className="text-sm text-black/50">Lot status</span>
              <div className="text-2xl font-bold text-[#0e4360]">{lotStatus}</div>
            </div>
            <div className="bg-white border-t-[#3C8DBC] border-t-[4px] rounded-[5px] p-3 drop-shadow-xl/20">
              <span className="text-sm text-black/50">Slots</span>
              <div className="text-lg font-bold text-[#0e4360]">
                {slotStats.AVAILABLE}/{slotStats.total} available
              </div>
              <div className="text-xs text-black/50">
                Occ {slotStats.OCCUPIED} | Res {slotStats.RESERVED} | Unk {slotStats.UNKNOWN}
              </div>
            </div>
            <div className="bg-white border-t-[#3C8DBC] border-t-[4px] rounded-[5px] p-3 drop-shadow-xl/20">
              <span className="text-sm text-black/50">Sign failures</span>
              <div className="text-2xl font-bold text-[#0e4360]">
                {signFailures.filter((s) => s.failed).length}
              </div>
            </div>
            <div className="bg-white border-t-[#3C8DBC] border-t-[4px] rounded-[5px] p-3 drop-shadow-xl/20">
              <span className="text-sm text-black/50">Active tickets</span>
              <div className="text-2xl font-bold text-[#0e4360]">{activeTickets.length}</div>
            </div>
          </div>
          <div className="text-xs text-black/40 pl-1">
            Last updated: {lastUpdatedAt ? lastUpdatedAt.toLocaleTimeString() : "--"}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col bg-white drop-shadow-xl/20 border-t-[#3C8DBC] border-t-[4px] rounded-[5px] px-4 py-3 gap-3">
              <span className="text-[#0e4360] text-[22px] font-medium">Entrance simulation</span>
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-black/70">Card reader</span>
                <div className="flex flex-row gap-2">
                  <select
                    className="border-[1.5px] border-gray-300 text-gray-600 rounded px-2 text-sm outline-none cursor-pointer"
                    value={cardReaderStatus}
                    onChange={(e) => setCardReaderStatus(e.target.value)}
                  >
                    <option value="success">success</option>
                    <option value="fail">fail</option>
                  </select>
                  <select
                    className="border-[1.5px] border-gray-300 text-gray-600 rounded px-2 text-sm outline-none cursor-pointer"
                    value={cardReaderRole}
                    onChange={(e) => setCardReaderRole(e.target.value)}
                  >
                    <option value="member">university member</option>
                    <option value="guest">guest</option>
                  </select>
                  <input
                    type="text"
                    placeholder="User ID"
                    className="border-[1.5px] border-gray-300 rounded px-2 text-sm w-[180px] outline-none focus:border-[#3C8DBC]"
                    value={cardUserId}
                    onChange={(e) => setCardUserId(e.target.value)}
                    disabled={cardReaderRole === "guest"}
                  />
                  <button
                    onClick={handleScanCard}
                    className="bg-[#3C8DBC] hover:bg-[#2e6b8f] text-white font-bold text-sm px-4 py-1.5 rounded"
                  >
                    Scan card
                  </button>
                </div>
                {cardScanResult !== null && (
                  <div className="text-xs text-black/60">Result: {cardScanResult.message || cardScanResult.userId || "Failed"}</div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-black/70">Camera</span>
                <div className="flex flex-row gap-2">
                  <select
                    className="border-[1.5px] border-gray-300 text-gray-600 rounded px-2 text-sm outline-none cursor-pointer"
                    value={cameraMode}
                    onChange={(e) => setCameraMode(e.target.value)}
                  >
                    <option value="correct">correct</option>
                    <option value="wrong">wrong</option>
                    <option value="fail">fail</option>
                    <option value="random">random</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Expected plate"
                    className="border-[1.5px] border-gray-300 rounded px-2 text-sm w-[180px] outline-none focus:border-[#3C8DBC]"
                    value={expectedPlate}
                    onChange={(e) => setExpectedPlate(e.target.value)}
                  />
                  <button
                    onClick={handleScanPlate}
                    className="bg-[#3C8DBC] hover:bg-[#2e6b8f] text-white font-bold text-sm px-4 py-1.5 rounded"
                  >
                    Scan plate
                  </button>
                </div>
                {plateScanResult !== null && (
                  <div className="text-xs text-black/60">Result: {plateScanResult.licensePlate || "Failed"}</div>
                )}
              </div>
              <button
                onClick={handleEntranceSequence}
                disabled={actionLoading === "entrance"}
                className={`${actionLoading === "entrance" ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"} text-white font-bold text-sm px-4 py-2 rounded self-start`}
              >
                {actionLoading === "entrance" ? "Processing..." : "Run entrance sequence"}
              </button>
              {entranceResult && (
                <div className="text-xs text-black/70 mt-1 space-y-0.5 border-t border-gray-200 pt-2">
                  <div><span className="font-semibold">Message:</span> {entranceResult.message || "-"}</div>
                  <div className="flex gap-4">
                    <span><span className="font-semibold">Ticket:</span> {entranceResult.ticketId ?? "-"}</span>
                    <span><span className="font-semibold">Assigned spot:</span> {entranceResult.slotId ?? "-"}</span>
                  </div>
                  <div><span className="font-semibold">Plate:</span> {entranceResult.licensePlate || "-"}</div>
                </div>
              )}
            </div>

            <div className="flex flex-col bg-white drop-shadow-xl/20 border-t-[#3C8DBC] border-t-[4px] rounded-[5px] px-4 py-3 gap-3">
              <span className="text-[#0e4360] text-[22px] font-medium">Arrival and departure</span>
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-black/70">Car arrival</span>
                <div className="flex flex-row gap-2">
                  <input
                    type="text"
                    placeholder="Slot ID"
                    id="arrivalSlotId"
                    className="border-[1.5px] border-gray-300 rounded px-2 text-sm w-[160px] outline-none focus:border-[#3C8DBC]"
                    value={arrivalSlotId}
                    onChange={(e) => setArrivalSlotId(e.target.value)}
                  />
                  <button
                    onClick={handleCarArrival}
                    className="bg-[#3C8DBC] hover:bg-[#2e6b8f] text-white font-bold text-sm px-4 py-1.5 rounded"
                  >
                    Trigger arrival
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-black/70">Car departure</span>
                <div className="flex flex-row gap-2">
                  <input
                    type="text"
                    placeholder="Slot ID"
                    id="departureSlotId"
                    className="border-[1.5px] border-gray-300 rounded px-2 text-sm w-[160px] outline-none focus:border-[#3C8DBC]"
                    value={departureSlotId}
                    onChange={(e) => setDepartureSlotId(e.target.value)}
                  />
                  <button
                    onClick={handleCarDeparture}
                    disabled={actionLoading === "departure"}
                    className={`${actionLoading === "departure" ? "bg-gray-400 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600"} text-white font-bold text-sm px-4 py-1.5 rounded`}
                  >
                    {actionLoading === "departure" ? "Processing..." : "Trigger departure"}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col bg-white drop-shadow-xl/20 border-t-[#3C8DBC] border-t-[4px] rounded-[5px] px-4 py-3 gap-3">
              <span className="text-[#0e4360] text-[22px] font-medium">Sensor failures</span>
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-black/70">Single sensor</span>
                <div className="flex flex-row gap-2">
                  <input
                    type="text"
                    placeholder="Slot ID"
                    className="border-[1.5px] border-gray-300 rounded px-2 text-sm w-[160px] outline-none focus:border-[#3C8DBC]"
                    value={sensorFailId}
                    onChange={(e) => setSensorFailId(e.target.value)}
                  />
                  <button
                    onClick={handleSensorFailure}
                    className="bg-[#9C0000] hover:bg-[#db0909] text-white font-bold text-sm px-4 py-1.5 rounded"
                  >
                    Fail sensor
                  </button>
                  <input
                    type="text"
                    placeholder="Fix slot ID"
                    className="border-[1.5px] border-gray-300 rounded px-2 text-sm w-[160px] outline-none focus:border-[#3C8DBC]"
                    value={sensorFixId}
                    onChange={(e) => setSensorFixId(e.target.value)}
                  />
                  <button
                    onClick={handleSensorFix}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold text-sm px-4 py-1.5 rounded"
                  >
                    Fix sensor
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-black/70">Bulk sensors</span>
                <div className="flex flex-row gap-2">
                  <input
                    type="text"
                    placeholder="IDs (e.g. 1-3, 5)"
                    className="border-[1.5px] border-gray-300 rounded px-2 text-sm w-[220px] outline-none focus:border-[#3C8DBC]"
                    value={sensorFailBulk}
                    onChange={(e) => setSensorFailBulk(e.target.value)}
                  />
                  <button
                    onClick={handleSensorFailureBulk}
                    className="bg-[#9C0000] hover:bg-[#db0909] text-white font-bold text-sm px-4 py-1.5 rounded"
                  >
                    Fail bulk
                  </button>
                  <input
                    type="text"
                    placeholder="IDs to fix"
                    className="border-[1.5px] border-gray-300 rounded px-2 text-sm w-[220px] outline-none focus:border-[#3C8DBC]"
                    value={sensorFixBulk}
                    onChange={(e) => setSensorFixBulk(e.target.value)}
                  />
                  <button
                    onClick={handleSensorFixBulk}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold text-sm px-4 py-1.5 rounded"
                  >
                    Fix bulk
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col bg-white drop-shadow-xl/20 border-t-[#3C8DBC] border-t-[4px] rounded-[5px] px-4 py-3 gap-3">
              <span className="text-[#0e4360] text-[22px] font-medium">Signs</span>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b text-left">
                    <th className="py-2 text-sm text-black/70 font-semibold">Sign</th>
                    <th className="py-2 text-sm text-black/70 font-semibold">Status</th>
                    <th className="py-2 text-sm text-black/70 font-semibold">Direction</th>
                    <th className="py-2 text-sm text-black/70 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {signFailures.map((sign, index) => {
                    const sIndex = sign.signIndex !== undefined ? sign.signIndex : index;
                    const directionData = signDirections.find((d) => d.signIndex === sIndex);
                    const direction = directionData ? directionData.direction : "NONE";

                    return (
                      <tr key={sIndex} className="border-b last:border-0">
                        <td className="py-2 text-sm font-semibold">Sign {sIndex}</td>
                        <td className="py-2 text-sm">
                          {sign.failed ? (
                            <span className="text-[#9C0000] font-bold">FAILED</span>
                          ) : (
                            <span className="text-green-600 font-bold">NORMAL</span>
                          )}
                        </td>
                        <td className={`py-2 text-sm font-bold ${direction !== 'NONE' ? 'text-blue-600' : 'text-gray-400'}`}>
                          {direction}
                        </td>
                        <td className="py-2">
                          <button
                            onClick={() => handleToggleSign(sIndex, sign.failed)}
                            className={`px-3 py-1 rounded text-white text-sm font-bold ${
                              sign.failed ? "bg-green-600 hover:bg-green-700" : "bg-[#9C0000] hover:bg-[#db0909]"
                            }`}
                          >
                            {sign.failed ? "Mark OK" : "Fail sign"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col bg-white drop-shadow-xl/20 border-t-[#3C8DBC] border-t-[4px] rounded-[5px] px-4 py-3 gap-3">
              <span className="text-[#0e4360] text-[22px] font-medium">Exit kiosk resolution</span>
              <div className="flex flex-row gap-2">
                <input
                  type="text"
                  placeholder="Card/User ID (GUEST-X or ID)"
                  className="border-[1.5px] border-gray-300 rounded px-2 text-sm flex-1 outline-none focus:border-[#3C8DBC]"
                  value={exitUserId}
                  onChange={(e) => setExitUserId(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="License plate"
                  className="border-[1.5px] border-gray-300 rounded px-2 text-sm flex-1 outline-none focus:border-[#3C8DBC]"
                  value={exitPlate}
                  onChange={(e) => setExitPlate(e.target.value)}
                />
                <button
                  onClick={handleExit}
                  className="bg-[#9C0000] hover:bg-[#db0909] text-white font-bold text-sm px-4 py-1.5 rounded"
                >
                  Settle & Exit
                </button>
              </div>
              <div className="overflow-y-auto max-h-[220px] mt-2">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="py-2 text-xs text-black/70 text-left px-2">Type</th>
                      <th className="py-2 text-xs text-black/70 text-left px-2">User ID</th>
                      <th className="py-2 text-xs text-black/70 text-left px-2">Plate</th>
                      <th className="py-2 text-xs text-black/70 text-left px-2">Slot</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoadingTickets ? (
                      <tr>
                        <td colSpan="4" className="text-center py-3 text-gray-500 text-sm">Loading...</td>
                      </tr>
                    ) : activeTickets.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center py-3 text-gray-500 text-sm">No active tickets.</td>
                      </tr>
                    ) : (
                      activeTickets.map((ticket, index) => (
                        <tr 
                          key={`${ticket.ticketId}-${index}`}
                          className="cursor-pointer hover:bg-gray-100 transition-colors border-b last:border-0"
                          onClick={() => {
                            setExitUserId(String(ticket.holderIdentifier || ""));
                            setExitPlate(ticket.licensePlate || "");
                          }}
                          title="Click to auto-fill exit form"
                        >
                          <td className="py-2 px-2 text-xs font-semibold">{ticket.ticketType}</td>
                          <td className="py-2 px-2 text-xs">{ticket.holderIdentifier || "-"}</td>
                          <td className="py-2 px-2 text-xs">{ticket.licensePlate || "-"}</td>
                          <td className="py-2 px-2 text-xs">{ticket.parkingSpot || "-"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="flex flex-col bg-white drop-shadow-xl/20 border-t-[#3C8DBC] border-t-[4px] rounded-[5px] px-2 py-2 mt-4">
            <span className="text-[#0e4360] text-[30px] font-medium flex justify-center">
              Real-time slot view
            </span>
            {isLoadingSlots ? (
              <div className="flex flex-col items-center justify-center flex-1 gap-4 py-10">
                <div className="w-12 h-12 border-4 border-[#3C8DBC] border-t-transparent rounded-full animate-spin" />
                <span className="text-gray-500 font-medium">Loading...</span>
              </div>
            ) : (
              <SeatMap slotsData={slotsData} />
            )}
          </div>
        </div>
      </div>

      {toast.visible && (
        <div
          className={`fixed bottom-6 right-6 px-4 py-2 rounded shadow-lg text-white z-50 ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Payment Resolution Modal */}
      {paymentModalData && (
        <div className="fixed inset-0 bg-black/70 z-[1000] flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-[350px] shadow-2xl flex flex-col relative">
            <h3 className="text-xl font-bold text-[#0e4360] border-b pb-2 mb-4">Payment Resolution</h3>
            
            <div className="text-sm space-y-2 text-black/80 mb-6">
                <div className="flex justify-between"><span>User ID:</span> <span className="font-semibold">{paymentModalData.userId}</span></div>
                <div className="flex justify-between"><span>Plate:</span> <span className="font-semibold">{paymentModalData.licensePlate}</span></div>
                <div className="flex justify-between"><span>Entry:</span> <span className="font-semibold">{new Date(paymentModalData.entryTime).toLocaleTimeString()}</span></div>
                <div className="flex justify-between"><span>Ticket Type:</span> <span className="font-semibold">{paymentModalData.ticketType}</span></div>
                <div className="flex justify-between text-lg mt-2 pt-2 border-t font-bold text-[#9C0000]">
                    <span>Amount Due:</span> <span>${paymentModalData.price}</span>
                </div>
            </div>

            {paymentModalData.ticketType === 'GUEST' ? (
                <div className="flex flex-col gap-2">
                    {!qrCodeUrl ? (
                        <>
                            <button onClick={() => processPayment(true)} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded">
                                Pay by Cash
                            </button>
                            <button onClick={generateQR} className="bg-[#222D32] hover:bg-black text-white font-bold py-2 rounded">
                                Pay by QR Code
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col items-center">
                            <img src={qrCodeUrl} alt="QR Code" className="w-[180px] h-[180px] mb-2" />
                            <span className="text-xs text-gray-500 mb-3">Scan to pay ${paymentModalData.price}</span>
                            <button onClick={() => processPayment(false)} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded w-full">
                                I have scanned & paid
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    <button onClick={() => processPayment(true)} className="bg-[#3C8DBC] hover:bg-[#2e6b8f] text-white font-bold py-2 rounded">
                        Process Ticket Payment
                    </button>
                    <span className="text-xs text-green-600 text-center mt-1">Payment will be routed to BKPay</span>
                </div>
            )}

            <button 
                onClick={() => {setPaymentModalData(null); setQrCodeUrl(null);}} 
                className="mt-4 border border-gray-300 text-gray-600 hover:bg-gray-100 font-bold py-1.5 rounded"
            >
                Cancel & Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Simulator;