import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Import đúng cách
import '../styles/Profile.css';

const API_BASE = 'http://localhost:3001';

const Profile = ({ token, currentUser }) => {
  const [user, setUser] = useState(currentUser || null);
  const [message, setMessage] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');

  // Trích xuất userId từ currentUser hoặc token với kiểm tra hợp lệ
  let userId = currentUser?.id;
  if (!userId && token) {
    try {
      const tokenParts = token.split(' ');
      const tokenValue = tokenParts.length > 1 ? tokenParts[1] : token; // Lấy token từ Bearer hoặc toàn bộ
      console.log('Token value for decode:', tokenValue); // Debug token
      const decoded = jwtDecode(tokenValue);
      userId = decoded?.id;
    } catch (error) {
      console.error('Token decoding error:', error.message);
      setMessage('Token không hợp lệ');
    }
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!userId) {
          setMessage('Không thể xác định user ID');
          return;
        }

        const response = await axios.get(`${API_BASE}/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Profile data:', response.data);
        const storedAvatar = localStorage.getItem(`userAvatar_${userId}`); // Lấy avatar theo userId
        setUser(prevUser => ({
          ...prevUser,
          name: response.data.name || prevUser?.name,
          email: response.data.email || prevUser?.email,
          avatar: storedAvatar || prevUser?.avatar || '' // Nếu chưa có avatar, để trống
        }));
        setAvatarPreview('');
      } catch (error) {
        console.error('Error fetching profile:', error.response?.status, error.message);
        setMessage('Lỗi tải thông tin: ' + (error.response?.data?.message || error.message));
      }
    };
    if (token && userId) fetchProfile();
  }, [token, userId]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!userId) {
      setMessage('Không thể xác định user ID');
      return;
    }

    try {
      let updatedAvatar = user?.avatar || '';

      if (avatar) {
        const formData = new FormData();
        formData.append('avatar', avatar);
        const uploadResponse = await axios.post(`${API_BASE}/advanced/upload-avatar`, formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
        console.log('Upload response:', uploadResponse.data);
        if (uploadResponse.data && uploadResponse.data.avatar) {
          updatedAvatar = uploadResponse.data.avatar;
          setUser(prevUser => ({
            ...prevUser,
            avatar: updatedAvatar
          }));
          localStorage.setItem(`userAvatar_${userId}`, updatedAvatar); // Lưu avatar riêng cho user
        } else {
          throw new Error('No avatar URL returned from upload');
        }
      }

      const payload = { name: user.name, email: user.email, avatar: updatedAvatar };
      if (newPassword) payload.password = newPassword;

      const putResponse = await axios.put(`${API_BASE}/profile`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('PUT /profile response:', putResponse.data);

      const response = await axios.get(`${API_BASE}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const storedAvatar = localStorage.getItem(`userAvatar_${userId}`) || '';
      setUser(prevUser => ({
        ...prevUser,
        name: response.data.name || prevUser.name,
        email: response.data.email || prevUser.email,
        avatar: storedAvatar
      }));

      setMessage('Cập nhật thông tin thành công');
      setNewPassword('');
      setAvatar(null);
      setAvatarPreview('');
    } catch (error) {
      console.error('Error updating profile:', error.response?.status, error.response?.data || error.message);
      setMessage('Lỗi cập nhật thông tin: ' + (error.response?.data?.message || error.message));
    }
  };

  if (!token) return <p className="profile-message">Vui lòng đăng nhập</p>;

  return (
    <div className="profile-wrapper" style={{ display: 'flex', justifyContent: 'center' }}>
      <div className="profile-box" style={{ width: 420, padding: 24, borderRadius: 8, boxShadow: '0 6px 18px rgba(0,0,0,0.08)', background: '#fff' }}>
        <h2 className="profile-title" style={{ textAlign: 'center', marginBottom: 10 }}>Thông Tin Cá Nhân</h2>
        {!user ? (
          <p className="profile-message">Đang tải...</p>
        ) : (
          <>
            <div className="avatar-section" style={{ marginBottom: 20, textAlign: 'center' }}>
              <div style={{ marginBottom: 10 }}>
                {avatarPreview || user.avatar ? (
                  <img
                    src={avatarPreview || user.avatar}
                    alt="Avatar"
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid #ddd'
                    }}
                    onError={(e) => console.log('Image load error:', e.target.src, e)}
                  />
                ) : (
                  <div style={{
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    backgroundColor: '#f0f0f0',
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{ fontSize: 40, color: '#666' }}>
                      {user.name ? user.name[0].toUpperCase() : '?'}
                    </span>
                  </div>
                )}
              </div>
              <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: 'none' }}
              />
              <label
                htmlFor="avatar-upload"
                style={{
                  display: 'inline-block',
                  padding: '8px 16px',
                  backgroundColor: '#f0f0f0',
                  borderRadius: 4,
                  cursor: 'pointer',
                  marginTop: 10
                }}
              >
                Chọn ảnh đại diện
              </label>
            </div>
            
            <form onSubmit={handleUpdate} className="profile-form">
              <div className="input-group" style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', marginBottom: 6 }}>Tên</label>
                <input
                  type="text"
                  value={(user && user.name) || ''}
                  onChange={(e) => {
                    setUser(prev => ({ ...prev, name: e.target.value }));
                    setMessage('');
                  }}
                  className="profile-input"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #ddd' }}
                />
              </div>
              <div className="input-group" style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', marginBottom: 6 }}>Email</label>
                <input
                  type="email"
                  value={(user && user.email) || ''}
                  readOnly
                  className="profile-input"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #ddd', background: '#f3f4f6', cursor: 'not-allowed' }}
                />
              </div>
              <div className="input-group" style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', marginBottom: 6 }}>Mật khẩu mới (tùy chọn)</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Để trống nếu không đổi"
                  className="profile-input"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #ddd' }}
                />
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between', alignItems: 'center' }}>
                <button type="submit" className="btn primary" style={{ padding: '10px 18px', borderRadius: 6 }}>
                  Cập Nhật
                </button>
              </div>
              {message && (
                <p 
                  className="profile-message" 
                  style={{ 
                    marginTop: 12, 
                    textAlign: 'center',
                    color: message.includes('thành công') ? '#4caf50' : '#f44336'
                  }}
                >
                  {message}
                </p>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;