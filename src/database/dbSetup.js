import { DB_KEYS } from './constants';
import { initialData } from './initData';

export const initializeDatabases = () => {
  Object.values(DB_KEYS).forEach(key => {
    // Chỉ khởi tạo nếu LocalStorage chưa có dữ liệu này
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, JSON.stringify(initialData[key] || []));
    }
  });
};