# Railway Dockerコンテナ完全公開デプロイガイド

## 🚀 概要

このガイドでは、Dockerコンテナを使用してRailwayサーバーに完全公開モードでデプロイする手順を説明します。

## 📋 前提条件

1. **Railwayアカウント**
   - https://railway.app でアカウントを作成
   - GitHubアカウントと連携

2. **GitHubリポジトリ**
   - コードがGitHubにプッシュされていること

3. **Railway CLI（オプション）**
   - コマンドラインからデプロイする場合

## 🔧 デプロイ前の準備

### ステップ1: コードのコミットとプッシュ

```bash
cd C:\devlop\cms
git add .
git commit -m "Add Docker support for Railway deployment"
git push origin main
```

### ステップ2: Railwayプロジェクトの作成

1. https://railway.app にアクセス
2. **New Project** → **Deploy from GitHub repo**
3. リポジトリを選択

## 📦 データベースのセットアップ

### ステップ1: PostgreSQLデータベースの作成（4つ）

Railwayダッシュボードで：

1. **New** → **Database** → **Add PostgreSQL**
2. サービス名: `cms-auth-db`
3. 同様に以下も作成：
   - `cms-content-db`
   - `cms-media-db`
   - `cms-user-db`

各データベースの接続情報（`DATABASE_URL`）をメモしておきます。

## 🐳 バックエンドサービスのデプロイ

### ステップ1: Auth Service

1. **New** → **GitHub Repo** → リポジトリを選択
2. **Settings**:
   - **Root Directory**: `services/auth-service`
   - **Build Command**: （Dockerfileを使用するため不要）
   - **Start Command**: （DockerfileのENTRYPOINTを使用）
3. **Variables**:
   ```
   PORT=8081
   SPRING_PROFILES_ACTIVE=railway
   SPRING_DATASOURCE_URL=${{cms-auth-db.DATABASE_URL}}
   SPRING_DATASOURCE_USERNAME=${{cms-auth-db.PGUSER}}
   SPRING_DATASOURCE_PASSWORD=${{cms-auth-db.PGPASSWORD}}
   JWT_SECRET=your-production-jwt-secret-key-min-32-characters-long-change-this
   JWT_EXPIRATION=86400000
   JWT_REFRESH_EXPIRATION=604800000
   ```
4. **Settings** → **Dockerfile Path**: `services/auth-service/Dockerfile`
5. **Settings** → **Deploy** → **Generate Domain** でパブリックドメインを生成

### ステップ2: Content Service

1. **New** → **GitHub Repo** → リポジトリを選択
2. **Settings**:
   - **Root Directory**: `services/content-service`
3. **Variables**:
   ```
   PORT=8082
   SPRING_PROFILES_ACTIVE=railway
   SPRING_DATASOURCE_URL=${{cms-content-db.DATABASE_URL}}
   SPRING_DATASOURCE_USERNAME=${{cms-content-db.PGUSER}}
   SPRING_DATASOURCE_PASSWORD=${{cms-content-db.PGPASSWORD}}
   ```
4. **Settings** → **Dockerfile Path**: `services/content-service/Dockerfile`
5. **Settings** → **Deploy** → **Generate Domain** でパブリックドメインを生成

### ステップ3: API Gateway

1. **New** → **GitHub Repo** → リポジトリを選択
2. **Settings**:
   - **Root Directory**: `services/api-gateway`
3. **Variables**:
   ```
   PORT=8080
   SPRING_PROFILES_ACTIVE=railway
   AUTH_SERVICE_URL=https://[auth-service-domain].railway.app
   CONTENT_SERVICE_URL=https://[content-service-domain].railway.app
   ALLOWED_ORIGINS=*
   JWT_SECRET=your-production-jwt-secret-key-min-32-characters-long-change-this
   ```
   **重要**: `AUTH_SERVICE_URL`と`CONTENT_SERVICE_URL`は、上記で生成した各サービスのパブリックドメインに置き換えてください。
4. **Settings** → **Dockerfile Path**: `services/api-gateway/Dockerfile`
5. **Settings** → **Deploy** → **Generate Domain** でパブリックドメインを生成

## 🌐 フロントエンドのデプロイ

### ステップ1: Next.jsアプリケーション

1. **New** → **GitHub Repo** → リポジトリを選択
2. **Settings**:
   - **Root Directory**: `frontend`
3. **Variables**:
   ```
   NODE_ENV=production
   NEXT_PUBLIC_API_URL=https://[api-gateway-domain].railway.app
   PORT=3000
   ```
   **重要**: `NEXT_PUBLIC_API_URL`は、API Gatewayのパブリックドメインに置き換えてください。
4. **Settings** → **Dockerfile Path**: `frontend/Dockerfile`
5. **Settings** → **Deploy** → **Generate Domain** でパブリックドメインを生成

## 🔓 完全公開モードの設定（重要）

### ステップ1: HTTP認証の無効化

**重要**: RailwayにデプロイしたCMSにアクセスすると、HTTP認証のログインダイアログが表示される場合があります。これを無効化する必要があります。

各サービス（フロントエンド、API Gateway）で：

1. **Settings** → **Networking**
2. **HTTP Authentication** セクションを確認
3. 有効になっている場合は、**Disable** をクリック（またはトグルをオフにする）
4. **Variables**タブで関連する環境変数を削除：
   - `RAILWAY_HTTP_AUTH_USERNAME`
   - `RAILWAY_HTTP_AUTH_PASSWORD`
   - `RAILWAY_HTTP_AUTH_ENABLED`
   - その他`HTTP_AUTH`関連の環境変数

