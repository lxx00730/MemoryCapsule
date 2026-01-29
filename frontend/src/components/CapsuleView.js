import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CapsuleView.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function CapsuleView({ capsule, onBack, onOpen, showToast }) {
  console.log('CapsuleView - capsule object:', capsule);
  console.log('CapsuleView - capsule.id:', capsule?.id);
  console.log('CapsuleView - capsule.image_path:', capsule?.image_path);
  console.log('CapsuleView - capsule.is_opened:', capsule?.is_opened);

  const [isOpening, setIsOpening] = useState(false);
  const [isOpened, setIsOpened] = useState(capsule.is_opened);
  const [showContent, setShowContent] = useState(capsule.is_opened);

  const getMoodEmoji = (mood) => {
    const moodMap = {
      happy: '😊',
      excited: '🎉',
      peaceful: '😌',
      nostalgic: '🥰',
      hopeful: '🌟',
      anxious: '😰',
      sad: '😢',
      grateful: '🙏',
      proud: '😎',
      relaxed: '😎',
      surprised: '😲',
      confident: '💪',
      thoughtful: '🤔',
      tired: '😴',
      loved: '❤️'
    };
    return moodMap[mood] || '😊';
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const canOpen = () => {
    const now = new Date();
    const openDate = new Date(capsule.open_date);
    return !isOpened && openDate <= now;
  };

  const handleOpenCapsule = async () => {
    setIsOpening(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/capsules/${capsule.id}/open`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsOpened(true);
      setShowContent(true);
      onOpen();
    } catch (error) {
      console.error('Open failed:', error);
      if (showToast) {
        showToast('开启失败，请重试', 'error');
      }
    } finally {
      setIsOpening(false);
    }
  };

  const tags = capsule.tags ? JSON.parse(capsule.tags) : [];

  return (
    <div className="capsule-view-wrapper animate__animated animate__fadeIn">
      <button className="btn-back" onClick={onBack}>
        <i className="bi bi-arrow-left"></i>
        <span>返回时间轴</span>
      </button>

      <div className="capsule-view-container">
      {!showContent ? (
        <div className="capsule-sealed-view">
          <div className={`capsule-icon ${isOpening ? 'opening' : ''} ${canOpen() ? 'ready' : ''}`}>
            <i className={`bi ${canOpen() ? 'bi-unlock' : 'bi-hourglass-split'}`}></i>
          </div>
          
          <h2 className="capsule-title-view">{capsule.title}</h2>
          
          <div className="capsule-meta">
            <p>
              <i className="bi bi-calendar3 me-2"></i>
              创建于 {formatDate(capsule.create_date)}
            </p>
            <p>
              <i className="bi bi-hourglass-split me-2"></i>
              计划开启于 {formatDate(capsule.open_date)}
            </p>
            <p>
              <span className="mood-emoji-large">{getMoodEmoji(capsule.mood)}</span>
              当时的心情
            </p>
          </div>

          {tags.length > 0 && (
            <div className="tags-display-view">
              {tags.map((tag, idx) => (
                <span key={idx} className="badge bg-light text-dark">#{tag}</span>
              ))}
            </div>
          )}

          {capsule.image_path && (
            <div className="capsule-image-blur">
              <img
                src={`${API_URL}${capsule.image_path}`}
                alt="胶囊图片（模糊）"
                style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(4px)'}}
              />
              <div className="blur-overlay">
                <i className="bi bi-image"></i>
              </div>
            </div>
          )}

          <div className="sealed-message">
            {canOpen() ? (
              <>
                <i className="bi bi-unlock-fill"></i>
                <p>这个时间胶囊已经到达开启时间！</p>
                <p className="text-muted">点击下方按钮，解锁这份回忆...</p>
              </>
            ) : (
              <>
                <i className="bi bi-lock-fill"></i>
                <p>这个时间胶囊还未到开启时间</p>
                <p className="text-muted">等待时光流逝，解锁这份回忆...</p>
              </>
            )}
          </div>

          {canOpen() && (
            <button
              className={`btn-open-capsule ${isOpening ? 'opening' : ''}`}
              onClick={handleOpenCapsule}
              disabled={isOpening}
            >
              {isOpening ? (
                <>
                  <div className="loader"></div>
                  解封中...
                </>
              ) : (
                <>
                  <i className="bi bi-unlock me-2"></i>
                  解封时间胶囊
                </>
              )}
            </button>
          )}
        </div>
      ) : (
        <div className="capsule-opened-view animate__animated animate__fadeInUp">
          <div className="capsule-header-opened">
            <div className="capsule-icon-opened">
              <i className="bi bi-envelope-open"></i>
            </div>
            <h2 className="capsule-title-view">{capsule.title}</h2>
            <p className="text-muted">已开启 {capsule.open_time ? formatDate(capsule.open_time) : ''}</p>
          </div>

          <div className="capsule-content-opened">
            <div className="mood-display">
              <span className="mood-emoji-large">{getMoodEmoji(capsule.mood)}</span>
              <span>当时的心情</span>
            </div>

            <div className="content-text">
              <h5>来自过去的留言：</h5>
              <p>{capsule.content}</p>
            </div>

            {capsule.image_path && (
              <div className="capsule-image-opened">
                {(() => {
                  const fullImageUrl = `${API_URL}${capsule.image_path}`;
                  console.log('CapsuleView - Image path:', capsule.image_path);
                  console.log('CapsuleView - Full URL:', fullImageUrl);
                  console.log('CapsuleView - API_URL:', API_URL);
                  console.log('CapsuleView - Capsule ID:', capsule.id);
                  return null;
                })()}
                <img
                  src={`${API_URL}${capsule.image_path}`}
                  alt="胶囊图片"
                  onError={(e) => {
                    console.error('CapsuleView - Image load error:', e.target.src);
                    console.error('CapsuleView - Image error event:', e);
                    console.error('CapsuleView - Image naturalWidth:', e.target.naturalWidth);
                    console.error('CapsuleView - Image naturalHeight:', e.target.naturalHeight);
                    e.target.style.display = 'none';
                  }}
                  onLoad={(e) => {
                    console.log('CapsuleView - Image loaded successfully:', e.target.src);
                    console.log('CapsuleView - Image dimensions:', e.target.naturalWidth, 'x', e.target.naturalHeight);
                  }}
                />
              </div>
            )}

            {tags.length > 0 && (
              <div className="tags-display-view">
                {tags.map((tag, idx) => (
                  <span key={idx} className="badge bg-light text-dark">#{tag}</span>
                ))}
              </div>
            )}

            <div className="capsule-timeline-info">
              <p>
                <i className="bi bi-calendar3 me-2"></i>
                创建于 {formatDate(capsule.create_date)}
              </p>
              <p>
                <i className="bi bi-hourglass-split me-2"></i>
                封存了 {(new Date(capsule.open_time || new Date()) - new Date(capsule.create_date)) / (1000 * 60 * 60 * 24)} 天
              </p>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default CapsuleView;