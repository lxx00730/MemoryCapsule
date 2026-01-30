# 时间胶囊 - 项目上下文文档

## 项目概述

**时间胶囊** 是一个情感化的记忆回溯系统，允许用户创建"时间胶囊"并在未来特定日期开启查看。这是一个全栈 Web 应用，采用前后端分离架构，支持用户认证、多用户数据隔离、胶囊模板、分类管理等功能。

### 核心功能

- 🕐 **创建时间胶囊** - 设定未来开启日期，添加文字、心情、标签和图片
- 📅 **时间轴展示** - 按时间线展示所有胶囊，区分封存/可开启/已开启状态
- 🔓 **记忆回溯** - 到达开启日期后解封胶囊，重现当时的回忆
- 📊 **心情统计** - 可视化心情变化趋势
- 🎲 **随机回顾** - 随机推送一个过去开启的胶囊供重温
- 👤 **用户认证** - 支持用户注册、登录、登出功能，数据完全隔离
- 📝 **胶囊模板** - 提供 12 种预设模板快速创建胶囊
- ✏️ **编辑胶囊** - 修改已创建但未开启的胶囊内容
- 🗑️ **批量删除** - 支持选择多个胶囊批量删除
- 📤 **数据导出** - 将所有胶囊导出为 JSON 文件备份
- 🔔 **消息提示** - 统一的 Toast 消息提示组件
- 🏷️ **分类管理** - 创建自定义分类对胶囊进行组织和管理
- 🔍 **智能搜索** - 支持按标题、内容、标签进行多维度搜索
- 🌙 **深色模式** - 支持亮色/深色主题切换，自动跟随系统偏好
- 📱 **移动端适配** - 移动端底部导航栏，优化的移动端体验
- 📧 **邮件提醒** - 胶囊开启日期临近时自动发送邮件提醒

---

## 技术栈

### 后端

- **语言**: Python 3.12+
- **框架**: Python 内置 `http.server` 模块和 `BaseHTTPRequestHandler`
- **数据库**: SQLite (文件: `backend/time_capsules.db`)
- **跨域支持**: 手动实现 CORS 响应头
- **邮件服务**: QQ 邮箱 SMTP
- **端口**: 5000
- **注意**: requirements.txt 中包含 Flask 依赖，但实际运行使用 Python 内置的 http.server 模块

### 前端

- **语言**: JavaScript (React 19.2.4)
- **构建工具**: Create React App (react-scripts 5.0.1)
- **UI 框架**: Bootstrap 5.3.8
- **图标**: Bootstrap Icons 5.3.8
- **可视化**: Chart.js 4.5.1 + react-chartjs-2 5.3.1
- **动画**: Animate.css 4.1.1
- **HTTP 客户端**: Axios 1.13.3
- **并发工具**: concurrently 9.2.1（开发依赖）
- **端口**: 3000

---

## 项目结构

```
/mnt/d/python/item/new/
├── backend/
│   ├── app.py                  # 后端主文件（使用 http.server 模块）
│   ├── requirements.txt        # Python 依赖
│   ├── time_capsules.db        # SQLite 数据库（运行时生成）
│   ├── email_config.py         # 邮件配置文件
│   ├── email_sender.py         # 邮件发送模块
│   ├── check_reminders.py      # 定时检查并发送提醒邮件
│   ├── test_email.py           # 邮件测试脚本
│   ├── server.log              # 服务器日志
│   └── venv/                   # Python 虚拟环境
├── frontend/
│   ├── public/                 # 静态资源
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   ├── logo192.png
│   │   ├── logo512.png
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── src/
│   │   ├── components/         # React 组件
│   │   │   ├── Auth.js               # 用户认证组件（登录/注册）
│   │   │   ├── Navbar.js             # 桌面端导航栏组件
│   │   │   ├── MobileNavbar.js       # 移动端导航栏组件
│   │   │   ├── CreateCapsule.js      # 创建胶囊表单组件
│   │   │   ├── EditCapsule.js        # 编辑胶囊组件
│   │   │   ├── CapsuleTimeline.js    # 时间轴展示组件
│   │   │   ├── CapsuleView.js        # 胶囊详情/开启组件
│   │   │   ├── MoodStats.js          # 心情统计图表组件
│   │   │   ├── RandomReview.js       # 随机回顾组件
│   │   │   ├── TemplateSelector.js   # 胶囊模板选择器
│   │   │   ├── CategoryManager.js    # 分类管理组件
│   │   │   └── Toast.js              # 消息提示组件
│   │   ├── contexts/           # React Context
│   │   │   └── ThemeContext.js       # 主题管理 Context（深色模式）
│   │   ├── utils/              # 工具函数
│   │   │   └── dateUtils.js         # 日期格式化工具
│   │   ├── styles/             # 全局样式
│   │   │   ├── App.css             # 全局样式文件
│   │   │   └── variables.css       # CSS 变量（主题定义）
│   │   ├── App.js              # 主应用组件
│   │   ├── index.js            # 入口文件
│   │   ├── setupTests.js       # 测试配置
│   │   └── reportWebVitals.js   # 性能监控
│   ├── .gitignore
│   ├── package.json            # Node.js 依赖和脚本
│   └── README.md
├── uploads/                    # 图片上传目录
├── start.sh                    # Linux/macOS 一键启动脚本
├── start.bat                   # Windows 一键启动脚本
├── AGENTS.md                   # 项目上下文文档
├── README.md                   # 项目说明文档
├── 邮件提醒功能配置说明.md      # 邮件提醒功能配置文档
└── .git/                       # Git 版本控制
```

---

## 快速启动

### 一键启动（推荐）

#### Linux/macOS

```bash
./start.sh
```

#### Windows

```bash
start.bat
```

这将自动：
1. 检查并安装后端依赖（创建虚拟环境）
2. 检查并安装前端依赖
3. 启动后端服务（端口 5000）
4. 启动前端服务（端口 3000）

### 手动启动

#### 后端设置

1. 进入后端目录：
```bash
cd /mnt/d/python/item/new/backend
```

2. 创建虚拟环境（首次运行）：
```bash
python3 -m venv venv
source venv/bin/activate  # Linux/macOS
# 或 venv\Scripts\activate  # Windows
```

3. 安装 Python 依赖：
```bash
pip install -r requirements.txt
```

4. 启动后端服务器：
```bash
python app.py
```
服务器将在 `http://localhost:5000` 运行。

**注意**: 后端使用 Python 内置的 `http.server` 模块和 `BaseHTTPRequestHandler` 类实现 RESTful API，而非标准 Flask 路由。

#### 前端设置

1. 进入前端目录：
```bash
cd /mnt/d/python/item/new/frontend
```

2. 安装 Node.js 依赖：
```bash
npm install
```

3. 启动开发服务器：
```bash
npm start
```
应用将在 `http://localhost:3000` 运行。

#### 同时启动前后端（开发模式）

```bash
cd /mnt/d/python/item/new/frontend
npm run dev
```

### 前端可用脚本

- `npm start` - 启动开发服务器
- `npm run dev` - 同时启动后端和前端服务
- `npm run build` - 构建生产版本
- `npm test` - 运行测试
- `npm run eject` - 弹出配置（不可逆）

---

## API 接口

后端提供以下 RESTful API 接口（前缀 `/api`）：

### 认证相关

#### 用户注册
- **POST** `/api/auth/register`
- 请求体：
  ```json
  {
    "username": "用户名（至少3个字符）",
    "password": "密码（至少6个字符）",
    "email": "邮箱地址"
  }
  ```
- 返回：用户 ID

#### 用户登录
- **POST** `/api/auth/login`
- 请求体：
  ```json
  {
    "username": "用户名",
    "password": "密码"
  }
  ```
- 返回：token 和用户信息

#### 用户登出
- **POST** `/api/auth/logout`
- 需要认证

#### 获取当前用户信息
- **GET** `/api/auth/me`
- 需要认证
- 返回：当前用户信息

### 胶囊相关

#### 获取所有胶囊
- **GET** `/api/capsules`
- 需要认证
- 返回当前用户的所有胶囊，按创建日期倒序排列

#### 获取单个胶囊
- **GET** `/api/capsules/:id`
- 需要认证
- 根据 ID 返回单个胶囊详情

#### 创建胶囊
- **POST** `/api/capsules`
- 需要认证
- 请求体：
  ```json
  {
    "title": "标题（1-100字符）",
    "content": "内容（1-5000字符）",
    "mood": "happy",
    "tags": ["标签1", "标签2"],
    "open_date": "2026-12-31",
    "image_path": "/uploads/image.jpg",
    "category_id": 1
  }
  ```
- 返回：新创建的胶囊 ID

#### 更新胶囊
- **PUT** `/api/capsules/:id`
- 需要认证
- 请求体：
  ```json
  {
    "title": "标题",
    "content": "内容",
    "mood": "happy",
    "tags": ["标签1", "标签2"],
    "open_date": "2026-12-31",
    "image_path": "/uploads/image.jpg",
    "category_id": 1
  }
  ```

#### 开启胶囊
- **POST** `/api/capsules/:id/open`
- 需要认证
- 标记胶囊为已开启，记录开启时间

#### 随机回顾
- **GET** `/api/capsules/random`
- 需要认证
- 随机返回一个当前用户已开启的胶囊

#### 批量删除胶囊
- **POST** `/api/capsules/batch`
- 需要认证
- 请求体：
  ```json
  {
    "ids": [1, 2, 3]
  }
  ```

#### 导出胶囊
- **POST** `/api/capsules/export`
- 需要认证
- 返回当前用户所有胶囊的 JSON 数据

#### 删除单个胶囊
- **DELETE** `/api/capsules/:id`
- 需要认证
- 删除指定 ID 的胶囊

### 分类相关

#### 获取所有分类
- **GET** `/api/categories`
- 需要认证
- 返回当前用户的所有分类

#### 创建分类
- **POST** `/api/categories`
- 需要认证
- 请求体：
  ```json
  {
    "name": "分类名称",
    "color": "#667eea",
    "icon": "bi-folder"
  }
  ```
- 返回：新创建的分类 ID

#### 删除分类
- **DELETE** `/api/categories/:id`
- 需要认证
- 删除指定 ID 的分类，该分类下的胶囊将变为未分类状态

### 模板相关

#### 获取所有模板
- **GET** `/api/templates`
- 返回所有预设和自定义模板

### 心情统计
- **GET** `/api/stats/mood`
- 需要认证
- 返回当前用户所有心情的统计计数

### 文件上传

#### 上传图片
- **POST** `/api/upload`
- 需要认证
- Content-Type: `multipart/form-data`
- 支持格式：png, jpg, jpeg, gif, webp
- 最大文件大小：10MB
- 返回：文件路径（如 `/uploads/xxx.jpg`）

---

## 数据库结构

### users 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键，自增 |
| username | TEXT | 用户名（唯一，必填） |
| password_hash | TEXT | 密码哈希（必填） |
| email | TEXT | 邮箱（唯一，必填） |
| created_at | TEXT | 创建时间（ISO 格式） |

### capsules 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键，自增 |
| user_id | INTEGER | 所属用户 ID（外键） |
| title | TEXT | 胶囊标题（必填，1-100字符） |
| content | TEXT | 胶囊内容（必填，1-5000字符） |
| mood | TEXT | 心情（可选） |
| tags | TEXT | 标签（JSON 数组字符串） |
| create_date | TEXT | 创建日期（ISO 格式） |
| open_date | TEXT | 开启日期（ISO 格式） |
| is_opened | INTEGER | 是否已开启（0/1） |
| open_time | TEXT | 实际开启时间（ISO 格式） |
| image_path | TEXT | 图片路径（可选） |
| category_id | INTEGER | 所属分类 ID（外键，可选） |
| email_sent | INTEGER | 是否已发送提醒邮件（0/1，默认0） |

### templates 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键，自增 |
| name | TEXT | 模板名称（必填） |
| title | TEXT | 默认标题（必填） |
| content | TEXT | 默认内容（必填） |
| mood | TEXT | 默认心情（可选） |
| tags | TEXT | 默认标签（JSON 数组字符串） |
| is_default | INTEGER | 是否为默认模板（0/1） |

### sessions 表

| 字段 | 类型 | 说明 |
|------|------|------|
| token | TEXT | 会话令牌（主键） |
| user_id | INTEGER | 用户 ID（外键） |
| username | TEXT | 用户名 |
| created_at | TEXT | 创建时间（ISO 格式） |
| expires_at | TEXT | 过期时间（ISO 格式，默认1年） |

### categories 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER | 主键，自增 |
| user_id | INTEGER | 所属用户 ID（外键） |
| name | TEXT | 分类名称（必填） |
| color | TEXT | 分类颜色（必填，如 #667eea） |
| icon | TEXT | 分类图标（必填，如 bi-folder） |
| created_at | TEXT | 创建时间（ISO 格式） |

---

## 开发约定

### 代码风格

