# Railway デプロイ手順 - 完全公開モード

## 概要

CMSプロジェクトをRailwayに完全公開モードでデプロイする手順です。

## 前提条件

- Railwayアカウント（https://railway.app）
- GitHubアカウント（リポジトリにプッシュ済み）
- Railway CLI（オプション）

## デプロイ方法

### 方法1: Railway Web UIを使用（推奨）

#### ステップ1: Railwayアカウントの作成

1. https://railway.app にアクセス
2. "Start a New Project" をクリック
3. GitHubアカウントでログイン

#### ステップ2: プロジェクトの作成

1. "New Project" をクリック
2. "Deploy from GitHub repo" を選択
3. CMSリポジトリを選択

#### ステップ3: PostgreSQLデータベースの作成

各サービス用にPostgreSQLデータベースを作成：

**1. Auth Database**
1. "New Service" → "Database" → "Add PostgreSQL" を選択
2. サービス名: `cms-auth-db`
3. 接続情報をコピー（後で使用）

**2. Content Database**
1. "New Service" → "Database" → "Add PostgreSQL" を選択
2. サービス名: `cms-content-db`
3. 接続情報をコピー

**3. Media Database**
1. "New Service" → "Database" → "Add PostgreSQL" を選択
2. サービス名: `cms-media-db`
3. 接続情報をコピー

**4. User Database**
1. "New Service" → "Database" → "Add PostgreSQL" を選択
2. サービス名: `cms-user-db`
3. 接続情報をコピー

#### ステップ4: バックエンドサービスのデプロイ

**1. Auth Service**

1. "New Service" → "GitHub Repo" を選択
2. 同じリポジトリを選択
3. "Settings" → "Root Directory" を `services/auth-service` に設定
4. "Settings" → "Build Command" を確認（自動検出される）
5. "Settings" → "Start Command" を `java -jar build/libs/*.jar` に設定
6. "Variables" タブで環境変数を追加：
   ```
   SPRING_DATASOURCE_URL=${{cms-auth-db.DATABASE_URL}}
   SPRING_DATASOURCE_USERNAME=${{cms-auth-db.PGUSER}}
   SPRING_DATASOURCE_PASSWORD=${{cms-auth-db.PGPASSWORD}}
   JWT_SECRET=your-production-jwt-secret-key-change-this-in-production-min-32-chars
   JWT_EXPIRATION=86400000
   JWT_REFRESH_EXPIRATION=604800000
   PORT=8081
   ```
7. "Settings" → "Networking" → "Generate Domain" をクリック（公開URLを生成）
8. "Deploy" をクリック

**2. Content Service**

1. "New Service" → "GitHub Repo" を選択
2. 同じリポジトリを選択
3. "Settings" → "Root Directory" を `services/content-service` に設定
4. "Settings" → "Start Command" を `java -jar build/libs/*.jar` に設定
5. "Variables" タブで環境変数を追加：
   ```
   SPRING_DATASOURCE_URL=${{cms-content-db.DATABASE_URL}}
   SPRING_DATASOURCE_USERNAME=${{cms-content-db.PGUSER}}
   SPRING_DATASOURCE_PASSWORD=${{cms-content-db.PGPASSWORD}}
   PORT=8082
   ```
6. "Settings" → "Networking" → "Generate Domain" をクリック
7. "Deploy" をクリック

**3. Media Service**

1. "New Service" → "GitHub Repo" を選択
2. 同じリポジトリを選択
3. "Settings" → "Root Directory" を `services/media-service` に設定
4. "Settings" → "Start Command" を `java -jar build/libs/*.jar` に設定
5. "Variables" タブで環境変数を追加：
   ```
   SPRING_DATASOURCE_URL=${{cms-media-db.DATABASE_URL}}
   SPRING_DATASOURCE_USERNAME=${{cms-media-db.PGUSER}}
   SPRING_DATASOURCE_PASSWORD=${{cms-media-db.PGPASSWORD}}
   AWS_S3_BUCKET=your-s3-bucket-name
   AWS_REGION=ap-northeast-1
   PORT=8083
   ```
6. "Settings" → "Networking" → "Generate Domain" をクリック
7. "Deploy" をクリック

**4. User Service**

1. "New Service" → "GitHub Repo" を選択
2. 同じリポジトリを選択
3. "Settings" → "Root Directory" を `services/user-service` に設定
4. "Settings" → "Start Command" を `java -jar build/libs/*.jar` に設定
5. "Variables" タブで環境変数を追加：
   ```
   SPRING_DATASOURCE_URL=${{cms-user-db.DATABASE_URL}}
   SPRING_DATASOURCE_USERNAME=${{cms-user-db.PGUSER}}
   SPRING_DATASOURCE_PASSWORD=${{cms-user-db.PGPASSWORD}}
   PORT=8084
   ```
6. "Settings" → "Networking" → "Generate Domain" をクリック
7. "Deploy" をクリック

**5. API Gateway**

