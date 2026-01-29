@echo off
chcp 65001 >nul
echo Testing Email Reminder Function...

cd backend
python test_email.py

echo.
echo Test completed.
pause