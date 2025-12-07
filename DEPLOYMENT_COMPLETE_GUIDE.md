# 完全デプロイメントガイド

## 📋 概要

このガイドでは、フロントエンドをVercelに、バックエンドをRailwayにデプロイする手順を説明します。

## 🚀 デプロイメント手順

### 1. フロントエンド（Vercel）のデプロイ

#### 1.1 Vercelアカウントの準備
1. [Vercel](https://vercel.com)にアクセス
2. GitHubアカウントでログイン
3. 新しいプロジェクトを作成

#### 1.2 プロジェクトのインポート
1. Vercelダッシュボードで「Add New Project」をクリック
2. GitHubリポジトリを選択
3. プロジェクト設定：
   - **Root Directory**: `frontend`
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

#### 1.3 環境変数の設定
Vercelダッシュボードで以下の環境変数を設定：

```
NEXT_PUBLIC_API_BASE_URL=https://your-api-gateway-url.railway.app
NODE_ENV=production
```

#### 1.4 デプロイ
1. 「Deploy」ボタンをクリック
2. デプロイが完了するまで待機（通常2-3分）
3. デプロイ完了後、Vercelから提供されるURLを確認

### 2. バックエンド（Railway）のデプロイ

#### 2.1 Railwayアカウントの準備
1. [Railway](https://railway.app)にアクセス
2. GitHubアカウントでログイン
3. 新しいプロジェクトを作成

#### 2.2 PostgreSQLデータベースの作成
1. Railwayダッシュボードで「New」→「Database」→「Add PostgreSQL」を選択
2. データベースが作成されるまで待機
3. データベースの接続情報をメモ：
   - `PGHOST`
   - `PGPORT`
   - `PGDATABASE`
   - `PGUSER`
   - `PGPASSWORD`
   - `DATABASE_URL`

#### 2.3 各マイクロサービスのデプロイ

##### 2.3.1 API Gateway のデプロイ
1. Railwayダッシュボードで「New」→「GitHub Repo」を選択
2. リポジトリを選択
3. サービス設定：
   - **Root Directory**: `services/api-gateway`
   - **Build Command**: `./gradlew :services:api-gateway:build -x test`
   - **Start Command**: `java -jar -Dserver.port=${PORT:-8080} build/libs/api-gateway.jar --spring.profiles.active=railway`
4. 環境変数の設定：
   ```
   PORT=8080
   SPRING_PROFILES_ACTIVE=railway
   AUTH_SERVICE_URL=http://auth-service:8081
   CONTENT_SERVICE_URL=http://content-service:8082
   MEDIA_SERVICE_URL=http://media-service:8083
   USER_SERVICE_URL=http://user-service:8084
   ALLOWED_ORIGINS=https://your-frontend-url.vercel.app
   JWT_SECRET=your-secret-key-change-in-production
   ```
5. 公開ドメインを生成（「Settings」→「Generate Domain」）

##### 2.3.2 Content Service のデプロイ
1. Railwayダッシュボードで「New」→「GitHub Repo」を選択
2. 同じリポジトリを選択
3. サービス設定：
   - **Root Directory**: `services/content-service`
   - **Build Command**: `./gradlew :services:content-service:build -x test`
   - **Start Command**: `java -jar -Dserver.port=${PORT:-8082} build/libs/content-service.jar --spring.profiles.active=railway`
4. 環境変数の設定：
   ```
   PORT=8082
   SPRING_PROFILES_ACTIVE=railway
   SPRING_DATASOURCE_URL=${DATABASE_URL}
   SPRING_DATASOURCE_USERNAME=${PGUSER}
   SPRING_DATASOURCE_PASSWORD=${PGPASSWORD}
   ```
5. PostgreSQLデータベースを接続（「Variables」→「Add Reference」→「PostgreSQL」を選択）

##### 2.3.3 Auth Service のデプロイ
1. Railwayダッシュボードで「New」→「GitHub Repo」を選択
2. 同じリポジトリを選択
3. サービス設定：
   - **Root Directory**: `services/auth-service`
   - **Build Command**: `./gradlew :services:auth-service:build -x test`
   - **Start Command**: `java -jar -Dserver.port=${PORT:-8081} build/libs/auth-service.jar --spring.profiles.active=railway`
4. 環境変数の設定：
   ```
   PORT=8081
   SPRING_PROFILES_ACTIVE=railway
   SPRING_DATASOURCE_URL=${DATABASE_URL}
   SPRING_DATASOURCE_USERNAME=${PGUSER}
   SPRING_DATASOURCE_PASSWORD=${PGPASSWORD}
   JWT_SECRET=your-secret-key-change-in-production
   ```
5. PostgreSQLデータベースを接続

##### 2.3.4 Media Service のデプロイ
1. Railwayダッシュボードで「New」→「GitHub Repo」を選択
2. 同じリポジトリを選択
3. サービス設定：
   - **Root Directory**: `services/media-service`
   - **Build Command**: `./gradlew :services:media-service:build -x test`
   - **Start Command**: `java -jar -Dserver.port=${PORT:-8083} build/libs/media-service.jar --spring.profiles.active=railway`
4. 環境変数の設定：
   ```
   PORT=8083
   SPRING_PROFILES_ACTIVE=railway
   ```

##### 2.3.5 User Service のデプロイ
1. Railwayダッシュボードで「New」→「GitHub Repo」を選択
2. 同じリポジトリを選択
3. サービス設定：
   - **Root Directory**: `services/user-service`
   - **Build Command**: `./gradlew :services:user-service:build -x test`
   - **Start Command**: `java -jar -Dserver.port=${PORT:-8084} build/libs/user-service.jar --spring.profiles.active=railway`
4. 環境変数の設定：
   ```
   PORT=8084
   SPRING_PROFILES_ACTIVE=railway
   SPRING_DATASOURCE_URL=${DATABASE_URL}
   SPRING_DATASOURCE_USERNAME=${PGUSER}
   SPRING_DATASOURCE_PASSWORD=${PGPASSWORD}
   ```
5. PostgreSQLデータベースを接続

#### 2.4 サービス間の接続設定
Railwayでは、同じプロジェクト内のサービスは自動的に内部ネットワークで接続できます。
各サービスの環境変数で、内部サービス名を使用して接続を設定します。

### 3. CORS設定の更新

#### 3.1 API Gateway のCORS設定
API Gatewayの環境変数 `ALLOWED_ORIGINS` に、VercelのフロントエンドURLを追加：

```
ALLOWED_ORIGINS=https://your-frontend-url.vercel.app
```

#### 3.2 フロントエンドのAPI URL設定
Vercelの環境変数 `NEXT_PUBLIC_API_BASE_URL` に、RailwayのAPI Gateway URLを設定：

```
NEXT_PUBLIC_API_BASE_URL=https://your-api-gateway-url.railway.app
```

### 4. デプロイメントの確認

#### 4.1 バックエンドの確認
1. Railwayダッシュボードで各サービスのログを確認
2. API Gatewayの公開URLにアクセスして、ヘルスチェックエンドポイントを確認
3. 各サービスのステータスが「Running」であることを確認

#### 4.2 フロントエンドの確認
1. Vercelダッシュボードでデプロイメントのステータスを確認
2. フロントエンドURLにアクセス
3. ブラウザの開発者ツールでネットワークエラーがないか確認
4. ログイン機能が正常に動作するか確認

### 5. トラブルシューティング

#### 5.1 接続エラー
- **問題**: フロントエンドからバックエンドに接続できない
- **解決策**:
  1. CORS設定を確認
  2. API GatewayのURLが正しいか確認
  3. 環境変数が正しく設定されているか確認

#### 5.2 データベース接続エラー
- **問題**: サービスがデータベースに接続できない
- **解決策**:
  1. PostgreSQLデータベースが正しく作成されているか確認
  2. 環境変数 `DATABASE_URL` が正しく設定されているか確認
  3. データベースの接続情報を確認

#### 5.3 ビルドエラー
- **問題**: ビルドが失敗する
- **解決策**:
  1. ログを確認してエラーメッセージを特定
  2. 依存関係が正しくインストールされているか確認
  3. ビルドコマンドが正しいか確認

## 📝 デプロイメント後の確認事項

### バックエンド
- [ ] すべてのサービスが正常に起動している
- [ ] API Gatewayが外部からアクセス可能
- [ ] データベース接続が正常
- [ ] CORS設定が正しい

### フロントエンド
- [ ] デプロイメントが成功している
- [ ] 環境変数が正しく設定されている
- [ ] API接続が正常に動作している
- [ ] ログイン機能が動作している

## 🔐 セキュリティ注意事項

1. **JWT Secret**: 本番環境では強力なランダム文字列を使用
2. **データベースパスワード**: 強力なパスワードを使用
3. **CORS設定**: 許可するオリジンのみを設定
4. **環境変数**: 機密情報は環境変数で管理

## 📚 参考資料

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Spring Boot Deployment](https://spring.io/guides/gs/spring-boot-for-azure/)


