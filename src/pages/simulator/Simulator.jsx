// Ví dụ: Khi giả lập 1 xe chạy vào bãi thành công
const simulateEntry = (newTicket) => {
  // 1. Lấy data hiện tại
  const tickets = JSON.parse(localStorage.getItem('TICKET_DB'));
  const slots = JSON.parse(localStorage.getItem('SLOT_MATRIX_DB'));

  // 2. Thay đổi data
  tickets.push(newTicket);
  const slotIndex = slots.findIndex(s => s.slot_id === newTicket.slot_id);
  slots[slotIndex].status = 'OCCUPIED';
  slots[slotIndex].current_plate = newTicket.license_plate;

  // 3. Lưu lại
  localStorage.setItem('TICKET_DB', JSON.stringify(tickets));
  localStorage.setItem('SLOT_MATRIX_DB', JSON.stringify(slots));

  // 4. PHÁT SỰ KIỆN để custom hook useLocalStorage nhận biết
  window.dispatchEvent(new Event('storage')); 
};

export default function Simulator() {
  return (
    <div className="flex h-screen justify-center items-center text-pink-600 font-bold">
      phần này của sếp Thế Hoàng nhóe 🩷🐧
    </div>
  )
}