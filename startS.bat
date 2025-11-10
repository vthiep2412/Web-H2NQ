@echo off
cd server
if errorlevel 1 (
  echo Error: Failed to change to server directory
  exit /b 1
)
npm run dev