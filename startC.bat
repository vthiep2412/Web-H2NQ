@echo off
cd client
if errorlevel 1 (
  echo Error: Failed to change to client directory
  exit /b 1
)
npm start