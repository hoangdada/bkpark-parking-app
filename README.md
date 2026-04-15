# Cách visualize web
- cd vào folder `bk-parking-app` sau đó chạy lệnh `yarn dev` trên terminal, bấm xong sẽ hiện link màu xanh
- ví dụ `http://localhost:5173/login` thì sẽ là page `/login`, ví dụ ae làm page `/operator` thì thay chữ `login` bằng `operator` là được nhé

# CSS
- ta dùng tailwind nhé, nó là css được viết inline thẳng vô element html


# Folder Tree
```
📦 bkpark-parking-app
 ┣ 📂 src
 ┃ ┣ 📂 assets              # Chứa hình ảnh, logo, icon
 ┃ ┣ 📂 hooks               # Chứa custom hook (đặc biệt là hook LocalStorage)
 ┃ ┃ ┗ 📜 useLocalStorage.js 
 ┃ ┣ 📂 database            
 ┃ ┃ ┣ 📜 constants.js      # Định nghĩa tên các key của LocalStorage
 ┃ ┃ ┣ 📜 initData.js       # Toàn bộ dữ liệu hardcode ban đầu nằm ở đây
 ┃ ┃ ┗ 📜 dbSetup.js        # Logic kiểm tra và bơm dữ liệu init vào LocalStorage
 ┃ ┣ 📂 pages               # Chứa các trang - Giao việc cụ thể cho từng người
 ┃ ┃ ┣ 📂 Login             # -> Nguyễn Lê Hải Quân
 ┃ ┃ ┃ ┗ 📜 Login.jsx
 ┃ ┃ ┣ 📂 Member            # -> Khôi Nguyễn Lê
 ┃ ┃ ┃ ┗ 📜 Member.jsx
 ┃ ┃ ┣ 📂 Operator          # -> Lê Tuấn
 ┃ ┃ ┃ ┗ 📜 Operator.jsx
 ┃ ┃ ┣ 📂 Admin             # -> Nguyễn Văn An & Lê Đặng Khánh Quỳnh
 ┃ ┃ ┃ ┗ 📜 Admin.jsx
 ┃ ┃ ┗ 📂 Simulator         # -> Thế Hoàng
 ┃ ┃ ┃ ┗ 📜 Simulator.jsx
 ┃ ┣ 📜 App.jsx             # Nơi cài đặt React Router để chuyển trang
 ┃ ┗ 📜 main.jsx            # Entry point của ứng dụng
 ┣ 📜 package.json
 ┗ 📜 README.md             # Ghi chú hướng dẫn cho team
 ```

# App.jsx
- này là file sẽ gộp các file page của ae lại

# constants.js 
- Khai báo tên các database
- mục đích để cả team import vào dùng:

# initData.js
- Nơi chứa Hardcode dữ liệu 
- File này chỉ chứa cấu trúc JSON tĩnh.

# dbSetup.js
- Hàm khởi tạo Database để lưu vào localStorage của user (ae ko cần quan tâm lắm đâu)
- File này sẽ chạy 1 lần duy nhất khi web load để kiểm tra: Nếu máy người dùng chưa có LocalStorage (mới mở lần đầu), nó sẽ lấy dữ liệu từ initData.js đắp vào. Nếu có rồi thì giữ nguyên để không mất dữ liệu team đang test.

# hooks/useLocalStorage.js
- Bình thường nếu mấy ông xài useState của React, khi F5 (reload trang) là dữ liệu bay sạch.
- Nếu viết bằng localStorage thuần thì lúc dữ liệu thay đổi, React nó không biết để vẽ lại (render) giao diện.
- Cái Hook useLocalStorage này kết hợp cả hai: Nó vừa giữ dữ liệu không mất khi F5, vừa thông báo cho React biết để cập nhật màn hình ngay khi có thay đổi

Ví dụ Lê Tuấn (làm trang /operator) muốn lấy TICKET_DB ra:
```
// Bên trong file Operator.jsx của Lê Tuấn
import { useLocalStorage } from '../hooks/useLocalStorage';
import { DB_KEYS } from '../database/constants'; // Import key bạn đã định nghĩa

function OperatorPage() {
  // 1. Gọi Hook: Lấy dữ liệu và hàm cập nhật
  // Nó y chang useState, chỉ khác là gọi 'useLocalStorage' và truyền vào DB_KEYS
  const [tickets, setTickets] = useLocalStorage(DB_KEYS.TICKET_DB, []);

  // 2. Thao tác dữ liệu: Ví dụ thêm 1 vé mới
  const addTicket = () => {
    const newTicket = { id: 1, car: '51F-123.45', timeIn: '08:00' };
    
    // Khi gọi setTickets, dữ liệu tự động lưu thẳng vào Database LocalStorage
    setTickets([...tickets, newTicket]); 
  };

  return (
    <div>
      <h1>Có {tickets.length} vé</h1>
      <button onClick={addTicket}>Thêm vé mới</button>
    </div>
  );
}
```
