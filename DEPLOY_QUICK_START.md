# クイックスタート: 完全公開モードデプロイ

## 🚀 5分でデプロイ

### Railway（バックエンド）のデプロイ

#### 1. Content Service のデプロイ

1. Railwayで "New Service" → "GitHub Repo"
2. **Settings**:
   - Root Directory: `services/content-service`
   - Start Command: `java -jar build/libs/*.jar`
3. **Variables**:
   ```
   SPRING_DATASOURCE_URL=${{cms-content-db.DATABASE_URL}}
   SPRING_DATASOURCE_USERNAME=${{cms-content-db.PGUSER}}
   SPRING_DATASOURCE_PASSWORD=${{cms-content-db.PGPASSWORD}}
   PORT=8082
   SPRING_PROFILES_ACTIVE=railway
   ```
4. **Networking** → "Generate Domain" → URLをコピー

#### 2. API Gateway のデプロイ

1. Railwayで "New Service" → "GitHub Repo"
2. **Settings**:
   - Root Directory: `services/api-gateway`
   - Start Command: `java -jar build/libs/*.jar`
3. **Variables**:
   ```
   AUTH_SERVICE_URL=https://[auth-service-url].railway.app
   CONTENT_SERVICE_URL=https://[content-service-url].railway.app
   MEDIA_SERVICE_URL=https://[media-service-url].railway.app
   USER_SERVICE_URL=https://[user-service-url].railway.app
   JWT_SECRET=your-production-jwt-secret-key-min-32-chars
   ALLOWED_ORIGINS=*
   PORT=8080
   SPRING_PROFILES_ACTIVE=railway
   ```
4. **Networking** → "Generate Domain" → **このURLをコピー**

### Vercel（フロントエンド）のデプロイ

1. Vercelで "Add New Project"
2. GitHubリポジトリを選択
3. **Configure**:
   - Root Directory: `frontend`
   - Framework: Next.js
4. **Environment Variables**:
   ```
   NEXT_PUBLIC_API_BASE_URL=https://[api-gateway-url].railway.app
   ```
5. **Deploy**

### CORS設定の更新

RailwayのAPI Gatewayの環境変数で：
```
ALLOWED_ORIGINS=https://[vercel-url].vercel.app
```
または完全公開モードのまま：
```
ALLOWED_ORIGINS=*
```

## ✅ 確認

1. VercelのURLにアクセス
2. ブラウザの開発者ツール（F12）でエラーを確認
3. ログイン・コンテンツ作成をテスト

詳細は `DEPLOYMENT_GUIDE.md` を参照してください。



