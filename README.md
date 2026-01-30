# 时间胶囊 - 记忆回溯系统

<div align="center">

![Version](https://img.shields.io/badge/version-1.4.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Python](https://img.shields.io/badge/python-3.12+-blue.svg)
![React](https://img.shields.io/badge/react-19.2.4-blue.svg)

一个让你记录生活中的"时间胶囊"，未来某天开启查看的情感化应用。

[功能特色](#功能特色) • [快速开始](#快速开始) • [使用说明](#使用说明) • [技术栈](#技术栈) • [项目结构](#项目结构)

</div>

---

## 功能特色

### 核心功能

- 🕐 **创建时间胶囊** - 设定未来开启日期，添加文字、心情、标签和图片
- 📅 **时间轴展示** - 按时间线展示所有胶囊，区分封存/可开启/已开启状态
- 🔓 **记忆回溯** - 到达开启日期后，解封胶囊，重现当时的回忆
- 📊 **心情统计** - 可视化你的心情变化趋势
- 🎲 **随机回顾** - 随机推送一个过去开启的胶囊供你重温

### 高级功能

- 🔍 **智能搜索** - 支持按标题、内容、标签进行多维度搜索
- 🏷️ **分类管理** - 创建自定义分类对胶囊进行组织和管理
- 📝 **胶囊模板** - 提供 12 种预设模板快速创建胶囊
- ✏️ **编辑胶囊** - 修改已创建但未开启的胶囊内容
- 🗑️ **批量操作** - 支持选择多个胶囊批量删除
- 📤 **数据导出** - 将所有胶囊导出为 JSON 文件备份

### 用户体验

- 👤 **用户认证** - 支持用户注册、登录、登出功能，数据完全隔离
- 🌙 **深色模式** - 支持亮色/深色主题切换，自动跟随系统偏好
- 📱 **移动端适配** - 移动端底部导航栏，优化的移动端体验
- 🔔 **消息提示** - 统一的 Toast 消息提示组件
- 📧 **邮件提醒** - 胶囊开启日期临近时自动发送邮件提醒

---

## 快速开始

### 环境要求

- **Python**: 3.12 或更高版本
- **Node.js**: 14.0 或更高版本
- **npm**: 6.0 或更高版本

### 一键启动（推荐）

#### Linux/macOS

```bash
# 克隆项目
git clone https://github.com/lxx00730/MemoryCapsule.git
cd MemoryCapsule

# 运行启动脚本
./start.sh
```

#### Windows

```bash
# 克隆项目
git clone https://github.com/lxx00730/MemoryCapsule.git
cd MemoryCapsule

# 运行启动脚本
start.bat
```

启动脚本会自动：
1. 检查并创建 Python 虚拟环境
2. 安装后端依赖
3. 安装前端依赖
4. 启动后端服务（端口 5000）
5. 启动前端服务（端口 3000）

### 手动启动

#### 1. 启动后端

```bash
# 进入后端目录
cd backend

# 创建虚拟环境（首次运行）
python3 -m venv venv

# 激活虚拟环境
# Linux/macOS:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt

# 启动后端服务
python app.py
```

后端服务将在 `http://localhost:5000` 运行。

#### 2. 启动前端

```bash
# 打开新的终端窗口，进入前端目录
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm start
```

前端应用将在 `http://localhost:3000` 运行。

#### 3. 同时启动前后端（开发模式）

```bash
cd frontend
npm run dev
```

---

## 使用说明

### 1. 用户注册和登录

首次使用需要注册账号：
- 点击"注册"按钮
- 填写用户名（至少 3 个字符）、密码（至少 6 个字符）和邮箱
- 点击"登录"按钮使用注册的账号登录

### 2. 创建时间胶囊

点击"创建胶囊"按钮，填写以下信息：
- **标题** - 胶囊的标题（1-100 字符）
- **内容** - 胶囊的详细内容（1-5000 字符）
- **心情** - 选择当时的心情（开心、兴奋、平静、怀念、充满希望、焦虑、悲伤）
- **标签** - 添加相关标签（可选）
- **分类** - 选择或创建分类（可选）
- **开启日期** - 设定未来开启的日期
- **图片** - 上传相关图片（可选，支持 png、jpg、jpeg、gif、webp，最大 10MB）

**快速创建**：使用预设模板（新年目标、毕业纪念、生日愿望、旅行日记等）快速创建胶囊。

### 3. 查看时间轴

在"时间轴"页面查看所有胶囊：
- 按状态筛选：全部、已封存、可开启、已开启
- 按分类筛选：选择特定分类查看胶囊
- 搜索功能：按标题、内容、标签搜索胶囊
- 批量操作：选择多个胶囊进行批量删除或导出

### 4. 解封时间胶囊

当胶囊到达开启日期后：
- 胶囊状态变为"可开启"
- 点击"解封时间胶囊"按钮查看内容
- 系统记录开启时间

### 5. 心情统计

在"统计"页面查看：
- 心情分布饼图
- 各心情的统计数量
- 心情趋势分析

### 6. 随机回顾

在"回顾"页面：
- 随机抽取一个已开启的胶囊
- 重温过去的回忆

### 7. 分类管理

创建和管理自定义分类：
- 设置分类名称、颜色和图标
- 将胶囊分配到不同分类
- 按分类筛选和查看胶囊

### 8. 深色模式

- 点击导航栏的主题切换按钮
- 在亮色和深色模式之间切换
- 系统自动跟随系统主题偏好

### 9. 邮件提醒

配置邮件提醒功能（可选）：
- 编辑 `backend/email_config.py` 配置 QQ 邮箱
- 设置定时任务定期检查即将开启的胶囊
- 提前 7 天收到邮件提醒

详细配置请参考 [邮件提醒功能配置说明](./邮件提醒功能配置说明.md)

---

## 技术栈

### 后端

- **语言**: Python 3.12+
- **框架**: Python 内置 `http.server` 模块
- **数据库**: SQLite
- **邮件**: QQ 邮箱 SMTP 服务
- **跨域**: 手动实现 CORS

### 前端

- **框架**: React 19.2.4
- **构建工具**: Create React App 5.0.1
- **UI 框架**: Bootstrap 5.3.8
- **图标**: Bootstrap Icons
- **图表**: Chart.js 4.5.1 + react-chartjs-2 5.3.1
- **动画**: Animate.css 4.1.1
- **HTTP**: Axios 1.13.3

---

## 项目结构

```
MemoryCapsule/
├── backend/                    # 后端目录
│   ├── app.py                  # 后端主文件（http.server）
│   ├── requirements.txt        # Python 依赖
│   ├── email_config.py         # 邮件配置
│   ├── email_sender.py         # 邮件发送模块
│   ├── check_reminders.py      # 定时检查脚本
│   ├── test_email.py           # 邮件测试脚本
│   ├── time_capsules.db        # SQLite 数据库
│   └── venv/                   # Python 虚拟环境
├── frontend/                   # 前端目录
│   ├── public/                 # 静态资源
│   ├── src/
│   │   ├── components/         # React 组件
│   │   │   ├── Auth.js         # 用户认证
│   │   │   ├── Navbar.js       # 桌面导航栏
│   │   │   ├── MobileNavbar.js # 移动导航栏
│   │   │   ├── CreateCapsule.js    # 创建胶囊
│   │   │   ├── EditCapsule.js      # 编辑胶囊
│   │   │   ├── CapsuleTimeline.js  # 时间轴
│   │   │   ├── CapsuleView.js      # 胶囊详情
│   │   │   ├── MoodStats.js        # 心情统计
│   │   │   ├── RandomReview.js     # 随机回顾
│   │   │   ├── TemplateSelector.js # 模板选择
│   │   │   ├── CategoryManager.js  # 分类管理
│   │   │   └── Toast.js            # 消息提示
│   │   ├── contexts/           # React Context
│   │   │   └── ThemeContext.js # 主题管理
│   │   ├── utils/              # 工具函数
│   │   │   └── dateUtils.js    # 日期工具
│   │   ├── styles/             # 全局样式
│   │   │   ├── App.css         # 应用样式
│   │   │   └── variables.css   # CSS 变量
│   │   ├── App.js              # 主应用组件
│   │   └── index.js            # 入口文件
│   ├── package.json            # Node.js 依赖
│   └── .env                    # 环境变量
├── uploads/                    # 图片上传目录
├── start.sh                    # Linux/macOS 启动脚本
├── start.bat                   # Windows 启动脚本
├── AGENTS.md                   # 项目上下文文档
├── README.md                   # 项目说明文档
└── 邮件提醒功能配置说明.md      # 邮件配置文档
```

---

## API 接口

### 认证相关

- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/logout` - 用户登出
- `GET /api/auth/me` - 获取当前用户信息

### 胶囊相关

- `GET /api/capsules` - 获取所有胶囊
- `GET /api/capsules/:id` - 获取单个胶囊
- `POST /api/capsules` - 创建胶囊
- `PUT /api/capsules/:id` - 更新胶囊
- `POST /api/capsules/:id/open` - 开启胶囊
- `GET /api/capsules/random` - 随机回顾
- `POST /api/capsules/batch` - 批量删除
- `POST /api/capsules/export` - 导出胶囊
- `DELETE /api/capsules/:id` - 删除胶囊

### 分类相关

- `GET /api/categories` - 获取所有分类
- `POST /api/categories` - 创建分类
- `DELETE /api/categories/:id` - 删除分类

### 其他

- `GET /api/templates` - 获取所有模板
- `GET /api/stats/mood` - 心情统计
- `POST /api/upload` - 上传图片

详细的 API 文档请参考 [AGENTS.md](./AGENTS.md)

---

## 注意事项

1. **启动顺序** - 必须先启动后端服务（端口 5000），再启动前端服务（端口 3000）
2. **数据库** - SQLite 数据库文件 `time_capsules.db` 会在首次运行时自动创建
3. **图片存储** - 所有上传的图片保存在 `uploads/` 目录，请确保该目录有写入权限
4. **数据备份** - 建议定期备份 `time_capsules.db` 数据库文件
5. **邮件配置** - 使用邮件提醒功能需要配置 QQ 邮箱授权码
6. **端口冲突** - 如果端口 5000 或 3000 被占用，需要修改相应的配置

---

## 版本历史

### v1.4.0 (2026-01-30)

- ✨ 新增邮件提醒功能
- ✨ 支持胶囊开启日期临近时自动发送邮件通知
- ✨ 添加邮件配置文件和测试脚本
- ✨ 新增 `email_sent` 字段记录邮件发送状态
- 📄 新增邮件提醒功能配置说明文档

### v1.3.0 (2026-01-30)

- ✨ 新增深色模式支持
- ✨ 添加主题切换功能（亮色/深色）
- ✨ 使用 CSS 变量实现主题系统
- ✨ 自动跟随系统主题偏好
- ✨ 新增移动端底部导航栏
- ✨ 优化移动端用户体验
- 🎨 响应式设计改进

### v1.2.0 (2026-01-29)

- ✨ 新增智能搜索功能（按标题、内容、标签搜索）
- ✨ 新增多条件筛选（状态、分类、搜索组合）
- ✨ 优化批量操作体验（全选/反选）
- 🎨 改进时间轴展示效果

### v1.1.0

- ✨ 新增分类管理功能
- ✨ 支持创建自定义分类（颜色、图标）
- ✨ 胶囊可关联到分类
- ✨ 支持按分类筛选胶囊

### v1.0.0

- 🎉 项目初始发布
- ✨ 用户认证系统
- ✨ 创建和管理时间胶囊
- ✨ 时间轴展示
- ✨ 心情统计可视化
- ✨ 随机回顾功能
- ✨ 胶囊模板系统
- ✨ 批量删除和数据导出
- ✨ 图片上传支持

---

## 许可证

MIT License

---

## 贡献

欢迎提交 Issue 和 Pull Request！

---

## 联系方式

- 项目地址: https://github.com/lxx00730/MemoryCapsule
- 问题反馈: https://github.com/lxx00730/MemoryCapsule/issues

---

<div align="center">

**如果这个项目对你有帮助，请给一个 ⭐️ Star 支持一下！**

Made with ❤️ by MemoryCapsule Team

</div>