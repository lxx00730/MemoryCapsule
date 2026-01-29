import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import MobileNavbar from './components/MobileNavbar';
import CreateCapsule from './components/CreateCapsule';
import EditCapsule from './components/EditCapsule';
import CapsuleTimeline from './components/CapsuleTimeline';
import CapsuleView from './components/CapsuleView';
import MoodStats from './components/MoodStats';
import RandomReview from './components/RandomReview';
import Auth from './components/Auth';
import Toast from './components/Toast';
import TemplateSelector from './components/TemplateSelector';
import CategoryManager from './components/CategoryManager';
import { ThemeProvider } from './contexts/ThemeContext';
import './styles/App.css';
import './styles/variables.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'animate.css/animate.min.css';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('timeline');
  const [capsules, setCapsules] = useState([]);
  const [selectedCapsule, setSelectedCapsule] = useState(null);
  const [editingCapsule, setEditingCapsule] = useState(null);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filter, setFilter] = useState('all');
  const [selectedCapsules, setSelectedCapsules] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('all');

  useEffect(() => {
    // 检查是否是新启动的会话（浏览器重新打开）
    const isFreshStart = !sessionStorage.getItem('appSessionStarted');

    if (isFreshStart) {
      // 标记会话已启动
      sessionStorage.setItem('appSessionStarted', 'true');
      // 清除 localStorage 中的登录信息
      console.log('App init - Fresh start detected, clearing login state');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }

    // 检查是否已登录，并验证 token 是否有效
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    console.log('App init - Token from localStorage:', token);
    console.log('App init - User from localStorage:', savedUser);
    console.log('App init - Fresh start:', isFreshStart);

    if (token && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        console.log('App init - Verifying token...');

        // 验证 token 是否仍然有效
        axios.get(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        }).then(response => {
          console.log('App init - Token verified, setting user:', response.data);
          setUser(response.data);
        }).catch(error => {
          console.error('App init - Token verification failed:', error);
          // 清除无效的 token 和用户数据
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }).finally(() => {
          setLoading(false);
        });
      } catch (e) {
        console.error('App init - Failed to parse user:', e);
        // 清除无效的 token 和用户数据
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setLoading(false);
      }
    } else {
      // 没有 token 或用户数据，直接显示登录页面
      console.log('App init - No token or user found, showing login page');
      setLoading(false);
    }
  }, []);

  const fetchCapsules = async () => {
    console.log('fetchCapsules - starting');
    try {
      const token = localStorage.getItem('token');
      console.log('fetchCapsules - token:', token);
      const response = await axios.get(`${API_URL}/api/capsules`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('fetchCapsules - response status:', response.status);
      console.log('fetchCapsules - response data type:', typeof response.data);
      console.log('fetchCapsules - response data length:', response.data.length);
      console.log('fetchCapsules - response data is array:', Array.isArray(response.data));
      console.log('fetchCapsules - setting capsules with', response.data.length, 'items');
      response.data.forEach((c, idx) => {
        console.log(`  Capsule ${idx + 1}: ID=${c.id}, title=${c.title}, status=${c.is_opened}, category_id=${c.category_id} (type: ${typeof c.category_id})`);
      });
      setCapsules(response.data);
    } catch (error) {
      console.error('Failed to fetch capsules:', error);
      console.error('Error details:', error.response?.data, error.response?.status);
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };

  useEffect(() => {
    console.log('useEffect - user changed:', user);
    if (user && user.id) {
      console.log('useEffect - calling fetchCapsules');
      fetchCapsules();
    }
  }, [user]);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCapsules([]);
    setCurrentView('timeline');
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
    // 只在切换到非胶囊相关视图时才清除胶囊状态
    if (view !== 'view' && view !== 'edit') {
      setSelectedCapsule(null);
      setEditingCapsule(null);
    }
  };

  const handleCapsuleClick = (capsule) => {
    setSelectedCapsule(capsule);
    setCurrentView('view');
  };

  const handleEditCapsule = (capsule) => {
    setEditingCapsule(capsule);
    setCurrentView('edit');
  };

  const handleCreate = () => {
    fetchCapsules();
    setCurrentView('timeline');
    showToast('胶囊创建成功！');
  };

  const handleUpdate = () => {
    fetchCapsules();
    setCurrentView('timeline');
    setEditingCapsule(null);
    showToast('胶囊更新成功！');
  };

  const handleOpen = () => {
    fetchCapsules();
    setCurrentView('timeline');
    showToast('胶囊已成功开启！');
  };

  const handleBatchDelete = async (capsuleIds) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/capsules/batch`, { ids: capsuleIds }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCapsules();
      showToast(`已删除 ${capsuleIds.length} 个胶囊`);
    } catch (error) {
      console.error('Batch delete failed:', error);
      showToast('批量删除失败', 'error');
    }
  };

  const handleExport = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/api/capsules/export`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const dataStr = JSON.stringify(response.data, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `time-capsules-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast('导出成功！');
    } catch (error) {
      console.error('Export failed:', error);
      showToast('导出失败', 'error');
    }
  };

  const handleSelectTemplate = (templateData) => {
    setShowTemplateSelector(false);
    setCurrentView('create');
    // 将模板数据传递给 CreateCapsule 组件
    setTimeout(() => {
      const event = new CustomEvent('templateSelected', { detail: templateData });
      window.dispatchEvent(event);
    }, 100);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <Auth onLogin={handleLogin} />
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </>
    );
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'create':
        return (
          <CreateCapsule
            onCreate={handleCreate}
            showToast={showToast}
            showTemplateSelector={() => setShowTemplateSelector(true)}
          />
        );
      case 'edit':
        return (
          <EditCapsule
            capsule={editingCapsule}
            onEdit={handleUpdate}
            onCancel={() => setCurrentView('timeline')}
            showToast={showToast}
          />
        );
      case 'timeline':
        return (
          <div className="row">
            <div className="col-md-3">
              <CategoryManager
                onCategorySelect={setSelectedCategory}
                selectedCategory={selectedCategory}
              />
            </div>
            <div className="col-md-9">
              <CapsuleTimeline
                capsules={capsules}
                onCapsuleClick={handleCapsuleClick}
                onEditCapsule={handleEditCapsule}
                onBatchDelete={handleBatchDelete}
                onExport={handleExport}
                showToast={showToast}
                selectedCategory={selectedCategory}
                filter={filter}
                setFilter={setFilter}
                selectedCapsules={selectedCapsules}
                setSelectedCapsules={setSelectedCapsules}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchType={searchType}
                setSearchType={setSearchType}
              />
            </div>
          </div>
        );
      case 'view':
        return (
          <CapsuleView
            capsule={selectedCapsule}
            onBack={() => setCurrentView('timeline')}
            onOpen={handleOpen}
            showToast={showToast}
          />
        );
      case 'stats':
        return <MoodStats />;
      case 'random':
        return <RandomReview onCapsuleSelect={handleCapsuleClick} />;
      default:
        return (
          <CapsuleTimeline
            capsules={capsules}
            onCapsuleClick={handleCapsuleClick}
            onEditCapsule={handleEditCapsule}
            onBatchDelete={handleBatchDelete}
            onExport={handleExport}
            showToast={showToast}
          />
        );
    }
  };

  return (
    <ThemeProvider>
      <div className="App">
        <Navbar
          onViewChange={handleViewChange}
          currentView={currentView}
          user={user}
          onLogout={handleLogout}
        />
        <div className="container mt-4 mb-5">
          {renderCurrentView()}
        </div>
        {user && currentView !== 'view' && currentView !== 'edit' && (
          <MobileNavbar
            currentView={currentView}
            onViewChange={handleViewChange}
            user={user}
          />
        )}
        {showTemplateSelector && (
          <TemplateSelector
            onSelect={handleSelectTemplate}
            onClose={() => setShowTemplateSelector(false)}
          />
        )}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;