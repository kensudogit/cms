# Railway デプロイ設定ガイド

## 📋 Railwayサービス設定

### Content Service

**Settings**:
- **Root Directory**: `services/content-service`
- **Build Command**: `./gradlew :services:content-service:build -x test`
- **Start Command**: `java -jar -Dserver.port=${PORT:-8082} build/libs/content-service.jar --spring.profiles.active=railway`

**Environment Variables**:
```
PORT=8082
SPRING_PROFILES_ACTIVE=railway
SPRING_DATASOURCE_URL=${{cms-content-db.DATABASE_URL}}
SPRING_DATASOURCE_USERNAME=${{cms-content-db.PGUSER}}
SPRING_DATASOURCE_PASSWORD=${{cms-content-db.PGPASSWORD}}
```

**Networking**:
- **Generate Domain**: 有効化

---

### Auth Service

**Settings**:
- **Root Directory**: `services/auth-service`
- **Build Command**: `./gradlew :services:auth-service:build -x test`
- **Start Command**: `java -jar -Dserver.port=${PORT:-8081} build/libs/auth-service.jar --spring.profiles.active=railway`

**Environment Variables**:
```
PORT=8081
SPRING_PROFILES_ACTIVE=railway
SPRING_DATASOURCE_URL=${{cms-content-db.DATABASE_URL}}
SPRING_DATASOURCE_USERNAME=${{cms-content-db.PGUSER}}
SPRING_DATASOURCE_PASSWORD=${{cms-content-db.PGPASSWORD}}
JWT_SECRET=your-production-jwt-secret-key-min-32-characters-long-change-this-now
JWT_EXPIRATION=86400000
```

**Networking**:
- **Generate Domain**: 有効化

---

### API Gateway

**Settings**:
- **Root Directory**: `services/api-gateway`
- **Build Command**: `./gradlew :services:api-gateway:build -x test`
- **Start Command**: `java -jar -Dserver.port=${PORT:-8080} build/libs/api-gateway.jar --spring.profiles.active=railway`

**Environment Variables**:
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

**重要**: 
- `[auth-service-url]`, `[content-service-url]` などは、各サービスの実際のRailway URLに置き換えてください
- `JWT_SECRET` はAuth Serviceと同じ値を使用してください

**Networking**:
- **Generate Domain**: 有効化（**このURLをメモしてください**）

---

## 📋 Vercel設定

### プロジェクト設定

**Settings**:
- **Root Directory**: `frontend`
- **Framework Preset**: `Next.js`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 環境変数

```
NEXT_PUBLIC_API_BASE_URL=https://[api-gateway-url].railway.app
NODE_ENV=production
```

**重要**: 
- `[api-gateway-url]` は、Railwayで生成したAPI GatewayのURLに置き換えてください
- **すべての環境**（Production, Preview, Development）で有効にしてください

---

## 🔧 デプロイ後の設定

### CORS設定の更新

VercelのURLが生成されたら、RailwayのAPI Gatewayの環境変数を更新：

```
ALLOWED_ORIGINS=https://[your-vercel-url].vercel.app,https://[your-vercel-url]-*.vercel.app
```

または完全公開モードのまま：
```
ALLOWED_ORIGINS=*
```

---

## ✅ 確認事項

### Railway
- [ ] すべてのサービスが正常に起動している
- [ ] 各サービスのパブリックドメインが生成されている
- [ ] 環境変数が正しく設定されている
- [ ] データベース接続が正常

### Vercel
- [ ] デプロイが成功している
- [ ] 環境変数が正しく設定されている
- [ ] フロントエンドURLが生成されている

### 連携
- [ ] CORS設定が正しい
- [ ] フロントエンドからAPI Gatewayに接続できる

