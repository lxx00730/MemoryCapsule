import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import './MoodStats.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function MoodStats() {
  const [moodData, setMoodData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMoodStats();
  }, []);

  const fetchMoodStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/stats/mood`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMoodData(response.data);
    } catch (error) {
      console.error('Fetch failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const moodEmojis = {
    happy: '😊',
    excited: '🎉',
    peaceful: '😌',
    nostalgic: '🥰',
    hopeful: '🌟',
    anxious: '😰',
    sad: '😢'
  };

  const moodColors = {
    happy: '#FFD93D',
    excited: '#FF6B6B',
    peaceful: '#6BCB77',
    nostalgic: '#FF9F43',
    hopeful: '#54A0FF',
    anxious: '#9B59B6',
    sad: '#3498DB'
  };

  const getChartData = () => {
    const labels = Object.keys(moodData).map(mood => {
      const emoji = moodEmojis[mood] || '';
      return `${emoji} ${mood}`;
    });
    const data = Object.values(moodData);
    const colors = Object.keys(moodData).map(mood => moodColors[mood] || '#667eea');

    return { labels, data, colors };
  };

  const getTotalCapsules = () => {
    return moodData ? Object.values(moodData).reduce((sum, count) => sum + count, 0) : 0;
  };

  const getDominantMood = () => {
    if (!moodData || Object.keys(moodData).length === 0) return null;
    return Object.entries(moodData).reduce((a, b) => b[1] > a[1] ? b : a)[0];
  };

  if (loading) {
    return (
      <div className="stats-container animate__animated animate__fadeIn">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-3 text-muted">加载统计数据中...</p>
        </div>
      </div>
    );
  }

  if (!moodData || Object.keys(moodData).length === 0) {
    return (
      <div className="stats-container animate__animated animate__fadeIn">
        <div className="empty-state text-center py-5">
          <i className="bi bi-bar-chart" style={{ fontSize: '4rem', color: '#667eea' }}></i>
          <p className="mt-3 text-muted">还没有足够的数据来生成统计图表</p>
        </div>
      </div>
    );
  }

  const chartData = getChartData();
  const dominantMood = getDominantMood();

  return (
    <div className="stats-container animate__animated animate__fadeIn">
      <h2 className="text-center mb-4">
        <i className="bi bi-bar-chart me-2"></i>
        心情统计
      </h2>

      <div className="stats-summary">
        <div className="stat-card">
          <i className="bi bi-collection"></i>
          <div className="stat-value">{getTotalCapsules()}</div>
          <div className="stat-label">总胶囊数</div>
        </div>
        <div className="stat-card">
          <i className="bi bi-emoji-smile"></i>
          <div className="stat-value">
            {moodEmojis[dominantMood] || '😊'} {dominantMood || 'happy'}
          </div>
          <div className="stat-label">最常出现的心情</div>
        </div>
        <div className="stat-card">
          <i className="bi bi-stars"></i>
          <div className="stat-value">{Object.keys(moodData).length}</div>
          <div className="stat-label">心情种类</div>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-card">
          <h4 className="chart-title">心情分布</h4>
          <div className="chart-wrapper">
            <Doughnut
              data={{
                labels: chartData.labels,
                datasets: [{
                  data: chartData.data,
                  backgroundColor: chartData.colors,
                  borderWidth: 0,
                  hoverOffset: 10
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      padding: 20,
                      font: {
                        size: 14,
                        family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                      }
                    }
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        const value = context.parsed;
                        const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${value} 个胶囊 (${percentage}%)`;
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        <div className="chart-card">
          <h4 className="chart-title">心情频率</h4>
          <div className="chart-wrapper">
            <Bar
              data={{
                labels: chartData.labels,
                datasets: [{
                  label: '胶囊数量',
                  data: chartData.data,
                  backgroundColor: chartData.colors,
                  borderRadius: 8,
                  borderWidth: 0
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                  legend: {
                    display: false
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => `${context.parsed.y} 个胶囊`
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      stepSize: 1
                    },
                    grid: {
                      color: 'rgba(0, 0, 0, 0.05)'
                    }
                  },
                  x: {
                    grid: {
                      display: false
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      <div className="mood-insights">
        <h4 className="insights-title">
          <i className="bi bi-lightbulb me-2"></i>
          心情洞察
        </h4>
        <div className="insights-grid">
          {Object.entries(moodData).map(([mood, count]) => (
            <div key={mood} className="insight-item">
              <div className="insight-emoji">{moodEmojis[mood] || '😊'}</div>
              <div className="insight-info">
                <div className="insight-mood">{mood}</div>
                <div className="insight-count">{count} 个胶囊</div>
              </div>
              <div className="insight-bar" style={{ width: `${(count / getTotalCapsules()) * 100}%` }}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MoodStats;