# 完全公開モードデプロイガイド

## 📋 概要

このガイドでは、CMSシステムを以下の構成で完全公開モードでデプロイします：
- **フロントエンド**: Vercel（Next.js）
- **バックエンド**: Railway（Spring Boot マイクロサービス）

## 🏗️ アーキテクチャ

```
┌─────────────────┐
│  Vercel         │
│  (Frontend)     │ ──→ HTTPS ──→ ┌─────────────────┐
│  Next.js        │                │  Railway         │
│                 │                │  (API Gateway)   │
└─────────────────┘                └─────────────────┘
                                           │
                                           ├──→ Auth Service
                                           ├──→ Content Service
                                           ├──→ Media Service
                                           └──→ User Service
```

## 🚀 デプロイ手順

### パート1: Railway（バックエンド）のデプロイ

#### ステップ1: Railwayプロジェクトの作成

1. https://railway.app にアクセス
2. "Start a New Project" をクリック
3. GitHubアカウントでログイン
4. "Deploy from GitHub repo" を選択
5. CMSリポジトリを選択

#### ステップ2: PostgreSQLデータベースの作成

各サービス用にPostgreSQLデータベースを作成：

**1. Content Database**
1. "New Service" → "Database" → "Add PostgreSQL" を選択
2. サービス名: `cms-content-db`
3. 接続情報をメモ（後で使用）

**2. Auth Database**（認証サービス用）
1. "New Service" → "Database" → "Add PostgreSQL" を選択
2. サービス名: `cms-auth-db`

**3. User Database**（ユーザーサービス用）
1. "New Service" → "Database" → "Add PostgreSQL" を選択
2. サービス名: `cms-user-db`

**4. Media Database**（メディアサービス用）
1. "New Service" → "Database" → "Add PostgreSQL" を選択
2. サービス名: `cms-media-db`

#### ステップ3: Content Service のデプロイ

1. "New Service" → "GitHub Repo" を選択
2. 同じリポジトリを選択
3. **Settings** タブで以下を設定：
   - **Root Directory**: `services/content-service`
   - **Build Command**: （自動検出、または `./gradlew build -x test`）
   - **Start Command**: `java -jar build/libs/*.jar`

4. **Variables** タブで環境変数を追加：
   ```
   SPRING_DATASOURCE_URL=${{cms-content-db.DATABASE_URL}}
   SPRING_DATASOURCE_USERNAME=${{cms-content-db.PGUSER}}
   SPRING_DATASOURCE_PASSWORD=${{cms-content-db.PGPASSWORD}}
   PORT=8082
   SPRING_PROFILES_ACTIVE=railway
   ```

5. **Settings** → **Networking** → **Generate Domain** をクリック
   - 生成されたURLをメモ（例: `https://content-service-production.up.railway.app`）

6. **Deploy** をクリック

#### ステップ4: Auth Service のデプロイ

1. "New Service" → "GitHub Repo" を選択
2. 同じリポジトリを選択
3. **Settings** タブで以下を設定：
   - **Root Directory**: `services/auth-service`
   - **Start Command**: `java -jar build/libs/*.jar`

4. **Variables** タブで環境変数を追加：
   ```
   SPRING_DATASOURCE_URL=${{cms-auth-db.DATABASE_URL}}
   SPRING_DATASOURCE_USERNAME=${{cms-auth-db.PGUSER}}
   SPRING_DATASOURCE_PASSWORD=${{cms-auth-db.PGPASSWORD}}
   JWT_SECRET=your-production-jwt-secret-key-change-this-min-32-characters-long
   JWT_EXPIRATION=86400000
   JWT_REFRESH_EXPIRATION=604800000
   PORT=8081
   SPRING_PROFILES_ACTIVE=railway
   ```

5. **Settings** → **Networking** → **Generate Domain** をクリック
   - 生成されたURLをメモ

6. **Deploy** をクリック

#### ステップ5: User Service のデプロイ

1. "New Service" → "GitHub Repo" を選択
2. 同じリポジトリを選択
3. **Settings** タブで以下を設定：
   - **Root Directory**: `services/user-service`
   - **Start Command**: `java -jar build/libs/*.jar`

4. **Variables** タブで環境変数を追加：
   ```
   SPRING_DATASOURCE_URL=${{cms-user-db.DATABASE_URL}}
   SPRING_DATASOURCE_USERNAME=${{cms-user-db.PGUSER}}
   SPRING_DATASOURCE_PASSWORD=${{cms-user-db.PGPASSWORD}}
   PORT=8084
   SPRING_PROFILES_ACTIVE=railway
   ```

