import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CategoryManager.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function CategoryManager({ onCategorySelect, selectedCategory }) {
  const [categories, setCategories] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    color: '#667eea',
    icon: 'bi-folder'
  });

  const icons = [
    { value: 'bi-folder', label: '文件夹' },
    { value: 'bi-briefcase', label: '工作' },
    { value: 'bi-heart', label: '生活' },
    { value: 'bi-book', label: '学习' },
    { value: 'bi-airplane', label: '旅行' },
    { value: 'bi-star', label: '收藏' },
    { value: 'bi-camera', label: '摄影' },
    { value: 'bi-music', label: '音乐' },
    { value: 'bi-gift', label: '礼物' },
    { value: 'bi-calendar', label: '日程' }
  ];

  const colors = [
    '#667eea', '#28a745', '#ffc107', '#dc3545', '#17a2b8',
    '#6f42c1', '#fd7e14', '#20c997', '#e83e8c', '#343a40'
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

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

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/categories`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData({ name: '', color: '#667eea', icon: 'bi-folder' });
      setShowCreateForm(false);
      fetchCategories();
    } catch (error) {
      console.error('Failed to create category:', error);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('确定要删除这个分类吗？该分类下的胶囊将变为未分类。')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/categories/${categoryId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCategories();
      if (selectedCategory === categoryId) {
        onCategorySelect(null);
      }
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  return (
    <div className="category-manager">
      <div className="category-header">
        <h5>
          <i className="bi bi-folder2 me-2"></i>
          分类
        </h5>
        <button
          className="btn btn-sm btn-outline-primary"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          <i className="bi bi-plus-lg me-1"></i>
          新建
        </button>
      </div>

      {showCreateForm && (
        <form className="create-category-form mb-3" onSubmit={handleCreateCategory}>
          <div className="mb-2">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="分类名称"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="mb-2">
            <select
              className="form-select form-select-sm"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            >
              {icons.map(icon => (
                <option key={icon.value} value={icon.value}>
                  {icon.label}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-2">
            <div className="color-picker">
              {colors.map(color => (
                <button
                  key={color}
                  type="button"
                  className={`color-btn ${formData.color === color ? 'active' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setFormData({ ...formData, color })}
                />
              ))}
            </div>
          </div>
          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-sm btn-primary">
              创建
            </button>
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              onClick={() => setShowCreateForm(false)}
            >
              取消
            </button>
          </div>
        </form>
      )}

      <div className="category-list">
        <button
          className={`category-item ${selectedCategory === null ? 'active' : ''}`}
          onClick={() => onCategorySelect(null)}
        >
          <i className="bi bi-grid me-2"></i>
          全部
        </button>
        {categories.map(category => (
          <div
            key={category.id}
            className={`category-item ${selectedCategory === category.id ? 'active' : ''}`}
            style={{ borderLeft: `4px solid ${category.color}` }}
            onClick={() => onCategorySelect(category.id)}
          >
            <i className={`bi ${category.icon} me-2`}></i>
            <span>{category.name}</span>
            <button
              className="btn-delete-category"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteCategory(category.id);
              }}
            >
              <i className="bi bi-trash"></i>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryManager;