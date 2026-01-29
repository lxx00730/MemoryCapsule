/**
 * 统一的日期格式化工具函数
 */

/**
 * 格式化日期为中文格式
 * @param {string} isoDate - ISO 格式的日期字符串
 * @returns {string} 格式化后的日期字符串
 */
export const formatDate = (isoDate) => {
  if (!isoDate) return '';
  
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}年${month}月${day}日`;
};

/**
 * 格式化日期时间
 * @param {string} isoDate - ISO 格式的日期字符串
 * @returns {string} 格式化后的日期时间字符串
 */
export const formatDateTime = (isoDate) => {
  if (!isoDate) return '';
  
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}年${month}月${day}日 ${hours}:${minutes}`;
};

/**
 * 计算距离开启日期还有多少天
 * @param {string} openDate - 开启日期
 * @returns {number} 天数
 */
export const getDaysUntilOpen = (openDate) => {
  if (!openDate) return 0;
  
  const now = new Date();
  const open = new Date(openDate);
  const diffTime = open - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

/**
 * 获取相对时间描述
 * @param {string} isoDate - ISO 格式的日期字符串
 * @returns {string} 相对时间描述
 */
export const getRelativeTime = (isoDate) => {
  if (!isoDate) return '';
  
  const now = new Date();
  const date = new Date(isoDate);
  const diffTime = now - date;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return '今天';
  if (diffDays === 1) return '昨天';
  if (diffDays < 7) return `${diffDays}天前`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}月前`;
  return `${Math.floor(diffDays / 365)}年前`;
};