1. "New Service" → "GitHub Repo" を選択
2. 同じリポジトリを選択
3. "Settings" → "Root Directory" を `services/api-gateway` に設定
4. "Settings" → "Start Command" を `java -jar build/libs/*.jar` に設定
5. "Variables" タブで環境変数を追加：
   ```
   AUTH_SERVICE_URL=${{auth-service.RAILWAY_PUBLIC_DOMAIN}}
   CONTENT_SERVICE_URL=${{content-service.RAILWAY_PUBLIC_DOMAIN}}
   MEDIA_SERVICE_URL=${{media-service.RAILWAY_PUBLIC_DOMAIN}}
   USER_SERVICE_URL=${{user-service.RAILWAY_PUBLIC_DOMAIN}}
   JWT_SECRET=your-production-jwt-secret-key-change-this-in-production-min-32-chars
   ALLOWED_ORIGINS=*
   PORT=8080
   ```
6. "Settings" → "Networking" → "Generate Domain" をクリック（**メインの公開URL**）
7. "Deploy" をクリック

#### ステップ5: フロントエンドのデプロイ

**Next.jsアプリケーションをVercelまたはRailwayにデプロイ**

**オプションA: Railwayにデプロイ**

1. "New Service" → "GitHub Repo" を選択
2. 同じリポジトリを選択
3. "Settings" → "Root Directory" を `frontend` に設定
4. "Settings" → "Build Command" を `npm install && npm run build` に設定
5. "Settings" → "Start Command" を `npm start` に設定
6. "Variables" タブで環境変数を追加：
   ```
   NEXT_PUBLIC_API_BASE_URL=${{api-gateway.RAILWAY_PUBLIC_DOMAIN}}
   NODE_ENV=production
   ```
7. "Settings" → "Networking" → "Generate Domain" をクリック
8. "Deploy" をクリック

**オプションB: Vercelにデプロイ（推奨）**

1. https://vercel.com にアクセス
2. "New Project" をクリック
3. GitHubリポジトリを選択
4. "Root Directory" を `frontend` に設定
5. "Environment Variables" で以下を追加：
   ```
   NEXT_PUBLIC_API_BASE_URL=https://your-api-gateway-url.railway.app
   ```
6. "Deploy" をクリック

### 方法2: Railway CLIを使用

#### ステップ1: Railway CLIのインストール

```bash
npm install -g @railway/cli
```

#### ステップ2: ログイン

```bash
railway login
```

#### ステップ3: プロジェクトの初期化

```bash
cd C:\devlop\cms
railway init
```

#### ステップ4: データベースの作成

```bash
railway add --database postgresql --name cms-auth-db
railway add --database postgresql --name cms-content-db
railway add --database postgresql --name cms-media-db
railway add --database postgresql --name cms-user-db
```

#### ステップ5: サービスのデプロイ

各サービスディレクトリで：

```bash
# Auth Service
cd services/auth-service
railway link
railway variables set SPRING_DATASOURCE_URL=${{cms-auth-db.DATABASE_URL}}
railway variables set JWT_SECRET=your-production-jwt-secret-key
railway up

# Content Service
cd ../content-service
railway link
railway variables set SPRING_DATASOURCE_URL=${{cms-content-db.DATABASE_URL}}
railway up

# 同様に他のサービスもデプロイ
```

## 完全公開モードの設定

### 1. パブリックドメインの生成

各サービスの "Settings" → "Networking" で：
1. "Generate Domain" をクリック
2. パブリックURLが生成される（例: `https://auth-service-production.up.railway.app`）

### 2. CORS設定

API Gatewayの環境変数で：
```
ALLOWED_ORIGINS=*
```
または特定のドメインを指定：
```
ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app,https://your-frontend-domain.railway.app
```

### 3. 環境変数の確認

本番環境用の強力なJWT秘密鍵を使用：
```
JWT_SECRET=your-production-jwt-secret-key-change-this-in-production-min-32-chars
```

## デプロイ後の確認

### 1. サービスヘルスチェック

```bash
# Auth Service
curl https://your-auth-service-url.railway.app/api/auth/health

# Content Service
curl https://your-content-service-url.railway.app/api/content

# API Gateway
curl https://your-api-gateway-url.railway.app/api/auth/health
```

### 2. フロントエンドからの接続確認

1. ブラウザでフロントエンドURLにアクセス
2. ログイン機能をテスト
3. コンテンツ作成機能をテスト

### 3. ログの確認

Railwayダッシュボードの "Logs" タブで各サービスのログを確認

## トラブルシューティング

### ビルドエラー

- Gradleビルドログを確認
- Java 17が使用されているか確認
- 依存関係の確認

### データベース接続エラー

- 環境変数 `SPRING_DATASOURCE_URL` が正しく設定されているか確認
- Railwayのデータベースサービスが起動しているか確認
- 接続文字列の形式を確認

### CORSエラー

- `ALLOWED_ORIGINS` 環境変数を確認
- フロントエンドのURLが許可されているか確認

### ポートエラー

- `PORT` 環境変数を設定（Railwayが自動的に割り当てるポートを使用）
- `application.yml` のポート設定を確認

## セキュリティチェックリスト

- [ ] 本番環境用の強力なJWT秘密鍵を使用
- [ ] データベース接続情報を環境変数で管理
- [ ] CORS設定を適切に制限（必要に応じて）
- [ ] HTTPSを使用（Railwayが自動的に提供）
- [ ] 環境変数に機密情報が含まれていないか確認

## 参考リンク

- [Railway Documentation](https://docs.railway.app)
- [Railway CLI Documentation](https://docs.railway.app/develop/cli)
- [Railway Environment Variables](https://docs.railway.app/develop/variables)



