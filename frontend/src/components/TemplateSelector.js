import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TemplateSelector.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function TemplateSelector({ onSelect, onClose }) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/templates`);
      setTemplates(response.data);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTemplate = (template) => {
    onSelect({
      title: template.title,
      content: template.content,
      mood: template.mood || 'happy',
      tags: template.tags ? JSON.parse(template.tags) : []
    });
  };

  if (loading) {
    return (
      <div className="template-selector-overlay">
        <div className="template-selector-container">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="mt-3">加载模板中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="template-selector-overlay animate__animated animate__fadeIn">
      <div className="template-selector-container animate__animated animate__zoomIn">
        <div className="template-selector-header">
          <h3>
            <i className="bi bi-collection me-2"></i>
            选择胶囊模板
          </h3>
          <button
            type="button"
            className="btn-close"
            onClick={onClose}
            aria-label="Close"
          />
        </div>

        <div className="template-list">
          {templates.map((template) => (
            <div
              key={template.id}
              className="template-card"
              onClick={() => handleSelectTemplate(template)}
            >
              <div className="template-card-header">
                <h4>{template.name}</h4>
                {template.is_default && (
                  <span className="badge bg-primary">默认</span>
                )}
              </div>
              <div className="template-card-body">
                <h5>{template.title}</h5>
                <p>{template.content.substring(0, 100)}...</p>
              </div>
              <div className="template-card-footer">
                <span className="mood-indicator">
                  {template.mood === 'happy' && '😊'}
                  {template.mood === 'excited' && '🎉'}
                  {template.mood === 'peaceful' && '😌'}
                  {template.mood === 'nostalgic' && '🥰'}
                  {template.mood === 'hopeful' && '🌟'}
                  {template.mood === 'anxious' && '😰'}
                  {template.mood === 'sad' && '😢'}
                </span>
                <span className="tags-count">
                  {template.tags ? JSON.parse(template.tags).length : 0} 个标签
                </span>
              </div>
            </div>
          ))}

          {templates.length === 0 && (
            <div className="empty-state text-center py-5">
              <i className="bi bi-inbox" style={{ fontSize: '4rem', color: '#ccc' }}></i>
              <p className="mt-3 text-muted">暂无模板</p>
            </div>
          )}
        </div>

        <div className="template-selector-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
}

export default TemplateSelector;