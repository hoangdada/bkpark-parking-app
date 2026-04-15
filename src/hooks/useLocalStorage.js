import { useState, useEffect } from 'react';

// 1. Khai báo Hook nhận vào 2 tham số: 'key' (tên database) và 'initialValue' (dữ liệu mặc định nếu db trống)
export function useLocalStorage(key, initialValue) {
  
  // 2. Khởi tạo State (Giống như bộ nhớ tạm của React)
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Thử tìm dữ liệu cũ trong LocalStorage theo 'key' (ví dụ tìm key 'TICKET_DB')
      const item = window.localStorage.getItem(key);
      
      // Nếu có thì chuyển từ dạng chuỗi (String) về dạng Object/Array (JSON) để React hiểu
      // Nếu không có thì lấy giá trị mặc định 'initialValue' (thường là mảng rỗng [])
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Nếu lỗi (ví dụ file JSON bị hỏng), thì an toàn nhất là trả về giá trị mặc định
      console.error(error);
      return initialValue;
    }
  });

  // 3. Hàm dùng để Lưu dữ liệu mới (Vừa cập nhật State, vừa ghi đè vào LocalStorage)
  const setValue = (value) => {
    try {
      // Giống useState thông thường: kiểm tra xem 'value' là một function hay một giá trị trực tiếp
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Cập nhật State để giao diện React render lại ngay lập tức
      setStoredValue(valueToStore);
      
      // Chuyển dữ liệu về dạng chuỗi (String) và Lưu vĩnh viễn vào LocalStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  // 4. (Tùy chọn nhưng rất mạnh) Lắng nghe sự thay đổi từ các Tab khác (Nếu ai đó mở 2 tab)
  useEffect(() => {
    const handleStorageChange = (e) => {
      // Nếu key bị thay đổi ở tab khác, lập tức cập nhật lại State ở tab hiện tại
      if (e.key === key && e.newValue) {
        setStoredValue(JSON.parse(e.newValue));
      }
    };
    // Lắng nghe sự kiện 'storage' của trình duyệt
    window.addEventListener('storage', handleStorageChange);
    
    // Dọn dẹp sự kiện khi component bị hủy để tránh rò rỉ bộ nhớ
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  // 5. Trả về cho các thành viên sử dụng 2 thứ: Dữ liệu hiện tại, và Hàm để đổi dữ liệu
  return [storedValue, setValue];
}