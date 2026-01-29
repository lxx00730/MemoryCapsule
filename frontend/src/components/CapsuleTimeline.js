import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CapsuleTimeline.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function CapsuleTimeline({ capsules, onCapsuleClick, onEditCapsule, onBatchDelete, onExport, showToast, selectedCategory, filter, setFilter, selectedCapsules, setSelectedCapsules, searchQuery, setSearchQuery, searchType, setSearchType }) {
  const [categories, setCategories] = useState([]);

  // 获取分类列表
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/api/categories`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCategories(response.data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // 获取分类名称
  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : '未分类';
  };

  console.log('CapsuleTimeline - received capsules:', capsules.length);
  console.log('CapsuleTimeline - filter:', filter);
  console.log('CapsuleTimeline - selectedCategory:', selectedCategory);
  console.log('CapsuleTimeline - searchQuery:', searchQuery);

  const getCapsuleStatus = (capsule) => {
    const now = new Date();
    const openDate = new Date(capsule.open_date);

    if (capsule.is_opened) {
      return 'opened';
    } else if (openDate <= now) {
      return 'ready';
    } else {
      return 'sealed';
    }
  };

  const getDaysUntilOpen = (openDate) => {
    const now = new Date();
    const open = new Date(openDate);
    const diffTime = open - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffTime = now - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return '今天';
    if (diffDays === 1) return '昨天';
    if (diffDays < 7) return `${diffDays}天前`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}个月前`;
    return `${Math.floor(diffDays / 365)}年前`;
  };

  const filteredCapsules = capsules.filter(capsule => {
    const status = getCapsuleStatus(capsule);

    // 状态过滤
    if (filter !== 'all' && status !== filter) {
      return false;
    }

    // 分类过滤
    if (selectedCategory !== null && capsule.category_id !== selectedCategory) {
      console.log(`Capsule "${capsule.title}" (ID: ${capsule.id}) - 胶囊分类ID: ${capsule.category_id}, 选中分类ID: ${selectedCategory}, 类型不匹配: ${typeof capsule.category_id} vs ${typeof selectedCategory}`);
      return false;
    }

    // 搜索过滤
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const tags = capsule.tags ? JSON.parse(capsule.tags) : [];

      switch (searchType) {
        case 'title':
          return capsule.title.toLowerCase().includes(query);
        case 'content':
          return capsule.content.toLowerCase().includes(query);
        case 'tags':
          return tags.some(tag => tag.toLowerCase().includes(query));
        case 'all':
        default:
          return (
            capsule.title.toLowerCase().includes(query) ||
            capsule.content.toLowerCase().includes(query) ||
            tags.some(tag => tag.toLowerCase().includes(query))
          );
      }
    }

    return true;
  });

  console.log('CapsuleTimeline - filtered capsules:', filteredCapsules.length);

  const handleSelectCapsule = (capsuleId) => {
    if (selectedCapsules.includes(capsuleId)) {
      setSelectedCapsules(selectedCapsules.filter(id => id !== capsuleId));
    } else {
      setSelectedCapsules([...selectedCapsules, capsuleId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedCapsules.length === filteredCapsules.length) {
      setSelectedCapsules([]);
    } else {
      setSelectedCapsules(filteredCapsules.map(c => c.id));
    }
  };

  const handleBatchDeleteClick = () => {
    if (selectedCapsules.length === 0) {
      showToast('请先选择要删除的胶囊', 'error');
      return;
    }

    if (window.confirm(`确定要删除选中的 ${selectedCapsules.length} 个胶囊吗？`)) {
      onBatchDelete(selectedCapsules);
      setSelectedCapsules([]);
    }
  };

  const deleteCapsule = async (capsuleId, e) => {
    e.stopPropagation();
    if (window.confirm('确定要删除这个胶囊吗？')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/api/capsules/${capsuleId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        showToast('胶囊已删除');
        // 通知父组件刷新
        setTimeout(() => window.location.reload(), 500);
      } catch (error) {
        console.error('Delete failed:', error);
        showToast('删除失败，请重试', 'error');
      }
    }
  };

  return (
    <div className="capsule-timeline animate__animated animate__fadeIn">
      <div className="timeline-header">
        <div className="search-section mb-3">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="搜索胶囊..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              className="form-select"
              style={{ maxWidth: '120px' }}
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
            >
              <option value="all">全部</option>
              <option value="title">标题</option>
              <option value="content">内容</option>
              <option value="tags">标签</option>
            </select>
            {searchQuery && (
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => setSearchQuery('')}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            )}
          </div>
          <small className="text-muted mt-1">
            {searchQuery ? `找到 ${filteredCapsules.length} 个结果` : `共 ${filteredCapsules.length} 个胶囊`}
          </small>
        </div>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => {
              setFilter('all');
              setSelectedCapsules([]);
            }}
          >
            全部
          </button>
          <button
            className={`filter-btn ${filter === 'sealed' ? 'active' : ''}`}
            onClick={() => {
              setFilter('sealed');
              setSelectedCapsules([]);
            }}
          >
            封存中
          </button>
          <button
            className={`filter-btn ${filter === 'ready' ? 'active' : ''}`}
            onClick={() => {
              setFilter('ready');
              setSelectedCapsules([]);
            }}
          >
            可开启
          </button>
          <button
            className={`filter-btn ${filter === 'opened' ? 'active' : ''}`}
            onClick={() => {
              setFilter('opened');
              setSelectedCapsules([]);
            }}
          >
            已开启
          </button>
        </div>

        <div className="action-buttons">
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={handleSelectAll}
            disabled={filteredCapsules.length === 0}
          >
            <i className="bi bi-check-all me-1"></i>
            {selectedCapsules.length === filteredCapsules.length ? '取消全选' : '全选'}
          </button>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={handleBatchDeleteClick}
            disabled={selectedCapsules.length === 0}
          >
            <i className="bi bi-trash me-1"></i>
            批量删除 ({selectedCapsules.length})
          </button>
          <button
            className="btn btn-outline-success btn-sm"
            onClick={onExport}
            disabled={capsules.length === 0}
          >
            <i className="bi bi-download me-1"></i>
            导出数据
          </button>
        </div>
      </div>

      <div className="timeline">
        {console.log('Rendering timeline with', filteredCapsules.length, 'capsules')}
        {filteredCapsules.length === 0 ? (
          <div className="empty-state text-center py-5">
            <i className="bi bi-hourglass-split" style={{ fontSize: '4rem', color: '#667eea' }}></i>
            <p className="mt-3 text-muted">还没有时间胶囊，去创建一个吧！</p>
          </div>
        ) : (
          filteredCapsules.map((capsule, index) => {
            console.log('Rendering capsule', index + 1, ':', capsule.id, capsule.title);
            const status = getCapsuleStatus(capsule);
            const daysUntilOpen = getDaysUntilOpen(capsule.open_date);

            return (
              <div
                key={capsule.id}
                className={`timeline-item capsule-card capsule-${status} ${selectedCapsules.includes(capsule.id) ? 'selected' : ''}`}
                onClick={() => onCapsuleClick(capsule)}
              >
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <div className="capsule-header">
                    <div className="d-flex align-items-center">
                      <input
                        type="checkbox"
                        className="form-check-input me-3"
                        checked={selectedCapsules.includes(capsule.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleSelectCapsule(capsule.id);
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <h3 className="capsule-title">{capsule.title}</h3>
                    </div>
                    <div className="capsule-actions">
                      {!capsule.is_opened && (
                        <button
                          className="btn btn-sm btn-outline-secondary me-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditCapsule(capsule);
                          }}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                      )}
                      <button
                        className="btn btn-delete"
                        onClick={(e) => deleteCapsule(capsule.id, e)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>

                  <div className="capsule-meta">
                    <span className="meta-item">
                      <i className="bi bi-calendar3 me-1"></i>
                      {formatDate(capsule.create_date)}
                    </span>
                    <span className={`meta-item badge status-${status}`}>
                      {status === 'sealed' && `🔒 ${daysUntilOpen}天后开启`}
                      {status === 'ready' && '🔓 可开启'}
                      {status === 'opened' && '✅ 已开启'}
                    </span>
                    {capsule.mood && (
                      <span className="meta-item mood-emoji">
                        {capsule.mood === 'happy' && '😊'}
                        {capsule.mood === 'excited' && '🎉'}
                        {capsule.mood === 'peaceful' && '😌'}
                        {capsule.mood === 'nostalgic' && '🥰'}
                        {capsule.mood === 'hopeful' && '🌟'}
                        {capsule.mood === 'anxious' && '😰'}
                        {capsule.mood === 'sad' && '😢'}
                        {capsule.mood === 'grateful' && '🙏'}
                        {capsule.mood === 'proud' && '😎'}
                        {capsule.mood === 'relaxed' && '😎'}
                        {capsule.mood === 'surprised' && '😲'}
                        {capsule.mood === 'confident' && '💪'}
                        {capsule.mood === 'thoughtful' && '🤔'}
                        {capsule.mood === 'tired' && '😴'}
                        {capsule.mood === 'loved' && '❤️'}
                      </span>
                    )}
                    <span className="meta-item text-muted">
                      <i className="bi bi-file-text me-1"></i>
                      {capsule.content.length} 字
                    </span>
                  </div>

                  {/* 内容预览 - 只有已开启的胶囊才显示 */}
                  {status === 'opened' && (
                    <div className="capsule-preview">
                      <p className="preview-text">
                        {capsule.content.length > 100
                          ? capsule.content.substring(0, 100) + '...'
                          : capsule.content}
                      </p>
                    </div>
                  )}

                  {capsule.image_path && status === 'opened' && (
                    <div className="capsule-image-preview">
                      <img
                        src={`${API_URL}${capsule.image_path}`}
                        alt="胶囊图片"
                        loading="lazy"
                        style={{width: '100%', maxHeight: '200px', objectFit: 'cover'}}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}

                  {capsule.tags && JSON.parse(capsule.tags).length > 0 && (
                    <div className="tags-container">
                      {JSON.parse(capsule.tags).map((tag, idx) => (
                        <span key={idx} className="badge bg-light text-dark">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* 额外信息 */}
                  <div className="capsule-footer">
                    <small className="text-muted">
                      <i className="bi bi-clock-history me-1"></i>
                      创建于 {getDaysAgo(capsule.create_date)}
                    </small>
                    {capsule.category_id && (
                      <small className="text-muted ms-3">
                        <i className="bi bi-folder me-1"></i>
                        {getCategoryName(capsule.category_id)}
                      </small>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default CapsuleTimeline;