#### 前端 (React)
- 使用函数组件和 Hooks
- 组件文件采用 PascalCase 命名（如 `CreateCapsule.js`）
- 样式文件与组件同名（如 `CreateCapsule.css`）
- 使用 Bootstrap 5 进行 UI 布局和组件
- 使用 Bootstrap Icons 图标库
- 使用 Animate.css 添加动画效果
- 使用 Chart.js 和 react-chartjs-2 创建数据可视化图表
- 使用 Axios 进行 HTTP 请求
- 所有 API 请求需携带 Authorization header（Bearer token）
- 使用自定义事件进行组件间通信（如模板选择）
- 使用 Context API 管理全局状态（如主题）
- 支持响应式设计，移动端使用 MobileNavbar 组件
- 使用 CSS 变量实现主题切换（亮色/深色模式）

#### 后端 (Python)
- 使用 Python 内置 `http.server` 模块和 `BaseHTTPRequestHandler` 类
- 手动实现 RESTful API 路由解析
- 数据库操作使用 `sqlite3` 模块
- 支持 CORS 跨域请求（手动设置响应头）
- 所有响应返回 JSON 格式
- 密码使用 SHA-256 哈希存储
- Token 使用 `secrets.token_hex(32)` 生成
- 会话有效期默认为 1 年
- 使用 `cgi` 模块处理 multipart/form-data 文件上传

### 心情选项

支持的心情类型：
- `happy` 😊 开心
- `excited` 🎉 兴奋
- `peaceful` 😌 平静
- `nostalgic` 🥰 怀念
- `hopeful` 🌟 充满希望
- `anxious` 😰 焦虑
- `sad` 😢 悲伤

### 环境变量

前端使用环境变量配置 API 地址：
- `REACT_APP_API_URL`: 后端 API 地址（默认 `http://localhost:5000`）

### 文件上传

- 图片上传到 `/mnt/d/python/item/new/uploads/` 目录
- 上传接口：`POST /api/upload`
- 前端使用 FormData 处理文件上传
- 支持格式：png, jpg, jpeg, gif, webp
- 最大文件大小：10MB
- 文件名使用 UUID 生成，避免冲突

### 日期工具

`src/utils/dateUtils.js` 提供统一的日期格式化工具：
- `formatDate(isoDate)` - 格式化日期为中文格式（如：2024年01月28日）
- `formatDateTime(isoDate)` - 格式化日期时间（如：2024年01月28日 14:30）
- `getDaysUntilOpen(openDate)` - 计算距离开启日期还有多少天
- `getRelativeTime(isoDate)` - 获取相对时间描述（如：3天前、1周前）

### 默认模板

系统内置 12 个默认模板：
1. **新年的我** - 致一年后的自己
2. **毕业纪念** - 毕业那天的心情
3. **生日愿望** - 我的生日愿望
4. **旅行日记** - 这次旅行的美好回忆
5. **新年目标** - 2024年新年目标
6. **工作里程碑** - 项目完成纪念
7. **学习笔记** - 学习新技能的感悟
8. **家庭时光** - 与家人共度的美好时光
9. **运动记录** - 第一次跑完5公里
10. **读书感悟** - 读完《书名》的感想
11. **美食记录** - 第一次尝试制作...
12. **重要时刻** - 记录人生中的重要里程碑

### 分类管理

分类管理功能允许用户创建自定义分类来组织胶囊：
- 每个用户可以创建多个分类
- 每个分类可以设置名称、颜色和图标
- 删除分类时，该分类下的胶囊会自动变为未分类状态
- 分类支持的颜色选项：
  - #667eea（紫色）
  - #28a745（绿色）
  - #ffc107（黄色）
  - #dc3545（红色）
  - #17a2b8（青色）
  - #6f42c1（紫罗兰色）
  - #fd7e14（橙色）
  - #20c997（蓝绿色）
  - #e83e8c（粉色）
  - #343a40（深灰色）
- 分类支持的图标选项：
  - bi-folder（文件夹）
  - bi-briefcase（工作）
  - bi-heart（生活）
  - bi-book（学习）
  - bi-airplane（旅行）
  - bi-star（收藏）
  - bi-camera（摄影）
  - bi-music（音乐）
  - bi-gift（礼物）
  - bi-calendar（日程）

### 主题管理

主题管理功能允许用户在亮色和深色模式之间切换：
- 使用 CSS 变量定义主题颜色（定义在 `styles/variables.css`）
- 主题偏好保存在 localStorage 中
- 支持自动跟随系统主题偏好
- 主题切换平滑过渡（使用 CSS transition）
- 主题通过 ThemeContext 全局管理
- 所有组件使用 CSS 变量实现主题自适应

### 移动端适配

移动端适配提供更好的移动设备使用体验：
- 移动端显示底部导航栏（MobileNavbar 组件）
- 桌面端显示顶部导航栏（Navbar 组件）
- 使用 Bootstrap 响应式断点（d-md-none、d-md-block）
- 触摸友好的交互设计
- 优化的移动端布局和间距

