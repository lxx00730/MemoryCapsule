import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // 登录
        const response = await axios.post(`${API_URL}/api/auth/login`, {
          username: formData.username,
          password: formData.password
        });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        console.log('Login - Token saved:', localStorage.getItem('token'));
        console.log('Login - User saved:', localStorage.getItem('user'));
        onLogin(response.data.user);
      } else {
        // 注册
        await axios.post(`${API_URL}/api/auth/register`, {
          username: formData.username,
          password: formData.password,
          email: formData.email
        });
        // 注册成功后自动登录
        const loginResponse = await axios.post(`${API_URL}/api/auth/login`, {
          username: formData.username,
          password: formData.password
        });
        localStorage.setItem('token', loginResponse.data.token);
        localStorage.setItem('user', JSON.stringify(loginResponse.data.user));
        console.log('Register - Token saved:', localStorage.getItem('token'));
        console.log('Register - User saved:', localStorage.getItem('user'));
        onLogin(loginResponse.data.user);
      }
    } catch (err) {
      setError(err.response?.data?.error || '操作失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card animate__animated animate__fadeIn">
        <div className="auth-header">
          <h2>{isLogin ? '登录' : '注册'}</h2>
          <i className="bi bi-hourglass-split auth-icon"></i>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">用户名</label>
            <input
              id="username"
              type="text"
              className="form-control"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="请输入用户名"
              required
              minLength="3"
              autoComplete="username"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">密码</label>
            <input
              id="password"
              type="password"
              className="form-control"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="请输入密码"
              required
              minLength="6"
              autoComplete={isLogin ? "current-password" : "new-password"}
            />
          </div>

          {!isLogin && (
            <div className="mb-3">
              <label htmlFor="email" className="form-label">邮箱</label>
              <input
                id="email"
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="请输入邮箱"
                required
                autoComplete="email"
              />
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                {isLogin ? '登录中...' : '注册中...'}
              </>
            ) : (
              isLogin ? '登录' : '注册'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? '还没有账号？' : '已有账号？'}
            <button
              type="button"
              className="btn btn-link"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
            >
              {isLogin ? '立即注册' : '立即登录'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Auth;