5. **Settings** → **Networking** → **Generate Domain** をクリック
   - 生成されたURLをメモ

6. **Deploy** をクリック

#### ステップ6: Media Service のデプロイ

1. "New Service" → "GitHub Repo" を選択
2. 同じリポジトリを選択
3. **Settings** タブで以下を設定：
   - **Root Directory**: `services/media-service`
   - **Start Command**: `java -jar build/libs/*.jar`

4. **Variables** タブで環境変数を追加：
   ```
   SPRING_DATASOURCE_URL=${{cms-media-db.DATABASE_URL}}
   SPRING_DATASOURCE_USERNAME=${{cms-media-db.PGUSER}}
   SPRING_DATASOURCE_PASSWORD=${{cms-media-db.PGPASSWORD}}
   PORT=8083
   SPRING_PROFILES_ACTIVE=railway
   ```

5. **Settings** → **Networking** → **Generate Domain** をクリック
   - 生成されたURLをメモ

6. **Deploy** をクリック

#### ステップ7: API Gateway のデプロイ（重要）

1. "New Service" → "GitHub Repo" を選択
2. 同じリポジトリを選択
3. **Settings** タブで以下を設定：
   - **Root Directory**: `services/api-gateway`
   - **Start Command**: `java -jar build/libs/*.jar`

4. **Variables** タブで環境変数を追加：
   ```
   AUTH_SERVICE_URL=https://[auth-service-url].railway.app
   CONTENT_SERVICE_URL=https://[content-service-url].railway.app
   MEDIA_SERVICE_URL=https://[media-service-url].railway.app
   USER_SERVICE_URL=https://[user-service-url].railway.app
   JWT_SECRET=your-production-jwt-secret-key-change-this-min-32-characters-long
   ALLOWED_ORIGINS=*
   PORT=8080
   SPRING_PROFILES_ACTIVE=railway
   ```

   **重要**: 
   - `[auth-service-url]`, `[content-service-url]` などは、各サービスの実際のRailway URLに置き換えてください
   - `ALLOWED_ORIGINS=*` は完全公開モード用です（本番環境では特定のドメインを指定することを推奨）

5. **Settings** → **Networking** → **Generate Domain** をクリック
   - **このURLをメモしてください**（フロントエンドの環境変数で使用します）
   - 例: `https://api-gateway-production.up.railway.app`

6. **Deploy** をクリック

### パート2: Vercel（フロントエンド）のデプロイ

#### ステップ1: Vercelアカウントの作成

1. https://vercel.com にアクセス
2. GitHubアカウントでログイン
3. アカウントを作成

#### ステップ2: プロジェクトのインポート

1. Vercelダッシュボードで **Add New...** → **Project** をクリック
2. GitHubリポジトリを選択（CMSリポジトリ）
3. **Configure Project** で以下を設定：
   - **Framework Preset**: `Next.js`（自動検出）
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`（自動検出）
   - **Output Directory**: `.next`（自動検出）
   - **Install Command**: `npm install`（自動検出）

#### ステップ3: 環境変数の設定

**Environment Variables** セクションで以下を追加：

```
NEXT_PUBLIC_API_BASE_URL=https://[api-gateway-url].railway.app
NODE_ENV=production
```

**重要**: 
- `[api-gateway-url]` は、Railwayで生成したAPI GatewayのURLに置き換えてください
- 例: `NEXT_PUBLIC_API_BASE_URL=https://api-gateway-production.up.railway.app`
- すべての環境（Production, Preview, Development）で有効にしてください

#### ステップ4: デプロイ

1. **Deploy** ボタンをクリック
2. ビルドログを確認
3. デプロイが成功することを確認
4. 生成されたURLをメモ（例: `https://cms-frontend.vercel.app`）

#### ステップ5: CORS設定の更新（Railway）

VercelのURLが生成されたら、RailwayのAPI Gatewayの環境変数を更新：

1. RailwayダッシュボードでAPI Gatewayサービスを開く
2. **Variables** タブを開く
3. `ALLOWED_ORIGINS` を更新：
   ```
   ALLOWED_ORIGINS=https://[your-vercel-url].vercel.app,https://[your-vercel-url]-*.vercel.app
   ```
   または完全公開モードのまま：
   ```
   ALLOWED_ORIGINS=*
   ```

4. **Deploy** をクリックして再デプロイ