### 邮件提醒

邮件提醒功能在胶囊开启日期临近时自动发送通知：
- 使用 QQ 邮箱 SMTP 服务发送邮件
- 配置文件：`backend/email_config.py`
- 检查脚本：`backend/check_reminders.py`
- 邮件发送模块：`backend/email_sender.py`
- 提前 7 天开始检查，每天发送一次
- 使用 `email_sent` 字段记录发送状态，避免重复发送
- 需要配置 QQ 邮箱授权码
- 建议使用 cron 或任务计划程序定期运行检查脚本

### 搜索和筛选

搜索和筛选功能帮助用户快速找到目标胶囊：

1. **状态筛选**
   - 全部：显示所有胶囊
   - 已封存：还未到达开启日期的胶囊
   - 可开启：已到达开启日期但尚未解封的胶囊
   - 已开启：已经解封的胶囊

2. **分类筛选**
   - 支持按特定分类筛选胶囊
   - "全部"选项显示所有分类的胶囊
   - 分类与状态筛选可组合使用

3. **智能搜索**
   - 搜索类型：
     - 全部：同时搜索标题、内容和标签
     - 标题：仅搜索胶囊标题
     - 内容：仅搜索胶囊内容
     - 标签：仅搜索胶囊标签
   - 搜索支持大小写不敏感
   - 实时过滤，无需点击搜索按钮
   - 搜索可与分类和状态筛选组合使用

4. **批量操作**
   - 支持全选/反选胶囊
   - 批量删除选中的胶囊
   - 批量导出所有胶囊数据

---

## 重要注意事项

1. **启动顺序**: 必须先启动后端服务（端口 5000），再启动前端服务（端口 3000）
2. **数据库**: SQLite 数据库文件 `time_capsules.db` 会在首次运行时自动创建
3. **图片存储**: 所有上传的图片保存在 `uploads/` 目录，请确保该目录有写入权限
4. **数据备份**: 建议定期备份 `time_capsules.db` 数据库文件，或使用导出功能备份用户数据
5. **跨域**: 后端已手动配置 CORS 响应头，允许前端跨域访问
6. **端口冲突**: 如果端口 5000 或 3000 被占用，需要修改相应的配置
7. **用户认证**: 所有 API 接口（除了注册和登录）都需要携带有效的 token
8. **数据隔离**: 每个用户只能访问自己的胶囊和分类数据，确保数据安全
9. **会话管理**: Token 有效期为 1 年，过期后需要重新登录
10. **虚拟环境**: 后端建议使用虚拟环境，避免污染系统 Python 环境
11. **会话检测**: 应用会在浏览器重新打开时清除 localStorage 中的登录信息，确保安全
12. **邮件配置**: 使用邮件提醒功能需要配置 `backend/email_config.py`，设置 QQ 邮箱和授权码
13. **定时任务**: 邮件提醒功能需要设置定时任务（cron 或任务计划程序）定期运行 `check_reminders.py`
14. **授权码安全**: 不要将 QQ 邮箱授权码提交到版本控制系统，建议使用环境变量管理

---

## 开发工作流

### 使用一键启动脚本

```bash
# Linux/macOS
./start.sh

# Windows
start.bat
```

### 手动开发流程

1. 启动后端：
```bash
cd backend
source venv/bin/activate  # Linux/macOS
python app.py
```

2. 启动前端：
```bash
cd frontend
npm start
```

3. 在浏览器访问 `http://localhost:3000`

4. 前端通过 `axios` 调用后端 API（`http://localhost:5000/api/*`）

### 同时启动前后端

```bash
cd frontend
npm run dev
```

---

## 依赖版本

### 后端

- Flask==3.0.0（依赖文件中包含，但实际运行使用 http.server）
- Flask-CORS==4.0.0（依赖文件中包含，但实际 CORS 手动实现）
- smtplib（Python 内置，用于邮件发送）

**注意**: 后端实际使用 Python 内置的 `http.server` 模块，不依赖 Flask 框架

### 前端

- react: ^19.2.4
- react-dom: ^19.2.4
- react-scripts: 5.0.1
- axios: ^1.13.3
- bootstrap: ^5.3.8
- chart.js: ^4.5.1
- react-chartjs-2: ^5.3.1
- animate.css: ^4.1.1
- concurrently: ^9.2.1（开发依赖）
- web-vitals: ^2.1.4
- Bootstrap Icons: 5.3.8（图标库，通过 Bootstrap 引入）

