# 🚀 デプロイ開始ガイド

このガイドに従って、**今すぐデプロイを開始**してください。

## ⚡ クイックスタート（5分）

### 1. Railwayでバックエンドをデプロイ（3分）

1. **Railwayにアクセス**: https://railway.app
2. **プロジェクトを作成**: "New Project" → "Deploy from GitHub repo"
3. **データベースを作成**: "New" → "Database" → "Add PostgreSQL"（名前: `cms-content-db`）
4. **Content Serviceをデプロイ**:
   - "New" → "GitHub Repo"
   - Root Directory: `services/content-service`
   - Build Command: `./gradlew :services:content-service:build -x test`
   - Start Command: `java -jar -Dserver.port=${PORT:-8082} build/libs/content-service.jar --spring.profiles.active=railway`
   - Variables:
     ```
     PORT=8082
     SPRING_PROFILES_ACTIVE=railway
     SPRING_DATASOURCE_URL=${{cms-content-db.DATABASE_URL}}
     SPRING_DATASOURCE_USERNAME=${{cms-content-db.PGUSER}}
     SPRING_DATASOURCE_PASSWORD=${{cms-content-db.PGPASSWORD}}
     ```
   - Generate Domain → URLをメモ

5. **Auth Serviceをデプロイ**:
   - "New" → "GitHub Repo"
   - Root Directory: `services/auth-service`
   - Build Command: `./gradlew :services:auth-service:build -x test`
   - Start Command: `java -jar -Dserver.port=${PORT:-8081} build/libs/auth-service.jar --spring.profiles.active=railway`
   - Variables:
     ```
     PORT=8081
     SPRING_PROFILES_ACTIVE=railway
     SPRING_DATASOURCE_URL=${{cms-content-db.DATABASE_URL}}
     SPRING_DATASOURCE_USERNAME=${{cms-content-db.PGUSER}}
     SPRING_DATASOURCE_PASSWORD=${{cms-content-db.PGPASSWORD}}
     JWT_SECRET=your-production-jwt-secret-key-min-32-characters-long-change-this-now
     JWT_EXPIRATION=86400000
     ```
   - Generate Domain → URLをメモ

6. **API Gatewayをデプロイ**:
   - "New" → "GitHub Repo"
   - Root Directory: `services/api-gateway`
   - Build Command: `./gradlew :services:api-gateway:build -x test`
   - Start Command: `java -jar -Dserver.port=${PORT:-8080} build/libs/api-gateway.jar --spring.profiles.active=railway`
   - Variables:
     ```
     PORT=8080
     SPRING_PROFILES_ACTIVE=railway
     AUTH_SERVICE_URL=https://[auth-service-url].railway.app
     CONTENT_SERVICE_URL=https://[content-service-url].railway.app
     MEDIA_SERVICE_URL=https://[media-service-url].railway.app
     USER_SERVICE_URL=https://[user-service-url].railway.app
     JWT_SECRET=your-production-jwt-secret-key-min-32-characters-long-change-this-now
     ALLOWED_ORIGINS=*
     ```
   - Generate Domain → **このURLをメモ**（フロントエンドで使用）

### 2. Vercelでフロントエンドをデプロイ（2分）

1. **Vercelにアクセス**: https://vercel.com
2. **プロジェクトを作成**: "Add New..." → "Project"
3. **リポジトリを選択**: CMSリポジトリ
4. **設定**:
   - Root Directory: `frontend`
   - Framework: Next.js（自動検出）
5. **環境変数を設定**:
   ```
   NEXT_PUBLIC_API_BASE_URL=https://[api-gateway-url].railway.app
   NODE_ENV=production
   ```
   （`[api-gateway-url]` はRailwayでメモしたURL）
6. **Deploy** をクリック

### 3. CORS設定の更新（1分）

1. RailwayでAPI Gatewayサービスを開く
2. Variablesタブで `ALLOWED_ORIGINS` を更新:
   ```
   ALLOWED_ORIGINS=https://[your-vercel-url].vercel.app,https://[your-vercel-url]-*.vercel.app
   ```
3. Deployをクリック

---

## 📚 詳細ガイド

より詳細な手順が必要な場合は、以下のドキュメントを参照してください：

- **[DEPLOY_EXECUTE.md](./DEPLOY_EXECUTE.md)** - 詳細な実行手順
- **[DEPLOY_NOW.md](./DEPLOY_NOW.md)** - ステップバイステップガイド
- **[RAILWAY_DEPLOY_CONFIG.md](./RAILWAY_DEPLOY_CONFIG.md)** - Railway設定詳細

---

## ✅ デプロイ完了後の確認

1. **バックエンド**: Railwayダッシュボードで各サービスが "Running" になっているか確認
2. **フロントエンド**: Vercelダッシュボードでデプロイが成功しているか確認
3. **動作確認**: ブラウザでVercelのURLにアクセスして動作を確認

---

## 🆘 問題が発生した場合

- **ビルドエラー**: ログを確認してエラーメッセージを特定
- **接続エラー**: 環境変数が正しく設定されているか確認
- **CORSエラー**: `ALLOWED_ORIGINS` を確認

詳細は [DEPLOY_EXECUTE.md](./DEPLOY_EXECUTE.md) のトラブルシューティングセクションを参照してください。

---

**それでは、デプロイを開始してください！** 🚀

