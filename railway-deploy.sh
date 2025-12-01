#!/bin/bash

# Railway デプロイスクリプト

echo "🚀 Starting Railway deployment..."

# 環境変数の確認
if [ -z "$RAILWAY_TOKEN" ]; then
    echo "❌ RAILWAY_TOKEN is not set. Please run 'railway login' first."
    exit 1
fi

# 各サービスのデプロイ
echo "📦 Deploying Auth Service..."
cd services/auth-service
railway up --service auth-service
cd ../..

echo "📦 Deploying Content Service..."
cd services/content-service
railway up --service content-service
cd ../..

echo "📦 Deploying Media Service..."
cd services/media-service
railway up --service media-service
cd ../..

echo "📦 Deploying User Service..."
cd services/user-service
railway up --service user-service
cd ../..

echo "📦 Deploying API Gateway..."
cd services/api-gateway
railway up --service api-gateway
cd ../..

echo "✅ Deployment completed!"

