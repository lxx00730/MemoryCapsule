import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditCapsule.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function EditCapsule({ capsule, onEdit, onCancel, showToast }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    mood: 'happy',
    tags: [],
    open_date: '',
    image_path: '',
    category_id: null
  });
  const [tagInput, setTagInput] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const moods = [
    { value: 'happy', emoji: '😊', label: '开心' },
    { value: 'excited', emoji: '🎉', label: '兴奋' },
    { value: 'peaceful', emoji: '😌', label: '平静' },
    { value: 'nostalgic', emoji: '🥰', label: '怀念' },
    { value: 'hopeful', emoji: '🌟', label: '充满希望' },
    { value: 'anxious', emoji: '😰', label: '焦虑' },
    { value: 'sad', emoji: '😢', label: '悲伤' },
    { value: 'grateful', emoji: '🙏', label: '感激' },
    { value: 'proud', emoji: '😎', label: '自豪' },
    { value: 'relaxed', emoji: '😎', label: '轻松' },
    { value: 'surprised', emoji: '😲', label: '惊讶' },
    { value: 'confident', emoji: '💪', label: '自信' },
    { value: 'thoughtful', emoji: '🤔', label: '思考' },
    { value: 'tired', emoji: '😴', label: '疲惫' },
    { value: 'loved', emoji: '❤️', label: '被爱' }
  ];

  useEffect(() => {
    // 获取分类列表
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

  useEffect(() => {
    if (capsule) {
      setFormData({
        title: capsule.title,
        content: capsule.content,
        mood: capsule.mood || 'happy',
        tags: capsule.tags ? JSON.parse(capsule.tags) : [],
        open_date: capsule.open_date,
        image_path: capsule.image_path || '',
        category_id: capsule.category_id || null
      });
    }
  }, [capsule]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // 如果是分类选择且值为空字符串，则设置为 null
    const newValue = name === 'category_id' && value === '' ? null : value;
    setFormData({ ...formData, [name]: newValue });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      try {
        const response = await axios.post(`${API_URL}/api/upload`, formDataUpload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setFormData({ ...formData, image_path: response.data.path });
      } catch (error) {
        console.error('Upload failed:', error);
        if (showToast) {
          showToast('图片上传失败', 'error');
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log('EditCapsule - Submitting update for capsule:', capsule.id);
    console.log('EditCapsule - Form data:', formData);
    try {
      const token = localStorage.getItem('token');
      console.log('EditCapsule - Sending PUT request...');
      const response = await axios.put(`${API_URL}/api/capsules/${capsule.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('EditCapsule - Update successful:', response.data);
      onEdit();
    } catch (error) {
      console.error('Update failed:', error);
      console.error('Error details:', error.response?.data, error.response?.status);
      if (showToast) {
        showToast('更新失败，请重试', 'error');
      } else {
        alert('更新失败，请重试');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-form animate__animated animate__fadeIn">
      <h2 className="text-center mb-4">
        <i className="bi bi-pencil me-2"></i>
        编辑时间胶囊
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="form-label">标题</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="给你的胶囊起个名字..."
            required
          />
        </div>

        <div className="mb-4">
          <label className="form-label">心情</label>
          <div className="mood-selector">
            {moods.map(mood => (
              <button
                key={mood.value}
                type="button"
                className={`mood-btn ${formData.mood === mood.value ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, mood: mood.value })}
              >
                <span className="mood-emoji">{mood.emoji}</span>
                <span className="mood-label">{mood.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label">分类（可选）</label>
          <select
            className="form-select"
            name="category_id"
            value={formData.category_id || ''}
            onChange={handleChange}
          >
            <option value="">未分类</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="form-label">内容</label>
          <textarea
            className="form-control"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="6"
            placeholder="写下你想对未来自己说的话..."
            required
          />
        </div>

        <div className="mb-4">
          <label className="form-label">标签</label>
          <div className="tag-input-group">
            <input
              type="text"
              className="form-control"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              placeholder="添加标签，按回车确认"
            />
            <button type="button" className="btn btn-outline-primary" onClick={handleAddTag}>
              <i className="bi bi-plus"></i>
            </button>
          </div>
          {formData.tags.length > 0 && (
            <div className="tags-display mt-2">
              {formData.tags.map(tag => (
                <span key={tag} className="badge bg-secondary me-1 mb-1">
                  {tag}
                  <button
                    type="button"
                    className="btn-close btn-close-white ms-1"
                    onClick={() => handleRemoveTag(tag)}
                  />
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="form-label">开启日期</label>
          <input
            type="date"
            className="form-control"
            name="open_date"
            value={formData.open_date}
            onChange={handleChange}
            required
          />
          <small className="text-muted">胶囊将在这一天解锁</small>
        </div>

        <div className="mb-4">
          <label className="form-label">更换图片（可选）</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleImageUpload}
          />
          {(formData.image_path || imageFile) && (
            <div className="mt-2">
              <img
                src={imageFile ? URL.createObjectURL(imageFile) : `${API_URL}${formData.image_path}`}
                alt="Preview"
                className="img-preview"
              />
            </div>
          )}
        </div>

        <div className="button-group">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={loading}
          >
            取消
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                保存中...
              </>
            ) : (
              <>
                <i className="bi bi-check me-2"></i>
                保存修改
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditCapsule;