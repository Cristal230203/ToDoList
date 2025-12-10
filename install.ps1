# Script para instalar dependencias en Windows PowerShell

Write-Host "🚀 Iniciando instalación del proyecto ToDo App..." -ForegroundColor Green
Write-Host ""

# Backend
Write-Host "📦 Instalando dependencias del backend..." -ForegroundColor Yellow
Set-Location "ToDo-App-Backend"
npm install
Write-Host "✅ Backend listo" -ForegroundColor Green
Write-Host ""

# Frontend
Write-Host "📦 Instalando dependencias del frontend..." -ForegroundColor Yellow
Set-Location "..\frontend"
npm install
Write-Host "✅ Frontend listo" -ForegroundColor Green
Write-Host ""

Write-Host "🎉 ¡Instalación completada!" -ForegroundColor Green
Write-Host ""
Write-Host "Para arrancar el proyecto:" -ForegroundColor Cyan
Write-Host "1. Backend:  cd ToDo-App-Backend ; npm start" -ForegroundColor White
Write-Host "2. Frontend: cd frontend ; npm run dev" -ForegroundColor White
