import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import './Navbar.css';

function Navbar({ onViewChange, currentView, user, onLogout }) {
  const { isDark, toggleTheme } = useTheme();

  const views = [
    { id: 'create', label: '创建胶囊', icon: 'bi-plus-circle' },
    { id: 'timeline', label: '时间轴', icon: 'bi-clock-history' },
    { id: 'stats', label: '心情统计', icon: 'bi-bar-chart' },
    { id: 'random', label: '随机回顾', icon: 'bi-shuffle' }
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-custom fixed-top">
      <div className="container">
        <a className="navbar-brand" href="#" onClick={() => onViewChange('timeline')}>
          <i className="bi bi-hourglass-split me-2"></i>
          时间胶囊
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {views.map(view => (
              <li className="nav-item" key={view.id}>
                <a
                  className={`nav-link ${currentView === view.id ? 'active' : ''}`}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onViewChange(view.id);
                  }}
                >
                  <i className={`bi ${view.icon} me-1`}></i>
                  <span className="d-none d-sm-inline">{view.label}</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={toggleTheme}
              title={isDark ? '切换到亮色模式' : '切换到深色模式'}
            >
              <i className={`bi ${isDark ? 'bi-sun' : 'bi-moon'}`}></i>
            </button>
            {user && (
              <>
                <span className="navbar-text d-none d-md-block">
                  <i className="bi bi-person-circle me-1"></i>
                  {user.username}
                </span>
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={onLogout}
                >
                  <i className="bi bi-box-arrow-right me-1"></i>
                  <span className="d-none d-sm-inline">退出</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;