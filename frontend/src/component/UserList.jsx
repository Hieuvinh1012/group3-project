import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/UserList.css';
import UserDetail from './UserDetail';

const UserList = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '' });
  const [editingUser, setEditingUser] = useState(null);

  // fetchUsers declared before useEffect to avoid missing-deps warnings
  const fetchUsers = async (tk) => {
    try {
      const useToken = tk || token || localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/users', {
        headers: {
          Authorization: `Bearer ${useToken}`,
        },
      });
      setUsers(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching users');
    }
  };

  useEffect(() => {
    const tk = token || localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    if (!tk || userRole !== 'admin') {
      setError('Bạn không có quyền truy cập trang này');
      setIsAdmin(false);
      return;
    }

    setIsAdmin(true);
    fetchUsers(tk);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const tk = token || localStorage.getItem('token');
      await axios.post('http://localhost:3001/users', newUser, {
        headers: { Authorization: `Bearer ${tk}` },
      });
      // refresh from server to get proper created user (and id)
      await fetchUsers(tk);
      setNewUser({ name: '', email: '', password: '' }); // Reset form
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding user');
    }
  };

  const startEdit = (user) => {
    setEditingUser({ ...user, password: '' });
  };

  const cancelEdit = () => {
    setEditingUser(null);
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      const tk = token || localStorage.getItem('token');
      const payload = { name: editingUser.name, email: editingUser.email };
      if (editingUser.password) payload.password = editingUser.password;
      await axios.put(`http://localhost:3001/users/${editingUser._id}`, payload, {
        headers: { Authorization: `Bearer ${tk}` },
      });
      await fetchUsers(tk);
      setEditingUser(null);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể cập nhật user');
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa user này?')) {
      try {
        const tk = token || localStorage.getItem('token');
        await axios.delete(`http://localhost:3001/users/${userId}`, {
          headers: { Authorization: `Bearer ${tk}` }
        });

        // Refresh list
        fetchUsers(tk);
      } catch (err) {
        setError(err.response?.data?.message || 'Không thể xóa user');
      }
    }
  };

  if (!isAdmin) {
    return <div className="error-message">Bạn không có quyền truy cập trang này.</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="user-list-container">
      <h2>Quản Lý Users</h2>

      <div className="user-columns">
        <div className="left-column">
          <div className="add-user-form">
            <h3>Thêm User Mới</h3>
            <form onSubmit={handleAddUser}>
              <div className="form-group">
                <label>Tên:</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Mật khẩu:</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="btn-add">Thêm User</button>
            </form>
          </div>
        </div>

        <div className="right-column">
          {error && <div className="error-message">{error}</div>}

          <h3>Danh Sách Users</h3>
          {users.length === 0 ? (
            <p>Chưa có user nào.</p>
          ) : (
            <ul className="user-list">
              {users.map((user) => (
                <li key={user._id} className="user-item">
                  {editingUser && editingUser._id === user._id ? (
                    <form className="edit-user-form" onSubmit={saveEdit}>
                      <div className="form-row">
                        <input
                          type="text"
                          value={editingUser.name}
                          onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                          required
                        />
                        <input
                          type="email"
                          value={editingUser.email}
                          onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                          required
                        />
                        <input
                          type="password"
                          placeholder="Mật khẩu mới (tùy chọn)"
                          value={editingUser.password || ''}
                          onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                        />
                      </div>
                      <div className="form-actions">
                        <button type="submit" className="btn-primary">Lưu</button>
                        <button type="button" className="btn-cancel" onClick={cancelEdit}>Hủy</button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="user-info" onClick={() => setSelectedUser(user)} style={{cursor: 'pointer'}}>
                        <span className="user-name">{user.name}</span>
                        <span className="user-email">{user.email}</span>
                      </div>
                      <div className="user-actions">
                        <button className="btn-edit" onClick={() => startEdit(user)}>Sửa</button>
                        <button className="btn-delete" onClick={() => handleDelete(user._id)}>Xóa</button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {selectedUser && (
        <UserDetail user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
    </div>
  );
};

export default UserList;