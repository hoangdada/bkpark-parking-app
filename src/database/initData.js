// Hàm helper để tạo 80 slots (4 Zone x 20) tự động và gán một số slot có sẵn xe để test UI
const generateSlots = () => {
  const zones = [
    { prefix: 'A', priority: 'staff' },
    { prefix: 'B', priority: 'faculty' },
    { prefix: 'C', priority: 'student' },
    { prefix: 'D', priority: 'visitor' }
  ];
  
  let slots = [];
  zones.forEach(zone => {
    for (let i = 1; i <= 20; i++) {
      const slotId = `${zone.prefix}${i.toString().padStart(2, '0')}`;
      let status = 'AVAILABLE';
      let current_plate = null;

      // Hardcode một số slot để khớp với UI Operator và Member
      if (slotId === 'C15') {
        status = 'OCCUPIED';
        current_plate = '59A-12345'; // Xe của Nguyễn Văn A đang đỗ
      } else if (slotId === 'B15') {
        status = 'OCCUPIED';
        current_plate = '59B-67890'; // Mismatch alert test
      } else if (['D19', 'D20'].includes(slotId)) {
        status = 'UNKNOWN'; // Giả lập lỗi sensor hiển thị màu xám trên map
      } else if (i <= 10) { 
        status = 'OCCUPIED'; // Làm đầy bãi xe ngẫu nhiên để giống ảnh UI
      }

      slots.push({
        slot_id: slotId,
        status: status, // AVAILABLE, OCCUPIED, UNKNOWN, MAINTENANCE
        priority_role: zone.priority,
        current_plate: current_plate
      });
    }
  });
  return slots;
};

export const initialData = {
  // 1. Quản lý tài khoản (Nguyễn Lê Hải Quân dùng cho /login)
  ACCOUNT_DB: [
    { username: 'member', password: '123', role: 'member' }, // Map với INFO_DB của sinh viên
    { username: 'operator', password: '123', role: 'operator' },
    { username: 'admin', password: '123', role: 'admin' },
    { username: '2453471', password: '123', role: 'member' } // Login bằng MSSV
  ],

  // 2. Bảng giá vé (Nguyễn Văn An & Quỳnh dùng cho /admin)
  PRIORITY_PRICE_DB: [
    { role: 'student', hourly_rate: 5000, name: 'Students / Learners' },
    { role: 'faculty', hourly_rate: 4000, name: 'Faculty Members' },
    { role: 'staff', hourly_rate: 3000, name: 'Staff' },
    { role: 'visitor', hourly_rate: 7000, name: 'Temporary Visitors' }
  ],

  // 3. Thông tin người dùng (Khôi Nguyễn Lê dùng cho /member)
  INFO_DB: [
    {
      username: 'member', // Reference tới ACCOUNT_DB
      user_id: '2152500', // Dùng làm mã nội bộ / MSSV
      full_name: 'Nguyễn Văn A',
      role: 'student',
      plates: ['59A-12345', '59B-99999'],
    },
    {
      username: 'admin',
      user_id: 'ADMIN001',
      full_name: 'Trần Admin',
      role: 'staff',
      plates: ['51H-12345'],
    }
  ],

  // 4. Ma trận Slot bãi đỗ (Lê Tuấn dùng cho map /operator, Hoàng dùng simulate)
  SLOT_MATRIX_DB: generateSlots(),

  // 5. Lịch sử vé ra vào (Trung tâm liên kết mọi data)
  TICKET_DB: [
    // Vé đang active (Xe đang đỗ) - Khớp với thẻ xanh lá trên UI Member
    {
      ticket_id: 'TKT20260413001',
      user_id: '2152500',
      license_plate: '59A-12345',
      slot_id: 'C15',
      time_in: '2026-04-13T07:30:00',
      time_out: null,
      status: 'PARKING',
      snapshot_price: 5000 // Giá tại thời điểm vào
    },
    // Các vé đã hoàn thành (Lịch sử đỗ xe UI Member & Operator)
    {
      ticket_id: 'TKT20260412045',
      user_id: '2152500',
      license_plate: '59A-12345',
      slot_id: 'C12', 
      time_in: '2026-04-12T08:15:00',
      time_out: '2026-04-12T17:30:00',
      status: 'COMPLETED',
      snapshot_price: 5000
    },
    {
      ticket_id: 'TKT20260411032',
      user_id: '2152500',
      license_plate: '59A-12345',
      slot_id: 'C18',
      time_in: '2026-04-11T07:45:00',
      time_out: '2026-04-11T16:20:00',
      status: 'COMPLETED',
      snapshot_price: 5000
    },
    // Vé của Visitor cho UI Operator
    {
      ticket_id: 'TKT-VISITOR-789456',
      user_id: 'VISITOR',
      license_plate: '51B-67890',
      slot_id: 'D05',
      time_in: '2026-04-14T10:15:33',
      time_out: '2026-04-14T12:20:18',
      status: 'COMPLETED',
      snapshot_price: 7000
    }
  ],

  // 6. Lịch sử thanh toán (Cho UI Member)
  PAYMENT_DB: [
    {
      payment_id: 'PAY-202603-001',
      username: 'member',
      ticket_ids: ['TKT20260412045', 'TKT20260411032'], // Gom nhóm thanh toán
      amount: 25000,
      payment_date: '2026-04-05T10:00:00', // Đã quá hạn (Overdue như UI tháng 3)
      status: 'OVERDUE' 
    },
    {
      payment_id: 'PAY-202602-001',
      username: 'member',
      ticket_ids: [],
      amount: 15000,
      payment_date: '2026-03-05T09:00:00',
      status: 'PAID' // UI Payment History
    },
    {
      payment_id: 'PAY-202601-001',
      username: 'member',
      ticket_ids: [],
      amount: 20000,
      payment_date: '2026-02-03T14:20:00',
      status: 'PAID'
    }
  ],

  // 7. Cảnh báo sự cố (Cho UI Operator & Simulator)
  ALERT_DB: [
    {
      alert_id: 'ALT-001',
      slot_id: null,
      type: 'SECURITY_BREACH',
      message: 'Duplicate active session detected: User ID 2152501 attempted entry with existing active ticket.',
      priority: 'HIGH',
      timestamp: '2026-04-13T09:15:23',
      status: 'ACTIVE' // ACTIVE hoặc ACKNOWLEDGED
    },
    {
      alert_id: 'ALT-002',
      slot_id: 'B15',
      type: 'SECURITY_BREACH',
      message: 'License plate mismatch at exit: Expected 59B-67890, detected 59B-12345.',
      priority: 'HIGH',
      timestamp: '2026-04-13T08:45:11',
      status: 'ACTIVE'
    },
    {
      alert_id: 'ALT-003',
      slot_id: null,
      type: 'SYSTEM_FAILURE',
      message: 'Camera offline at Gate 2 - manual override required.',
      priority: 'MEDIUM',
      timestamp: '2026-04-13T08:30:05',
      status: 'ACTIVE'
    }
  ]
};