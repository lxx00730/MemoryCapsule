@echo off
chcp 65001 >nul
echo Starting Time Capsule Project...

echo Starting backend service...
cd backend
start cmd /k "python app.py"
cd ..

timeout /t 2 /nobreak >nul

echo Starting frontend service...
cd frontend
start cmd /k "npm start"
cd ..

echo.
echo Project started successfully!
echo Frontend: http://localhost:3000
echo Backend: http://localhost:5000
echo.
echo Two command windows will open. Close them to stop services.
pause