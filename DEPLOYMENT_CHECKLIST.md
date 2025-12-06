# デプロイチェックリスト

## 📋 Railway（バックエンド）デプロイ前チェック

### データベース作成
- [ ] `cms-content-db` (PostgreSQL) を作成
- [ ] `cms-auth-db` (PostgreSQL) を作成
- [ ] `cms-user-db` (PostgreSQL) を作成
- [ ] `cms-media-db` (PostgreSQL) を作成

### Content Service
- [ ] サービスを作成
- [ ] Root Directory: `services/content-service`
- [ ] Start Command: `java -jar build/libs/*.jar`
- [ ] 環境変数を設定:
  - [ ] `SPRING_DATASOURCE_URL=${{cms-content-db.DATABASE_URL}}`
  - [ ] `SPRING_DATASOURCE_USERNAME=${{cms-content-db.PGUSER}}`
  - [ ] `SPRING_DATASOURCE_PASSWORD=${{cms-content-db.PGPASSWORD}}`
  - [ ] `PORT=8082`
  - [ ] `SPRING_PROFILES_ACTIVE=railway`
- [ ] パブリックドメインを生成
- [ ] URLをメモ: `https://[content-service-url].railway.app`

### Auth Service
- [ ] サービスを作成
- [ ] Root Directory: `services/auth-service`
- [ ] Start Command: `java -jar build/libs/*.jar`
- [ ] 環境変数を設定:
  - [ ] `SPRING_DATASOURCE_URL=${{cms-auth-db.DATABASE_URL}}`
  - [ ] `SPRING_DATASOURCE_USERNAME=${{cms-auth-db.PGUSER}}`
  - [ ] `SPRING_DATASOURCE_PASSWORD=${{cms-auth-db.PGPASSWORD}}`
  - [ ] `JWT_SECRET=your-production-jwt-secret-key-min-32-chars`
  - [ ] `JWT_EXPIRATION=86400000`
  - [ ] `JWT_REFRESH_EXPIRATION=604800000`
  - [ ] `PORT=8081`
  - [ ] `SPRING_PROFILES_ACTIVE=railway`
- [ ] パブリックドメインを生成
- [ ] URLをメモ: `https://[auth-service-url].railway.app`

### User Service
- [ ] サービスを作成
- [ ] Root Directory: `services/user-service`
- [ ] Start Command: `java -jar build/libs/*.jar`
- [ ] 環境変数を設定:
  - [ ] `SPRING_DATASOURCE_URL=${{cms-user-db.DATABASE_URL}}`
  - [ ] `SPRING_DATASOURCE_USERNAME=${{cms-user-db.PGUSER}}`
  - [ ] `SPRING_DATASOURCE_PASSWORD=${{cms-user-db.PGPASSWORD}}`
  - [ ] `PORT=8084`
  - [ ] `SPRING_PROFILES_ACTIVE=railway`
- [ ] パブリックドメインを生成
- [ ] URLをメモ: `https://[user-service-url].railway.app`

### Media Service
- [ ] サービスを作成
- [ ] Root Directory: `services/media-service`
- [ ] Start Command: `java -jar build/libs/*.jar`
- [ ] 環境変数を設定:
  - [ ] `SPRING_DATASOURCE_URL=${{cms-media-db.DATABASE_URL}}`
  - [ ] `SPRING_DATASOURCE_USERNAME=${{cms-media-db.PGUSER}}`
  - [ ] `SPRING_DATASOURCE_PASSWORD=${{cms-media-db.PGPASSWORD}}`
  - [ ] `PORT=8083`
  - [ ] `SPRING_PROFILES_ACTIVE=railway`
- [ ] パブリックドメインを生成
- [ ] URLをメモ: `https://[media-service-url].railway.app`

