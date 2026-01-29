import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import './MobileNavbar.css';

function MobileNavbar({ currentView, onViewChange, user }) {
  const { isDark } = useTheme();

  const navItems = [
    { id: 'timeline', label: '时间轴', icon: 'bi-clock-history' },
    { id: 'create', label: '创建', icon: 'bi-plus-circle' },
    { id: 'stats', label: '统计', icon: 'bi-bar-chart' },
    { id: 'random', label: '回顾', icon: 'bi-shuffle' }
  ];

  return (
    <nav className="mobile-navbar fixed-bottom d-md-none">
      {navItems.map(item => (
        <a
          key={item.id}
          className={`mobile-nav-item ${currentView === item.id ? 'active' : ''}`}
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onViewChange(item.id);
          }}
        >
          <i className={`bi ${item.icon}`}></i>
          <span>{item.label}</span>
        </a>
      ))}
    </nav>
  );
}

export default MobileNavbar;