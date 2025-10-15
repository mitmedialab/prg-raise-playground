@echo off
setlocal
cd /d "%~dp0"
echo [setup-demo] Installing demo dependencies...
cd demo
npm ci --no-audit --no-fund
if %errorlevel% neq 0 (
  echo [setup-demo] npm ci failed. Ensure Node.js and npm are installed.
  exit /b %errorlevel%
)
echo [setup-demo] Done.

