#!/bin/bash

# 时间胶囊项目启动脚本

echo "🚀 启动时间胶囊项目..."

# 检查后端依赖
if [ ! -d "backend/venv" ]; then
    echo "📦 安装后端依赖..."
    cd backend
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    cd ..
fi

# 检查前端依赖
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 安装前端依赖..."
    cd frontend
    npm install
    cd ..
fi

# 启动后端
echo "🔧 启动后端服务..."
cd backend
source venv/bin/activate
python app.py &
BACKEND_PID=$!
cd ..

# 等待后端启动
sleep 2

# 启动前端
echo "🎨 启动前端服务..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ 项目启动成功！"
echo "📱 前端地址: http://localhost:3000"
echo "🔧 后端地址: http://localhost:5000"
echo ""
echo "按 Ctrl+C 停止所有服务"

# 等待用户中断
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
wait