## ✅ デプロイ後の確認

### 1. バックエンドサービスの確認

各サービスのヘルスチェック：

```bash
# API Gateway
curl https://[api-gateway-url].railway.app/api/content

# Content Service（直接）
curl https://[content-service-url].railway.app/api/content

# Auth Service（直接）
curl https://[auth-service-url].railway.app/api/auth/health
```

### 2. フロントエンドからの接続確認

1. ブラウザでVercelのURLにアクセス
2. ブラウザの開発者ツール（F12）を開く
3. **Console** タブでエラーがないか確認
4. **Network** タブでAPIリクエストが成功しているか確認

### 3. 機能テスト

1. **ログイン機能**: ユーザー登録・ログインをテスト
2. **コンテンツ管理**: コンテンツの作成・編集・削除をテスト
3. **大学管理**: 大学の登録・編集をテスト

## 🔧 トラブルシューティング

### CORSエラーが発生する場合

1. **RailwayのAPI Gateway**で `ALLOWED_ORIGINS` を確認
2. VercelのURLが正しく設定されているか確認
3. ブラウザのコンソールでエラーメッセージを確認

### API接続エラーが発生する場合

1. **Vercelの環境変数**で `NEXT_PUBLIC_API_BASE_URL` が正しく設定されているか確認
2. RailwayのAPI Gatewayが起動しているか確認
3. 各サービスのログを確認（Railwayダッシュボードの "Logs" タブ）

### ビルドエラーが発生する場合

1. **Vercelのビルドログ**を確認
2. Node.jsバージョンを確認（`package.json` の `engines` を確認）
3. 依存関係の問題がないか確認

### データベース接続エラーが発生する場合

1. **Railwayの環境変数**でデータベース接続情報が正しく設定されているか確認
2. データベースサービスが起動しているか確認
3. 接続文字列の形式を確認

## 📝 環境変数チェックリスト

### Railway（バックエンド）

#### Content Service
- [ ] `SPRING_DATASOURCE_URL=${{cms-content-db.DATABASE_URL}}`
- [ ] `SPRING_DATASOURCE_USERNAME=${{cms-content-db.PGUSER}}`
- [ ] `SPRING_DATASOURCE_PASSWORD=${{cms-content-db.PGPASSWORD}}`
- [ ] `PORT=8082`
- [ ] `SPRING_PROFILES_ACTIVE=railway`

#### API Gateway
- [ ] `AUTH_SERVICE_URL=https://[auth-service-url].railway.app`
- [ ] `CONTENT_SERVICE_URL=https://[content-service-url].railway.app`
- [ ] `MEDIA_SERVICE_URL=https://[media-service-url].railway.app`
- [ ] `USER_SERVICE_URL=https://[user-service-url].railway.app`
- [ ] `JWT_SECRET=your-production-jwt-secret-key`
- [ ] `ALLOWED_ORIGINS=*` または `ALLOWED_ORIGINS=https://[vercel-url].vercel.app`
- [ ] `PORT=8080`
- [ ] `SPRING_PROFILES_ACTIVE=railway`

### Vercel（フロントエンド）

- [ ] `NEXT_PUBLIC_API_BASE_URL=https://[api-gateway-url].railway.app`
- [ ] `NODE_ENV=production`

## 🔒 セキュリティチェックリスト

- [ ] 本番環境用の強力なJWT秘密鍵を使用（32文字以上）
- [ ] データベース接続情報を環境変数で管理
- [ ] CORS設定を適切に制限（本番環境では特定のドメインを指定）
- [ ] HTTPSを使用（VercelとRailwayが自動的に提供）
- [ ] 環境変数に機密情報が含まれていないか確認

## 📚 参考リンク

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Spring Boot on Railway](https://docs.railway.app/guides/deploying-spring-boot)

## 🎯 まとめ

1. **Railwayでバックエンドサービスをデプロイ**
   - PostgreSQLデータベースを作成
   - 各マイクロサービスをデプロイ
   - API Gatewayをデプロイ（公開URLを生成）

2. **Vercelでフロントエンドをデプロイ**
   - プロジェクトをインポート
   - 環境変数を設定（API GatewayのURL）
   - デプロイ

3. **CORS設定を更新**
   - RailwayのAPI GatewayでVercelのURLを許可

4. **動作確認**
   - 各サービスのヘルスチェック
   - フロントエンドからの接続確認
   - 機能テスト

これで完全公開モードでのデプロイが完了です！

