import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserList from './component/UserList';
import './styles/App.css';
import './styles/buttons.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './component/Auth';
import Profile from './component/Profile';
import ForgotPassword from './component/ForgotPassword';
import ResetPassword from './component/ResetPassword';
import { Link } from 'react-router-dom';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || null);

  const decodeToken = (t) => {
    try {
      const payload = t.split('.')[1];
      // atob available in browser; for Node it would be Buffer
      return JSON.parse(atob(payload));
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    const fetchProfile = async (roleFromToken) => {
      try {
        const res = await axios.get('http://localhost:3001/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        // profile returns name and email
        setCurrentUser({ ...res.data, role: roleFromToken });
      } catch (err) {
        console.error('Không thể lấy profile:', err?.response?.data || err.message);
        // token invalid or expired -> force logout
        handleLogout();
      }
    };

    if (token) {
      localStorage.setItem('token', token);
      const decoded = decodeToken(token);
      const role = decoded?.role || null;
      if (role) {
        localStorage.setItem('userRole', role);
        setUserRole(role);
      }
      fetchProfile(role);
    } else {
      handleLogout();
    }
  }, [token]);

  const handleLogout = () => {
    setToken(null);
    setCurrentUser(null);
    setUserRole(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
  };



  const isAdmin = userRole === 'admin';

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Quản Lý User</h1>
          
          {token && (
            <div className="header-top">
              <div className="nav-row">
                <Link to="/" className="btn-link">Home</Link>
                <Link to="/profile" className="btn-link">Profile</Link>
                {isAdmin && (
                  <Link to="/admin/users" className="btn-link">Quản lý Users</Link>
                )}
                <button onClick={handleLogout} className="btn-delete">Đăng Xuất</button>
              </div>

              <div className="login-row">
                Đang đăng nhập: {currentUser ? currentUser.name : '...'}
              </div>
            </div>
          )}

          <Routes>
            {!token ? (
              <>
                <Route path="/login" element={<Auth onAuth={setToken} />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="*" element={<Auth onAuth={setToken} />} />
              </>
            ) : (
              <>
                <Route path="/" element={
                  <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    Chào mừng đến với hệ thống quản lý user
                  </div>
                } />
                <Route path="/profile" element={<Profile token={token} currentUser={currentUser} />} />
                {isAdmin && <Route path="/admin/users" element={<UserList token={token} />} />}
                <Route path="*" element={
                  <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    Trang không tồn tại
                  </div>
                } />
              </>
            )}
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;