### 测试库

- @testing-library/dom: ^10.4.1
- @testing-library/jest-dom: ^6.9.1
- @testing-library/react: ^16.3.2
- @testing-library/user-event: ^13.5.0

---

## 验证规则

### 胶囊数据验证

- 标题：不能为空，1-100 字符
- 内容：不能为空，1-5000 字符
- 开启日期：必须在未来，格式为 ISO 日期字符串
- 心情：必须是预定义的 7 种心情之一
- 图片：必须是允许的格式，大小不超过 10MB

### 用户注册验证

- 用户名：至少 3 个字符
- 密码：至少 6 个字符
- 邮箱：必须包含 @ 符号

### 分类数据验证

- 名称：不能为空
- 颜色：必须是预定义的 10 种颜色之一
- 图标：必须是预定义的 10 种图标之一

---

## 错误处理

### HTTP 状态码

- 200 - 成功
- 201 - 创建成功
- 400 - 请求参数错误
- 401 - 未认证或 token 无效
- 404 - 资源不存在
- 409 - 资源冲突（如用户名已存在）
- 500 - 服务器内部错误

### 错误响应格式

```json
{
  "error": "错误描述",
  "details": ["详细错误信息数组"]
}
```

---

## 浏览器兼容性

### 前端支持

- Chrome: 最新版本（桌面端和移动端）
- Firefox: 最新版本（桌面端和移动端）
- Safari: 最新版本（桌面端和移动端）
- Edge: 最新版本（桌面端）
- 移动浏览器: iOS Safari, Chrome Mobile, Firefox Mobile

不支持 IE 浏览器。

---

## 性能优化

1. **图片缓存**: 上传的图片设置了一年的缓存时间
2. **懒加载**: 组件按需加载
3. **批量操作**: 支持批量删除减少请求次数
4. **虚拟环境**: 后端使用虚拟环境隔离依赖
5. **分类筛选**: 通过分类过滤胶囊，提高查询效率
6. **主题切换**: 使用 CSS 变量实现高效主题切换，无需重新渲染组件
7. **响应式图片**: 适配不同屏幕尺寸的图片显示
8. **CSS 过渡优化**: 使用 GPU 加速的过渡效果

---

## 安全考虑

1. **密码哈希**: 使用 SHA-256 哈希存储密码
2. **Token 安全**: 使用 secrets 模块生成随机 token
3. **会话过期**: Token 有效期限制为 1 年
4. **CORS 配置**: 手动设置 CORS 响应头，限制跨域访问
5. **文件上传验证**: 验证文件类型和大小
6. **SQL 注入防护**: 使用参数化查询
7. **数据隔离**: 用户只能访问自己的数据
8. **会话检测**: 浏览器重新打开时清除登录信息
9. **邮件安全**: 邮件授权码不应提交到版本控制系统
10. **XSS 防护**: React 默认提供 XSS 防护，避免使用 `dangerouslySetInnerHTML`
11. **HTTPS 生产**: 生产环境建议使用 HTTPS 加密传输

---

## 新增功能说明

### 邮件提醒功能（v1.4）

邮件提醒功能允许用户在胶囊开启日期临近时接收邮件通知：

1. **邮件配置**
   - 配置文件：`backend/email_config.py`
   - 支持 QQ 邮箱 SMTP 服务
   - 需要配置发件人邮箱和授权码

2. **提醒机制**
   - 检查脚本：`backend/check_reminders.py`
   - 邮件发送模块：`backend/email_sender.py`
   - 提前 7 天开始检查即将开启的胶囊
   - 每天检查一次，避免重复发送

3. **数据库支持**
   - `capsules` 表新增 `email_sent` 字段
   - 记录是否已发送提醒邮件
   - 避免重复发送同一胶囊的提醒

4. **邮件内容**
   - 美观的 HTML 邮件模板
   - 包含胶囊标题和开启日期
   - 发送给创建胶囊的用户

5. **定时任务设置**
   - Linux/macOS：使用 cron 定时任务
   - Windows：使用任务计划程序
   - 也可以手动运行检查脚本

6. **测试功能**
   - 提供测试脚本 `test_email.py`
   - 方便测试邮件发送功能

#### 配置步骤

1. 编辑 `backend/email_config.py`，配置 QQ 邮箱信息
2. 获取 QQ 邮箱授权码（设置 → 账户 → 生成授权码）
3. 运行测试脚本验证配置：`python test_email.py`
4. 设置定时任务定期运行 `check_reminders.py`

