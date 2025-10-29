import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();

  const API_BASE = 'http://localhost:3001';
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Mật khẩu không khớp');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/advanced/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword: password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage('Đặt lại mật khẩu thành công');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(data.message || 'Có lỗi xảy ra');
      }
    } catch (err) {
      setError('Không thể đặt lại mật khẩu');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="form-container">
        <h2 style={{ textAlign: 'center' }}>Đặt Lại Mật Khẩu</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Mật khẩu mới</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
              placeholder="Nhập mật khẩu mới"
            />
          </div>
          <div className="form-group">
            <label>Xác nhận mật khẩu</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength="6"
              placeholder="Nhập lại mật khẩu mới"
            />
          </div>
          <div className="form-actions" style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: '20px' }}>
            <button type="submit" className="btn primary" style={{ padding: '10px 18px', borderRadius: 6 }}>
              Xác nhận
            </button>
            <button 
              onClick={() => navigate('/login')} 
              className="btn primary" 
              style={{ padding: '10px 18px', borderRadius: 6 }}
              type="button"
            >
              Quay lại đăng nhập
            </button>
          </div>
          {message && (
            <p 
              style={{ 
                textAlign: 'center', 
                marginTop: '10px',
                color: '#4caf50'
              }}
            >
              {message}
            </p>
          )}
          {error && (
            <p 
              style={{ 
                textAlign: 'center', 
                marginTop: '10px',
                color: '#f44336'
              }}
            >
              {error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;