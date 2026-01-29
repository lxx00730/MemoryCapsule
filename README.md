# 时间胶囊 - 记忆回溯系统

一个让你记录生活中的"时间胶囊"，未来某天开启查看的情感化应用。

## 功能特色

- 🕐 **创建时间胶囊**：设定未来开启日期，添加文字、心情、标签和图片
- 📅 **时间轴展示**：按时间线展示所有胶囊，区分封存/可开启/已开启状态
- 🔓 **记忆回溯**：到达开启日期后，解封胶囊，重现当时的回忆
- 📊 **心情统计**：可视化你的心情变化趋势
- 🎲 **随机回顾**：随机推送一个过去开启的胶囊供你重温
- 🔍 **智能搜索**：支持按标题、内容、标签进行多维度搜索
- 🏷️ **分类管理**：创建自定义分类对胶囊进行组织和管理
- 👤 **用户认证**：支持用户注册、登录、登出功能，数据完全隔离

## 技术栈

### 后端
- Python 3.12+ (http.server)
- SQLite
- 手动实现 CORS 支持

### 前端
- React 19.2.4
- Bootstrap 5.3.8
- Chart.js 4.5.1
- Animate.css 4.1.1
- Axios 1.13.3

## 安装和运行

### 后端

1. 进入后端目录：
```bash
cd backend
```

2. 安装依赖：
```bash
pip install -r requirements.txt
```

3. 运行后端服务：
```bash
python app.py
```

后端将在 http://localhost:5000 运行

### 前端

1. 进入前端目录：
```bash
cd frontend
```

2. 安装依赖：
```bash
npm install
```

3. 运行前端开发服务器：
```bash
npm start
```

前端将在 http://localhost:3000 运行

## 使用说明

1. **创建胶囊**：点击"创建胶囊"，填写标题、内容、选择心情、添加标签和图片，设置开启日期
2. **查看时间轴**：在"时间轴"页面查看所有胶囊，按状态和分类过滤
3. **搜索胶囊**：使用搜索框按标题、内容或标签搜索胶囊
4. **开启胶囊**：当胶囊到达开启日期后，可以点击"解封时间胶囊"查看内容
5. **心情统计**：查看你的心情分布和频率
6. **随机回顾**：随机抽取一个已开启的胶囊重温
7. **分类管理**：创建自定义分类，组织和筛选胶囊
8. **批量操作**：选择多个胶囊进行批量删除或导出

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

这将自动启动后端（端口 5000）和前端（端口 3000）服务。

## 项目结构

```
├── backend/
│   ├── app.py              # 后端主文件（使用 http.server 模块）
│   ├── requirements.txt    # Python 依赖
│   ├── time_capsules.db    # SQLite 数据库（自动生成）
│   └── venv/               # Python 虚拟环境
├── frontend/
│   ├── public/             # 静态资源
│   ├── src/
│   │   ├── components/     # React 组件
│   │   │   ├── Auth.js           # 用户认证组件
│   │   │   ├── Navbar.js         # 导航栏组件
│   │   │   ├── CreateCapsule.js  # 创建胶囊组件
│   │   │   ├── EditCapsule.js    # 编辑胶囊组件
│   │   │   ├── CapsuleTimeline.js# 时间轴展示组件
│   │   │   ├── CapsuleView.js    # 胶囊详情/开启组件
│   │   │   ├── MoodStats.js      # 心情统计组件
│   │   │   ├── RandomReview.js   # 随机回顾组件
│   │   │   ├── TemplateSelector.js # 模板选择器
│   │   │   ├── CategoryManager.js # 分类管理组件
│   │   │   └── Toast.js          # 消息提示组件
│   │   ├── utils/          # 工具函数
│   │   │   └── dateUtils.js      # 日期格式化工具
│   │   ├── styles/         # 全局样式
│   │   ├── App.js          # 主应用组件
│   │   └── index.js        # 入口文件
│   ├── .env                # 环境变量
│   └── package.json        # Node.js 依赖
├── uploads/                # 图片上传目录
├── start.sh                # Linux/macOS 启动脚本
├── start.bat               # Windows 启动脚本
└── AGENTS.md               # 项目上下文文档
```

## 注意事项

- 确保后端服务先启动（端口 5000）
- 图片存储在本地 uploads 目录
- 所有数据保存在 SQLite 数据库中
- 建议定期备份数据库文件