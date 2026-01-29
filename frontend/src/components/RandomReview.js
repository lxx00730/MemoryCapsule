import React, { useState } from 'react';
import axios from 'axios';
import './RandomReview.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function RandomReview({ onCapsuleSelect }) {
  const [loading, setLoading] = useState(false);
  const [capsule, setCapsule] = useState(null);
  const [error, setError] = useState(null);

  const getMoodEmoji = (mood) => {
    const moodMap = {
      happy: '😊',
      excited: '🎉',
      peaceful: '😌',
      nostalgic: '🥰',
      hopeful: '🌟',
      anxious: '😰',
      sad: '😢'
    };
    return moodMap[mood] || '😊';
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const fetchRandomCapsule = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/capsules/random`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCapsule(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError('还没有已开启的时间胶囊可以回顾');
      } else {
        setError('获取失败，请重试');
      }
    } finally {
      setLoading(false);
    }
  };

  const tags = capsule ? (capsule.tags ? JSON.parse(capsule.tags) : []) : [];

  return (
    <div className="random-review-container animate__animated animate__fadeIn">
      <h2 className="text-center mb-4">
        <i className="bi bi-shuffle me-2"></i>
        随机回顾
      </h2>
      <p className="text-center text-muted mb-4">
        随机抽取一个已开启的时间胶囊，重温过去的回忆
      </p>

      <div className="random-content">
        {loading ? (
          <div className="loading-state text-center py-5">
            <div className="spinner-border text-primary mb-3" role="status"></div>
            <p className="text-muted">正在抽取回忆...</p>
          </div>
        ) : error ? (
          <div className="error-state text-center py-5">
            <i className="bi bi-emoji-frown" style={{ fontSize: '4rem', color: '#667eea' }}></i>
            <p className="mt-3 text-muted">{error}</p>
            <button className="btn btn-primary mt-3" onClick={fetchRandomCapsule}>
              <i className="bi bi-arrow-clockwise me-2"></i>
              重试
            </button>
          </div>
        ) : capsule ? (
          <div className="capsule-preview">
            <div className="preview-header">
              <div className="preview-mood">
                <span className="mood-emoji-large">{getMoodEmoji(capsule.mood)}</span>
              </div>
              <div className="preview-title">
                <h3>{capsule.title}</h3>
                <p className="text-muted">
                  创建于 {formatDate(capsule.create_date)}
                </p>
              </div>
            </div>

            <div className="preview-content">
              <div className="content-preview">
                <i className="bi bi-file-text me-2"></i>
                <span className="text-truncate">
                  {capsule.content.substring(0, 100)}
                  {capsule.content.length > 100 ? '...' : ''}
                </span>
              </div>

              {capsule.image_path && (
                <div className="image-preview">
                  <i className="bi bi-image me-2"></i>
                  <span>包含图片</span>
                </div>
              )}

              {tags.length > 0 && (
                <div className="tags-preview">
                  {tags.slice(0, 3).map((tag, idx) => (
                    <span key={idx} className="badge bg-light text-dark">
                      #{tag}
                    </span>
                  ))}
                  {tags.length > 3 && (
                    <span className="badge bg-light text-dark">
                      +{tags.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="preview-actions">
              <button
                className="btn btn-primary"
                onClick={() => onCapsuleSelect(capsule)}
              >
                <i className="bi bi-box-arrow-up-right me-2"></i>
                查看完整内容
              </button>
              <button
                className="btn btn-outline-primary"
                onClick={fetchRandomCapsule}
              >
                <i className="bi bi-shuffle me-2"></i>
                换一个
              </button>
            </div>
          </div>
        ) : (
          <div className="empty-state text-center py-5">
            <i className="bi bi-stars" style={{ fontSize: '4rem', color: '#667eea' }}></i>
            <p className="mt-3 text-muted">点击下方按钮，开始回忆之旅</p>
          </div>
        )}
      </div>

      {!loading && !capsule && !error && (
        <div className="text-center">
          <button
            className="btn btn-primary btn-lg random-btn"
            onClick={fetchRandomCapsule}
          >
            <i className="bi bi-shuffle me-2"></i>
            随机抽取一个回忆
          </button>
        </div>
      )}
    </div>
  );
}

export default RandomReview;