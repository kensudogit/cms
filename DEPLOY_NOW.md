# Railway完全公開デプロイ - クイックスタート

## 🚀 デプロイ手順（簡易版）

### 1. Railwayプロジェクトの作成

1. https://railway.app にアクセス
2. "Start a New Project" → "Deploy from GitHub repo"
3. CMSリポジトリを選択

### 2. データベースの作成（4つ）

各サービス用にPostgreSQLデータベースを作成：

```
New → Database → Add PostgreSQL
```

- `cms-auth-db`
- `cms-content-db`
- `cms-media-db`
- `cms-user-db`

### 3. バックエンドサービスのデプロイ（5つ）

#### Auth Service
```
New → GitHub Repo → 同じリポジトリ
Settings:
  Root Directory: services/auth-service
  Start Command: java -jar build/libs/auth-service.jar
Variables:
  SPRING_DATASOURCE_URL=${{cms-auth-db.DATABASE_URL}}
  SPRING_DATASOURCE_USERNAME=${{cms-auth-db.PGUSER}}
  SPRING_DATASOURCE_PASSWORD=${{cms-auth-db.PGPASSWORD}}
  JWT_SECRET=your-production-jwt-secret-key-min-32-characters-long
  PORT=8081
Networking: Generate Domain
```

#### Content Service
```
New → GitHub Repo → 同じリポジトリ
Settings:
  Root Directory: services/content-service
  Start Command: java -jar build/libs/content-service.jar
Variables:
  SPRING_DATASOURCE_URL=${{cms-content-db.DATABASE_URL}}
  SPRING_DATASOURCE_USERNAME=${{cms-content-db.PGUSER}}
  SPRING_DATASOURCE_PASSWORD=${{cms-content-db.PGPASSWORD}}
  PORT=8082
Networking: Generate Domain
```

#### Media Service
```
New → GitHub Repo → 同じリポジトリ
Settings:
  Root Directory: services/media-service
  Start Command: java -jar build/libs/media-service.jar
Variables:
  SPRING_DATASOURCE_URL=${{cms-media-db.DATABASE_URL}}
  SPRING_DATASOURCE_USERNAME=${{cms-media-db.PGUSER}}
  SPRING_DATASOURCE_PASSWORD=${{cms-media-db.PGPASSWORD}}
  PORT=8083
Networking: Generate Domain
```

#### User Service
```
New → GitHub Repo → 同じリポジトリ
Settings:
  Root Directory: services/user-service
  Start Command: java -jar build/libs/user-service.jar
Variables:
  SPRING_DATASOURCE_URL=${{cms-user-db.DATABASE_URL}}
  SPRING_DATASOURCE_USERNAME=${{cms-user-db.PGUSER}}
  SPRING_DATASOURCE_PASSWORD=${{cms-user-db.PGPASSWORD}}
  PORT=8084
Networking: Generate Domain
```

#### API Gateway（重要）
```
New → GitHub Repo → 同じリポジトリ
Settings:
  Root Directory: services/api-gateway
  Start Command: java -jar build/libs/api-gateway.jar
Variables:
  AUTH_SERVICE_URL=https://auth-service-production.up.railway.app
  CONTENT_SERVICE_URL=https://content-service-production.up.railway.app
  MEDIA_SERVICE_URL=https://media-service-production.up.railway.app
  USER_SERVICE_URL=https://user-service-production.up.railway.app
  JWT_SECRET=your-production-jwt-secret-key-min-32-characters-long
  ALLOWED_ORIGINS=*
  PORT=8080
Networking: Generate Domain（メイン公開URL）
```

**注意**: 上記のURLは実際のデプロイ後に生成されたURLに置き換えてください。

### 4. フロントエンドのデプロイ

```
New → GitHub Repo → 同じリポジトリ
Settings:
  Root Directory: frontend
  Build Command: npm install && npm run build
  Start Command: npm start
Variables:
  NEXT_PUBLIC_API_BASE_URL=https://your-api-gateway-url.railway.app
  NODE_ENV=production
  PORT=3000
Networking: Generate Domain（フロントエンド公開URL）
```

## ⚠️ 重要な注意事項

1. **JWT_SECRET**: 本番環境用の強力な秘密鍵（32文字以上）を使用してください
2. **URLの置き換え**: API Gatewayの環境変数で、各サービスの実際のURLに置き換えてください
3. **CORS設定**: `ALLOWED_ORIGINS=*` で完全公開モードになります
4. **デプロイ順序**: データベース → バックエンドサービス → API Gateway → フロントエンドの順でデプロイしてください

## ✅ デプロイ後の確認

1. 各サービスのログを確認
2. フロントエンドからAPIに接続できるか確認
3. コンテンツ作成機能をテスト

詳細は `RAILWAY_DEPLOY_COMPLETE.md` を参照してください。