### 主题管理功能（v1.3）

主题管理功能提供亮色和深色两种主题模式：

1. **主题切换**
   - 使用 ThemeContext 管理全局主题状态
   - 支持手动切换亮色/深色模式
   - 自动跟随系统主题偏好

2. **CSS 变量系统**
   - 定义在 `styles/variables.css`
   - 包含完整的颜色变量定义
   - 支持平滑的主题过渡效果

3. **主题持久化**
   - 主题偏好保存在 localStorage
   - 浏览器重启后保持用户选择

4. **组件适配**
   - 所有组件使用 CSS 变量实现主题自适应
   - 卡片、表单、按钮、导航栏等完美适配
   - 滚动条样式也支持主题切换

5. **亮色主题**
   - 白色背景，深色文字
   - 紫色强调色（#667eea）
   - 适合日间使用

6. **深色主题**
   - 深蓝灰色背景，浅色文字
   - 蓝紫色强调色（#818cf8）
   - 适合夜间使用，保护视力

#### 前端实现

- 新增 `contexts/ThemeContext.js` 提供主题状态管理
- `App.js` 包含 ThemeProvider 组件
- `Navbar.js` 添加主题切换按钮
- 所有样式文件使用 CSS 变量

### 移动端适配（v1.3）

移动端适配提供更好的移动设备使用体验：

1. **移动端导航**
   - 新增 `MobileNavbar` 组件
   - 固定在底部的导航栏
   - 包含时间轴、创建、统计、回顾四个快捷入口
   - 使用 Bootstrap Icons 图标

2. **响应式设计**
   - 桌面端（md 及以上）显示顶部导航栏
   - 移动端（md 以下）显示底部导航栏
   - 使用 Bootstrap 响应式工具类

3. **触控优化**
   - 更大的点击区域
   - 更合适的间距和布局
   - 触摸友好的交互反馈

4. **布局调整**
   - 侧边栏在小屏幕上隐藏或折叠
   - 卡片和表单自适应屏幕宽度
   - 优化的字体大小和行高

### 搜索和筛选功能（v1.2）

搜索和筛选功能允许用户快速定位和管理胶囊，提供了以下特性：

1. **多维度搜索**
   - 支持按标题、内容、标签进行搜索
   - 提供全部搜索模式，同时搜索多个字段
   - 大小写不敏感，提升搜索体验
   - 实时过滤，无需点击搜索按钮

2. **状态筛选**
   - 按胶囊状态筛选：全部、已封存、可开启、已开启
   - 状态可视化：使用不同颜色和图标区分状态
   - 显示距离开启日期的倒计时

3. **分类筛选**
   - 支持按特定分类筛选胶囊
   - 左侧边栏展示分类列表
   - 分类与状态、搜索可组合使用

4. **批量操作增强**
   - 支持全选/反选功能
   - 批量删除确认对话框
   - 显示选中胶囊数量

#### 前端组件

- `CapsuleTimeline.js` 增强搜索和筛选逻辑
- 支持多种搜索类型（title、content、tags、all）
- 实时更新过滤结果

#### 数据流

- 前端在内存中进行搜索和筛选
- 后端提供完整的胶囊数据
- 支持多条件组合过滤

### 分类管理功能（v1.1）

分类管理功能允许用户对胶囊进行组织和管理，提供了以下特性：

1. **创建分类**
   - 支持自定义分类名称
   - 提供 10 种预设颜色选择
   - 提供 10 种 Bootstrap Icons 图标选择
   - 每个分类具有唯一性和用户隔离性

2. **管理分类**
   - 查看所有已创建的分类
   - 删除分类时自动处理相关胶囊（变为未分类）
   - 删除操作需用户确认

3. **胶囊分类**
   - 胶囊可关联到特定分类
   - 支持按分类筛选胶囊
   - "全部"选项查看所有胶囊
   - 分类展示使用左侧边栏，提升用户体验

4. **UI/UX 设计**
   - 分类列表显示在时间轴左侧
   - 使用颜色标识不同分类
   - 使用图标增强视觉识别
   - 支持悬停效果和点击反馈

#### API 变更

**新增接口**
- `GET /api/categories` - 获取用户的所有分类
- `POST /api/categories` - 创建新分类
- `DELETE /api/categories/:id` - 删除指定分类

**数据库变更**
- 新增 `categories` 表
- `capsules` 表新增 `category_id` 字段

**前端组件**
- 新增 `CategoryManager.js` 组件
- `App.js` 集成分类选择器
- `CapsuleTimeline.js` 支持分类过滤

