import React from 'react';
import '../styles/UserDetail.css';

const UserDetail = ({ user, onClose }) => {
  if (!user) return null;

  // Lấy avatar từ localStorage dựa trên user._id
  const avatar = localStorage.getItem(`userAvatar_${user._id}`) || '';

  return (
    <div className="user-detail-overlay">
      <div className="user-detail-modal">
        <div className="user-detail-header">
          <h2>Thông Tin Chi Tiết</h2>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>
        
        <div className="user-detail-content">
          <div className="avatar-section" style={{ marginBottom: 20, textAlign: 'center' }}>
            <div style={{ marginBottom: 10 }}>
              {avatar ? (
                <img
                  src={avatar}
                  alt="Avatar"
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid #ddd'
                  }}
                  onError={(e) => console.log('Image load error:', e.target.src, e)}
                />
              ) : (
                <div style={{
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  backgroundColor: '#f0f0f0',
                  margin: '0 auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ fontSize: 50, color: '#666' }}>
                    {user.name ? user.name[0].toUpperCase() : '?'}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="detail-group">
            <label>Tên:</label>
            <div className="detail-value">{user.name}</div>
          </div>
          
          <div className="detail-group">
            <label>Email:</label>
            <div className="detail-value">{user.email}</div>
          </div>

          <div className="detail-group">
            <label>Vai trò:</label>
            <div className="detail-value">{user.role || 'Người dùng'}</div>
          </div>
          
          <div className="detail-group">
            <label>ID:</label>
            <div className="detail-value detail-id">{user._id}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;