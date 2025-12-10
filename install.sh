#!/bin/bash

echo "🚀 Iniciando instalación del proyecto ToDo App..."
echo ""

# Backend
echo "📦 Instalando dependencias del backend..."
cd ToDo-App-Backend
npm install
echo "✅ Backend listo"
echo ""

# Frontend
echo "📦 Instalando dependencias del frontend..."
cd ../frontend
npm install
echo "✅ Frontend listo"
echo ""

echo "🎉 ¡Instalación completada!"
echo ""
echo "Para arrancar el proyecto:"
echo "1. Backend:  cd ToDo-App-Backend && npm start"
echo "2. Frontend: cd frontend && npm run dev"
