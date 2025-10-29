import React, { useState, useEffect } from 'react';
import '../styles/Auth.css'; // Reuse Auth styles for form layout

const AddUser = ({ onAdd, editingUser, onUpdate, onCancelEdit }) => {
  // State để quản lý dữ liệu trong các ô input
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // PHẦN QUAN TRỌNG NHẤT:
  // "Lắng nghe" sự thay đổi của prop `editingUser`.
  // Khi bạn nhấn nút "Sửa", `editingUser` sẽ có giá trị và code bên trong sẽ chạy.
  useEffect(() => {
    if (editingUser) {
      // Nếu có user đang được sửa, điền thông tin của họ vào form
      setName(editingUser.name);
      setEmail(editingUser.email);
    } else {
      // Nếu không, xóa trắng form (khi thêm mới hoặc hủy sửa)
      setName('');
      setEmail('');
    }
  }, [editingUser]); // Mảng phụ thuộc, chỉ chạy lại khi `editingUser` thay đổi

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email) {
      alert("Vui lòng nhập đủ tên và email!");
      return;
    }

    // Kiểm tra xem đang ở chế độ "Sửa" hay "Thêm mới"
    if (editingUser) {
      // Nếu có `editingUser` -> gọi hàm onUpdate từ App.js
      // If onUpdate returns a promise, await it so parent can finish and then form will
      // be reset when editingUser becomes null (handled by useEffect).
      const res = onUpdate({ ...editingUser, name, email });
      // If parent returned a promise, handle rejection to show error
      if (res && typeof res.then === 'function') {
        res.catch(err => console.error('Update failed:', err));
      }
    } else {
      // Nếu không -> gọi hàm onAdd từ App.js
      const res = onAdd({ name, email });
      // Nếu onAdd trả về Promise thì chờ nó resolve rồi reset form
      if (res && typeof res.then === 'function') {
        res.then(() => {
          setName('');
          setEmail('');
        }).catch(err => {
          console.error('Add failed:', err);
        });
      } else {
        // Nếu onAdd là sync, ngay lập tức reset
        setName('');
        setEmail('');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      {/* Tiêu đề form sẽ tự động thay đổi */}
      <h2>{editingUser ? 'Chỉnh Sửa User' : 'Thêm User Mới'}</h2>

      <div className="form-group">
        <label>Tên</label>
        <input
          type="text"
          placeholder="Nhập tên user"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          placeholder="Nhập email user"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      
      <div className="form-actions"> {/* <-- Đảm bảo có class này */}
        <button type="submit">
          {editingUser ? 'Cập Nhật' : 'Thêm Mới'}
        </button>
        {editingUser && (
          <button type="button" onClick={onCancelEdit} className="btn-cancel">
            Hủy
          </button>
        )}
      </div>
    </form>
  );
};

export default AddUser;