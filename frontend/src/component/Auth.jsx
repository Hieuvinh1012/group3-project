// src/component/Auth.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Auth.css';

const API_BASE = 'http://localhost:3001';

const Auth = ({ onAuth }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      if (isLogin) {
        // Gọi API đăng nhập (/auth/login)
        const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
        const { token } = res.data;
        if (token) {
          localStorage.setItem('token', token);
          if (onAuth) onAuth(token);
        } else {
          setMessage('Không nhận được token từ server');
        }
      } else {
        // Đăng ký: gọi /auth/signup
        if (!name || !email || !password) {
          setMessage('Vui lòng nhập tên, email và mật khẩu!');
          return;
        }
        await axios.post(`${API_BASE}/auth/signup`, { name, email, password });
        setMessage('Đăng ký thành công! Vui lòng đăng nhập.');
        setIsLogin(true);
        setName('');
        setEmail('');
        setPassword('');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Lỗi xảy ra');
    }
  };


  
  return (
    <div className="auth-wrapper">
      <div className="form-container">
        <h2 style={{ textAlign: 'center' }}>{isLogin ? 'Đăng Nhập' : 'Đăng Ký'}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label>Tên</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
          )}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className={isLogin ? '' : 'btn-register'}>
              {isLogin ? 'Đăng Nhập' : 'Đăng Ký'}
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="btn-cancel"
            >
              Chuyển sang {isLogin ? 'Đăng Ký' : 'Đăng Nhập'}
            </button>
          </div>
          {isLogin && (
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
              <Link to="/forgot-password" style={{ color: '#0066cc', textDecoration: 'none' }}>
                Quên mật khẩu?
              </Link>
            </div>
          )}
          {message && <p style={{ textAlign: 'center', marginTop: '10px' }}>{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default Auth;