### API Gateway（重要）
- [ ] サービスを作成
- [ ] Root Directory: `services/api-gateway`
- [ ] Start Command: `java -jar build/libs/*.jar`
- [ ] 環境変数を設定:
  - [ ] `AUTH_SERVICE_URL=https://[auth-service-url].railway.app`
  - [ ] `CONTENT_SERVICE_URL=https://[content-service-url].railway.app`
  - [ ] `MEDIA_SERVICE_URL=https://[media-service-url].railway.app`
  - [ ] `USER_SERVICE_URL=https://[user-service-url].railway.app`
  - [ ] `JWT_SECRET=your-production-jwt-secret-key-min-32-chars`（Auth Serviceと同じ値）
  - [ ] `ALLOWED_ORIGINS=*`（完全公開モード）
  - [ ] `PORT=8080`
  - [ ] `SPRING_PROFILES_ACTIVE=railway`
- [ ] パブリックドメインを生成
- [ ] **URLをメモ**: `https://[api-gateway-url].railway.app`（フロントエンドで使用）

## 📋 Vercel（フロントエンド）デプロイ前チェック

### プロジェクト設定
- [ ] Vercelアカウントを作成
- [ ] GitHubリポジトリをインポート
- [ ] Root Directory: `frontend`
- [ ] Framework Preset: `Next.js`

### 環境変数
- [ ] `NEXT_PUBLIC_API_BASE_URL=https://[api-gateway-url].railway.app`
- [ ] `NODE_ENV=production`
- [ ] すべての環境（Production, Preview, Development）で有効化

### デプロイ
- [ ] デプロイを実行
- [ ] ビルドログを確認（エラーがないか）
- [ ] デプロイが成功することを確認
- [ ] 生成されたURLをメモ: `https://[vercel-url].vercel.app`

## 📋 デプロイ後チェック

### CORS設定の更新
- [ ] RailwayのAPI Gatewayの環境変数を更新
- [ ] `ALLOWED_ORIGINS=https://[vercel-url].vercel.app`（または`*`のまま）
- [ ] API Gatewayを再デプロイ

### 動作確認
- [ ] VercelのURLにアクセス
- [ ] ブラウザの開発者ツール（F12）を開く
- [ ] Consoleタブでエラーがないか確認
- [ ] NetworkタブでAPIリクエストが成功しているか確認

### 機能テスト
- [ ] ログインページが表示される
- [ ] ユーザー登録ができる
- [ ] ログインができる
- [ ] ダッシュボードが表示される
- [ ] コンテンツ一覧が表示される
- [ ] コンテンツ作成ができる
- [ ] コンテンツ編集ができる
- [ ] 大学管理ができる

### バックエンドAPI確認
- [ ] `curl https://[api-gateway-url].railway.app/api/content` が動作する
- [ ] `curl https://[api-gateway-url].railway.app/api/university` が動作する

## 🔒 セキュリティチェック

- [ ] JWT_SECRETが32文字以上の強力な値になっている
- [ ] データベース接続情報が環境変数で管理されている
- [ ] 本番環境用の強力なパスワードを使用している
- [ ] CORS設定が適切（本番環境では特定のドメインを指定することを推奨）
- [ ] HTTPSが使用されている（VercelとRailwayが自動提供）

## 📝 URLメモ

### Railway URLs
- API Gateway: `https://[api-gateway-url].railway.app`
- Content Service: `https://[content-service-url].railway.app`
- Auth Service: `https://[auth-service-url].railway.app`
- User Service: `https://[user-service-url].railway.app`
- Media Service: `https://[media-service-url].railway.app`

### Vercel URL
- Frontend: `https://[vercel-url].vercel.app`

## 🆘 トラブルシューティング

### CORSエラー
- [ ] `ALLOWED_ORIGINS`が正しく設定されているか確認
- [ ] VercelのURLが許可されているか確認
- [ ] API Gatewayが再デプロイされているか確認

### API接続エラー
- [ ] `NEXT_PUBLIC_API_BASE_URL`が正しく設定されているか確認
- [ ] RailwayのAPI Gatewayが起動しているか確認
- [ ] 各サービスのログを確認

### ビルドエラー
- [ ] Vercelのビルドログを確認
- [ ] Node.jsバージョンを確認
- [ ] 依存関係の問題がないか確認

## ✅ 完了

すべてのチェック項目が完了したら、デプロイは成功です！
