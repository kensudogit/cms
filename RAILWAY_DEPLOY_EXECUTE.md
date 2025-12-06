# Railway完全公開デプロイ - 実行手順

## 🚀 デプロイ方法

### 方法1: Railway Web UIを使用（推奨）

詳細な手順は `DEPLOY_TO_RAILWAY_NOW.md` を参照してください。

### 方法2: Railway CLIを使用

#### ステップ1: ログイン確認

```bash
cd C:\devlop\cms
railway login
```

#### ステップ2: プロジェクトの初期化

```bash
railway init
```

既存のプロジェクトがある場合：
```bash
railway link
```

#### ステップ3: データベースの作成

```bash
# Auth Database
railway add --database postgresql --name cms-auth-db

# Content Database
railway add --database postgresql --name cms-content-db

# Media Database
railway add --database postgresql --name cms-media-db

# User Database
railway add --database postgresql --name cms-user-db
```

#### ステップ4: サービスのデプロイ

各サービスディレクトリで実行：

**Auth Service:**
```bash
cd services/auth-service
railway link
railway variables set SPRING_DATASOURCE_URL=${{cms-auth-db.DATABASE_URL}}
railway variables set SPRING_DATASOURCE_USERNAME=${{cms-auth-db.PGUSER}}
railway variables set SPRING_DATASOURCE_PASSWORD=${{cms-auth-db.PGPASSWORD}}
railway variables set JWT_SECRET=your-production-jwt-secret-key-min-32-characters-long
railway variables set PORT=8081
railway up
```

**Content Service:**
```bash
cd ../content-service
railway link
railway variables set SPRING_DATASOURCE_URL=${{cms-content-db.DATABASE_URL}}
railway variables set SPRING_DATASOURCE_USERNAME=${{cms-content-db.PGUSER}}
railway variables set SPRING_DATASOURCE_PASSWORD=${{cms-content-db.PGPASSWORD}}
railway variables set PORT=8082
railway up
```

**Media Service:**
```bash
cd ../media-service
railway link
railway variables set SPRING_DATASOURCE_URL=${{cms-media-db.DATABASE_URL}}
railway variables set SPRING_DATASOURCE_USERNAME=${{cms-media-db.PGUSER}}
railway variables set SPRING_DATASOURCE_PASSWORD=${{cms-media-db.PGPASSWORD}}
railway variables set PORT=8083
railway up
```

**User Service:**
```bash
cd ../user-service
railway link
railway variables set SPRING_DATASOURCE_URL=${{cms-user-db.DATABASE_URL}}
railway variables set SPRING_DATASOURCE_USERNAME=${{cms-user-db.PGUSER}}
railway variables set SPRING_DATASOURCE_PASSWORD=${{cms-user-db.PGPASSWORD}}
railway variables set PORT=8084
railway up
```

**API Gateway:**
```bash
cd ../api-gateway
railway link
railway variables set AUTH_SERVICE_URL=https://auth-service-url.railway.app
railway variables set CONTENT_SERVICE_URL=https://content-service-url.railway.app
railway variables set MEDIA_SERVICE_URL=https://media-service-url.railway.app
railway variables set USER_SERVICE_URL=https://user-service-url.railway.app
railway variables set JWT_SECRET=your-production-jwt-secret-key-min-32-characters-long
railway variables set ALLOWED_ORIGINS=*
railway variables set PORT=8080
railway up
```

**Frontend:**
```bash
cd ../../frontend
railway link
railway variables set NEXT_PUBLIC_API_BASE_URL=https://api-gateway-url.railway.app
railway variables set NODE_ENV=production
railway variables set PORT=3000
railway up
```

## ⚠️ 重要な設定

### HTTP認証の無効化

フロントエンドサービスの **Settings** → **HTTP Authentication** で：
- **"Enable HTTP Authentication"** を **OFF** にする

または、Railway CLIで：
```bash
railway variables unset RAILWAY_HTTP_AUTH_USERNAME
railway variables unset RAILWAY_HTTP_AUTH_PASSWORD
railway variables unset HTTP_AUTH_ENABLED
```

## 📋 デプロイチェックリスト

- [ ] Railway CLIにログイン
- [ ] プロジェクトを初期化またはリンク
- [ ] データベース（4つ）を作成
- [ ] Auth Serviceをデプロイ
- [ ] Content Serviceをデプロイ
- [ ] Media Serviceをデプロイ
- [ ] User Serviceをデプロイ
- [ ] API Gatewayをデプロイ（URLを記録）
- [ ] フロントエンドをデプロイ（API Gateway URLを設定）
- [ ] フロントエンドのHTTP認証を無効化
- [ ] すべてのサービスのデプロイメントが "Active" になっている
- [ ] ブラウザでフロントエンドにアクセス
- [ ] ログインページが表示される

