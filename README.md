# 📦 BKPark - Smart Parking System (Dự án Mô phỏng)

Dự án này là hệ thống quản lý bãi xe thông minh được xây dựng bằng **ReactJS (Vite)** và **Tailwind CSS**. 

---

## 🚀 1. Quan Trọng: Kiến Trúc Dự Án (Đọc kỹ trước khi Code)
Dự án này **KHÔNG CÓ BACKEND**. Toàn bộ dữ liệu (Database) được lưu trữ và cập nhật trực tiếp tại **LocalStorage** của trình duyệt.

- **Cơ chế:** Khi bạn thay đổi dữ liệu (ví dụ: thêm vé, đổi giá), dữ liệu sẽ lưu vào máy bạn. Khi F5 trang web, dữ liệu vẫn còn đó.
- **Đồng bộ Real-time:** Dự án sử dụng một Custom Hook tên là `useLocalStorage`. Khi một Page cập nhật dữ liệu (ví dụ: Simulator tạo xe mới), các Page khác (như Operator) sẽ tự động nhận được dữ liệu mới mà không cần load lại trang.

---

## ⚙️ 2. Hướng dẫn Cài đặt & Chạy Web

Nếu bạn mới tải code về lần đầu, hãy thực hiện các bước sau tại Terminal (Command Prompt):

1. **Cài đặt thư viện (Chỉ làm lần đầu):**
   ```bash
   yarn install
   ```
2. **cd vào folder `bk-parking-app`**
3. **Chạy ứng dụng:**
   ```bash
   yarn dev
   ```
4. **Bấm vào link màu xanh biển**ví dụ `http://localhost:5173/login` thì sẽ là page `/login`, ví dụ ae làm page `/operator` thì thay chữ `login` bằng `operator` là được nhé (`http://localhost:5173/operator`)

---

## 📂 3. Phân Công & Cấu Trúc Thư Mục
Mỗi thành viên làm việc trong thư mục `src/pages/` tương ứng của mình. Vui lòng **KHÔNG** sửa code trong folder của người khác nếu chưa bàn nhé

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
---

## 💾 4. Cách Sử Dụng Database (LocalStorage)
Team **KHÔNG** dùng `useState` bình thường để lưu dữ liệu dùng chung (như vé xe, bảng giá...). Hãy dùng custom hook `useLocalStorage`.

### Bước 1: Import
```javascript
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { DB_KEYS } from '../../database/constants';
```

### Bước 2: Sử dụng
Ví dụ An & Quỳnh (làm trang /admin) muốn lấy bảng giá ra để sửa:
```javascript
// 1. Lấy dữ liệu và hàm cập nhật (giống hệt useState)
const [prices, setPrices] = useLocalStorage(DB_KEYS.PRIORITY_PRICE_DB, []);

// 2. Khi muốn cập nhật giá mới:
const updatePrice = (newRate) => {
   const updated = prices.map(p => 
      p.role === 'student' ? { ...p, hourly_rate: newRate } : p
   );
   
   // Khi gọi setPrices, dữ liệu TỰ ĐỘNG lưu vào LocalStorage và cập nhật lên các màn hình khác
   setPrices(updated); 
};
```
---

## 🌿 5. Quy trình làm việc với Git (Dành cho Team)
Để tránh bị mất code hoặc đè code của nhau (Conflict), mọi người TUYỆT ĐỐI KHÔNG code trực tiếp trên nhánh `main`. Hãy làm theo các bước sau:

1. **Lấy code mới nhất về máy (Trước khi bắt đầu code):**
   ```bash
   git checkout main
   git pull origin main
   ```
2. **Tạo nhánh riêng của mình (Chỉ làm 1 lần đầu cho mỗi tính năng):**
   ```bash
   git checkout -b feature/ten-cua-ban
   ```
3. **Lưu code (Sau khi làm xong 1 phần việc):**
   ```bash
   git add .
   git commit -m "Mô tả ngắn gọn bạn đã làm gì (VD: Hoàn thành UI nút bấm Login)"
   ```
4. **Đẩy code lên Github:**
   ```bash
   git push origin feature/ten-cua-ban
   ```

---

## 🤖 6. Hướng dẫn hỏi AI (ChatGPT/Gemini) để Code đúng chuẩn
Vì dự án của chúng ta **không dùng Backend**, nếu bạn hỏi AI bình thường nó sẽ viết code gọi API (`fetch`/`axios`) gây lỗi hệ thống.

Nếu bạn bí, hãy **COPY NGUYÊN ĐOẠN "THẦN CHÚ" DƯỚI ĐÂY** dán vào AI trước khi hỏi yêu cầu chính:

> "Tôi đang làm một trang web ReactJS (Vite) + Tailwind CSS. Dự án này **hoàn toàn không có backend**, toàn bộ database được lưu ở **LocalStorage** của trình duyệt. Tôi có một custom hook là `useLocalStorage(key, initialValue)` để đọc và ghi dữ liệu, hook này hoạt động hệt như useState nhưng sẽ tự lưu vào storage. 
> 
> Cấu trúc Database `TICKET_DB` của tôi gồm: { ticket_id, user_id, license_plate, slot_id, time_in, time_out, status, snapshot_price }.
> 
> Hãy giúp tôi code: [Viết yêu cầu của bạn vào đây - Ví dụ: giao diện hiển thị danh sách vé đang đỗ bằng Tailwind và lấy dữ liệu bằng useLocalStorage]."

---

## ⚠️ 7. Lưu ý chung
- **Dữ liệu mẫu ban đầu:** Toàn bộ nằm trong `src/database/initData.js`. Nếu bạn muốn thêm dữ liệu ban đầu cho bãi xe để test giao diện, hãy nhờ Thế Hoàng sửa file đó.
- **CSS:** Chúng ta dùng **Tailwind CSS**. Không viết file `.css` rời, hãy viết class trực tiếp vào thẻ HTML (VD: `<div className="bg-blue-500 p-4 rounded-lg">`).
