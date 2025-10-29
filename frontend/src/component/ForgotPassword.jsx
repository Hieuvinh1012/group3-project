import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

const API_BASE = 'http://localhost:3001';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/advanced/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'Hướng dẫn đặt lại mật khẩu đã được gửi đến email của bạn' });
        setEmail('');
      } else {
        setMessage({ type: 'error', text: data.message || 'Có lỗi xảy ra' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Không thể gửi yêu cầu đặt lại mật khẩu' });
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="form-container">
        <h2 style={{ textAlign: 'center' }}>Quên Mật Khẩu</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Nhập email của bạn"
            />
          </div>
          <div className="form-actions" style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: '20px' }}>
            <button type="submit" className="btn primary" style={{ padding: '10px 18px', borderRadius: 6 }}>
              Gửi yêu cầu
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
                color: message.type === 'success' ? '#4caf50' : '#f44336'
              }}
            >
              {message.text}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;