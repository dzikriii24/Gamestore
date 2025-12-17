#!/bin/bash

echo "🚀 Starting deployment to Render.com..."

# Build frontend
echo "📦 Building React frontend..."
cd frontend
npm ci
npm run build
cd ..

# Push to GitHub
echo "📤 Pushing to GitHub..."
git add .
git commit -m "Deploy to Render"
git push origin main

echo "✅ Deployment triggered! Check https://dashboard.render.com"
echo "🌐 Frontend: https://game-store-frontend.onrender.com"
echo "🔧 Backend: https://game-store-backend.onrender.com"