**注意**: 設定を変更した後、ブラウザのキャッシュをクリアして再度アクセスしてください。

### ステップ2: パブリックドメインの確認

各サービスで：

1. **Settings** → **Networking**
2. **Generate Domain** をクリック（まだ生成していない場合）
3. 生成されたドメインをメモ

### ステップ3: CORS設定の確認

API Gatewayの環境変数で：

```
ALLOWED_ORIGINS=*
```

または、特定のドメインのみ許可する場合：

```
ALLOWED_ORIGINS=https://[frontend-domain].railway.app,https://[frontend-domain-2].railway.app
```

## 🔄 サービス間の接続設定

### API Gatewayの環境変数を更新

Auth ServiceとContent Serviceのパブリックドメインが確定したら、API Gatewayの環境変数を更新：

```
AUTH_SERVICE_URL=https://[auth-service-domain].railway.app
CONTENT_SERVICE_URL=https://[content-service-domain].railway.app
```

更新後、API Gatewayを再デプロイしてください。

## ✅ デプロイ後の確認

### ステップ1: サービス起動の確認

各サービスの**Deployments**タブで：

1. ビルドログを確認
2. デプロイが成功していることを確認
3. エラーログがないことを確認

### ステップ2: エンドポイントのテスト

1. **API Gateway**:
   ```
   https://[api-gateway-domain].railway.app/actuator/health
   ```
   期待されるレスポンス: `{"status":"UP"}`

2. **Auth Service**:
   ```
   https://[auth-service-domain].railway.app/actuator/health
   ```

3. **Content Service**:
   ```
   https://[content-service-domain].railway.app/actuator/health
   ```

4. **フロントエンド**:
   ```
   https://[frontend-domain].railway.app
   ```

### ステップ3: ログインのテスト

1. フロントエンドのURLにアクセス
2. ログインページが表示されることを確認
3. 以下でログインを試行：
   - メール: `admin@example.com`
   - パスワード: `password`

## 🆘 トラブルシューティング

### Dockerビルドが失敗する場合

1. **ビルドログを確認**
   - Railwayダッシュボードの**Deployments**タブでログを確認
   - エラーメッセージを確認

2. **Dockerfileのパスを確認**
   - **Settings** → **Dockerfile Path** が正しいか確認
   - ルートディレクトリからの相対パスで指定

3. **ビルドコンテキストを確認**
   - **Settings** → **Root Directory** が正しいか確認

### サービスが起動しない場合

1. **環境変数を確認**
   - すべての必須環境変数が設定されているか確認
   - データベース接続情報が正しいか確認

2. **ログを確認**
   - Railwayダッシュボードの**Deployments**タブでログを確認
   - エラーメッセージを確認

3. **ポート設定を確認**
   - Railwayは自動的に`PORT`環境変数を設定
   - アプリケーションが`PORT`環境変数を使用しているか確認

### CORSエラーが発生する場合

1. **ALLOWED_ORIGINSを確認**
   - API Gatewayの環境変数で`ALLOWED_ORIGINS`が設定されているか確認
   - フロントエンドのドメインが含まれているか確認

2. **application-railway.ymlを確認**
   - CORS設定が正しいか確認

### データベース接続エラーが発生する場合

1. **データベースの状態を確認**
   - Railwayダッシュボードでデータベースが起動しているか確認

2. **接続情報を確認**
   - 環境変数の`SPRING_DATASOURCE_URL`が正しいか確認
   - Railwayのデータベース接続情報を使用しているか確認

3. **ネットワーク設定を確認**
   - データベースとサービスが同じプロジェクト内にあるか確認

## 📝 デプロイチェックリスト

### データベース
- [ ] `cms-auth-db` が作成されている
- [ ] `cms-content-db` が作成されている
- [ ] `cms-media-db` が作成されている
- [ ] `cms-user-db` が作成されている

### バックエンドサービス
- [ ] Auth Serviceがデプロイされている
- [ ] Content Serviceがデプロイされている
- [ ] API Gatewayがデプロイされている
- [ ] すべてのサービスの環境変数が設定されている
- [ ] すべてのサービスが起動している

### フロントエンド
- [ ] フロントエンドがデプロイされている
- [ ] `NEXT_PUBLIC_API_URL`が設定されている
- [ ] フロントエンドが起動している

### 完全公開モード
- [ ] すべてのサービスのHTTP認証が無効化されている
- [ ] すべてのサービスにパブリックドメインが設定されている
- [ ] CORS設定が正しい
- [ ] フロントエンドからAPI Gatewayにアクセスできる
- [ ] ログインが動作する

## 🎯 まとめ

1. **データベースを4つ作成**
2. **バックエンドサービスを3つデプロイ**（Auth Service、Content Service、API Gateway）
3. **フロントエンドをデプロイ**
4. **HTTP認証を無効化**
5. **パブリックドメインを生成**
6. **環境変数を設定**
7. **サービス間の接続を設定**

すべてのステップを完了すれば、Railwayで完全公開モードでDockerコンテナがデプロイされます。

## 📚 参考資料

- [Railway Documentation](https://docs.railway.app/)
- [Railway Docker Guide](https://docs.railway.app/deploy/dockerfiles)
- [Railway Environment Variables](https://docs.railway.app/deploy/environment-variables)