---

## 未来规划

1. **胶囊分享**: 生成分享链接供他人查看（在开启日期后）
2. **富文本编辑**: 支持更丰富的文本格式
3. **数据同步**: 支持云端数据备份和同步
4. **导入功能**: 支持从 JSON 文件导入胶囊数据
5. **社交互动**: 支持对已开启胶囊进行评论和点赞
6. **多语言支持**: 支持国际化，提供多语言界面
7. **高级提醒**: 支持多种提醒方式（短信、推送通知等）
8. **胶囊密码**: 为敏感胶囊设置访问密码

---

## 版本历史

### v1.4.0 (2026-01-30)

- ✨ 新增邮件提醒功能
- ✨ 支持胶囊开启日期临近时自动发送邮件通知
- ✨ 添加邮件配置文件和测试脚本
- ✨ 新增 `email_sent` 字段记录邮件发送状态
- ✨ 添加定时检查脚本 `check_reminders.py`
- 📄 新增邮件提醒功能配置说明文档

### v1.3.0 (2026-01-30)

- ✨ 新增深色模式支持
- ✨ 添加主题切换功能（亮色/深色）
- ✨ 使用 CSS 变量实现主题系统
- ✨ 自动跟随系统主题偏好
- ✨ 新增 ThemeContext 全局状态管理
- 🎨 优化所有组件的主题适配
- ✨ 新增移动端底部导航栏
- ✨ 优化移动端用户体验
- 🎨 响应式设计改进

### v1.2.0 (2026-01-29)

- ✨ 新增智能搜索功能（按标题、内容、标签搜索）
- ✨ 新增多条件筛选（状态、分类、搜索组合）
- ✨ 优化批量操作体验（全选/反选）
- 🎨 改进时间轴展示效果
- 🐛 修复搜索结果的实时更新问题

### v1.1.0

- ✨ 新增分类管理功能
- ✨ 支持创建自定义分类（颜色、图标）
- ✨ 胶囊可关联到分类
- ✨ 支持按分类筛选胶囊
- 🎨 优化时间轴布局（左侧分类列表）

### v1.0.0

- 🎉 项目初始发布
- ✨ 用户认证系统（注册、登录、登出）
- ✨ 创建和管理时间胶囊
- ✨ 时间轴展示（封存/可开启/已开启）
- ✨ 心情统计可视化
- ✨ 随机回顾功能
- ✨ 胶囊模板系统
- ✨ 批量删除和数据导出
- ✨ 图片上传支持

---

## 附录

### 常见问题

**Q: 如何备份数据？**

A: 可以通过以下方式备份数据：
1. 直接复制 `backend/time_capsules.db` 数据库文件
2. 使用应用的导出功能将所有胶囊导出为 JSON 文件

**Q: 如何迁移到新服务器？**

A: 迁移步骤：
1. 备份 `backend/time_capsules.db` 数据库文件
2. 备份 `uploads/` 目录中的所有图片
3. 在新服务器上安装相同的环境依赖
4. 将备份的数据库和图片文件恢复到对应位置
5. 重新启动服务

**Q: 邮件提醒不工作怎么办？**

A: 检查步骤：
1. 确认 `backend/email_config.py` 中的邮箱配置正确
2. 确认 QQ 邮箱已开启 SMTP 服务
3. 确认授权码正确（不是 QQ 密码）
4. 运行测试脚本 `python test_email.py` 测试邮件发送
5. 检查定时任务是否正确配置和运行

**Q: 如何修改端口？**

A: 修改端口：
1. 后端端口：修改 `backend/app.py` 中的 `server_address = ('', 5000)`
2. 前端端口：修改 `frontend/.env` 中的 `REACT_APP_API_URL`
3. 前端开发服务器端口：使用环境变量 `PORT=3001 npm start`

**Q: 数据库文件损坏怎么办？**

A: 恢复步骤：
1. 如果有备份，直接恢复备份文件
2. 如果没有备份，可以尝试使用 SQLite 的恢复工具
3. 建议定期备份数据库文件

### 相关链接

- [React 官方文档](https://react.dev/)
- [Bootstrap 5 文档](https://getbootstrap.com/docs/5.3/)
- [Chart.js 文档](https://www.chartjs.org/)
- [Python 文档](https://docs.python.org/3/)
- [SQLite 文档](https://www.sqlite.org/docs.html)

---

<div align="center">

**最后更新：2026-01-30**

**项目版本：v1.4.0**

</div>