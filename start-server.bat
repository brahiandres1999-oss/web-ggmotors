@echo off
echo Starting GG Motors Backend Server...
echo.

cd backend

echo Checking if MongoDB is running...
netstat -ano | findstr :27017 >nul
if %errorlevel% neq 0 (
    echo WARNING: MongoDB doesn't appear to be running on port 27017
    echo Please start MongoDB before running the server
    echo.
)

echo Installing dependencies (if needed)...
npm install

echo.
echo Starting server...
npm run dev

pause