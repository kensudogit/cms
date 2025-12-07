# 🚀 デプロイメント手順（実行版）

## 前提条件

- ✅ GitHubリポジトリにコードがプッシュされている
- ✅ Vercelアカウント（https://vercel.com）
- ✅ Railwayアカウント（https://railway.app）

---

## ステップ1: Railwayでバックエンドをデプロイ

### 1.1 Railwayプロジェクトの作成

1. https://railway.app にアクセス
2. GitHubアカウントでログイン
3. **"New Project"** をクリック
4. **"Deploy from GitHub repo"** を選択
5. CMSリポジトリを選択

### 1.2 PostgreSQLデータベースの作成

1. **"New"** → **"Database"** → **"Add PostgreSQL"** を選択
2. サービス名: `cms-content-db`
3. データベースが作成されるまで待機

### 1.3 Content Service のデプロイ

1. **"New"** → **"GitHub Repo"** を選択
2. 同じリポジトリを選択
3. **Settings** タブで以下を設定：
   - **Root Directory**: `services/content-service`
   - **Build Command**: `./gradlew :services:content-service:build -x test`
   - **Start Command**: `java -jar -Dserver.port=${PORT:-8082} build/libs/content-service.jar --spring.profiles.active=railway`

4. **Variables** タブで環境変数を追加：
   ```
   PORT=8082
   SPRING_PROFILES_ACTIVE=railway
   SPRING_DATASOURCE_URL=${{cms-content-db.DATABASE_URL}}
   SPRING_DATASOURCE_USERNAME=${{cms-content-db.PGUSER}}
   SPRING_DATASOURCE_PASSWORD=${{cms-content-db.PGPASSWORD}}
   ```

5. **Settings** → **Networking** → **"Generate Domain"** をクリック
   - 生成されたURLをメモ（例: `https://content-service-production.up.railway.app`）

6. **Deploy** をクリック

### 1.4 Auth Service のデプロイ

1. **"New"** → **"GitHub Repo"** を選択
2. 同じリポジトリを選択
3. **Settings** タブで以下を設定：
   - **Root Directory**: `services/auth-service`
   - **Build Command**: `./gradlew :services:auth-service:build -x test`
   - **Start Command**: `java -jar -Dserver.port=${PORT:-8081} build/libs/auth-service.jar --spring.profiles.active=railway`

4. **Variables** タブで環境変数を追加：
   ```
   PORT=8081
   SPRING_PROFILES_ACTIVE=railway
   SPRING_DATASOURCE_URL=${{cms-content-db.DATABASE_URL}}
   SPRING_DATASOURCE_USERNAME=${{cms-content-db.PGUSER}}
   SPRING_DATASOURCE_PASSWORD=${{cms-content-db.PGPASSWORD}}
   JWT_SECRET=your-production-jwt-secret-key-min-32-characters-long-change-this
   JWT_EXPIRATION=86400000
   ```

5. **Settings** → **Networking** → **"Generate Domain"** をクリック
   - 生成されたURLをメモ

6. **Deploy** をクリック

### 1.5 API Gateway のデプロイ（重要）

1. **"New"** → **"GitHub Repo"** を選択
2. 同じリポジトリを選択
3. **Settings** タブで以下を設定：
   - **Root Directory**: `services/api-gateway`
   - **Build Command**: `./gradlew :services:api-gateway:build -x test`
   - **Start Command**: `java -jar -Dserver.port=${PORT:-8080} build/libs/api-gateway.jar --spring.profiles.active=railway`

4. **Variables** タブで環境変数を追加：
   ```
   PORT=8080
   SPRING_PROFILES_ACTIVE=railway
   AUTH_SERVICE_URL=https://[auth-service-url].railway.app
   CONTENT_SERVICE_URL=https://[content-service-url].railway.app
   MEDIA_SERVICE_URL=https://[media-service-url].railway.app
   USER_SERVICE_URL=https://[user-service-url].railway.app
   JWT_SECRET=your-production-jwt-secret-key-min-32-characters-long-change-this
   ALLOWED_ORIGINS=*
   ```

   **重要**: 
   - `[auth-service-url]`, `[content-service-url]` などは、各サービスの実際のRailway URLに置き換えてください
   - `ALLOWED_ORIGINS=*` は完全公開モード用です（後でVercelのURLに更新可能）

5. **Settings** → **Networking** → **"Generate Domain"** をクリック
   - **このURLをメモしてください**（フロントエンドの環境変数で使用します）
   - 例: `https://api-gateway-production.up.railway.app`

6. **Deploy** をクリック

---

## ステップ2: Vercelでフロントエンドをデプロイ

### 2.1 Vercelアカウントの作成

1. https://vercel.com にアクセス
2. GitHubアカウントでログイン
3. アカウントを作成

### 2.2 プロジェクトのインポート

1. Vercelダッシュボードで **"Add New..."** → **"Project"** をクリック
2. GitHubリポジトリを選択（CMSリポジトリ）
3. **"Configure Project"** で以下を設定：
   - **Framework Preset**: `Next.js`（自動検出）
   - **Root Directory**: `frontend`（重要！）
   - **Build Command**: `npm run build`（自動検出）
   - **Output Directory**: `.next`（自動検出）
   - **Install Command**: `npm install`（自動検出）

### 2.3 環境変数の設定

**Environment Variables** セクションで以下を追加：

```
NEXT_PUBLIC_API_BASE_URL=https://[api-gateway-url].railway.app
NODE_ENV=production
```

**重要**: 
- `[api-gateway-url]` は、Railwayで生成したAPI GatewayのURLに置き換えてください
- 例: `NEXT_PUBLIC_API_BASE_URL=https://api-gateway-production.up.railway.app`
- **すべての環境**（Production, Preview, Development）で有効にしてください

### 2.4 デプロイ

1. **"Deploy"** ボタンをクリック
2. ビルドログを確認
3. デプロイが成功することを確認
4. 生成されたURLをメモ（例: `https://cms-frontend.vercel.app`）

---

## ステップ3: CORS設定の更新

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

---

## ステップ4: 動作確認

### 4.1 バックエンドサービスの確認

各サービスのヘルスチェック：

```bash
# API Gateway
curl https://[api-gateway-url].railway.app/api/content

# Content Service（直接）
curl https://[content-service-url].railway.app/api/content
```

### 4.2 フロントエンドからの接続確認

1. ブラウザでVercelのURLにアクセス
2. ブラウザの開発者ツール（F12）を開く
3. **Console** タブでエラーがないか確認
4. **Network** タブでAPIリクエストが成功しているか確認

### 4.3 機能テスト

1. **ログイン機能**: ユーザー登録・ログインをテスト
2. **コンテンツ管理**: コンテンツの作成・編集・削除をテスト
3. **支払い管理**: 支払い記録の作成・確認をテスト

---

## ✅ デプロイ完了チェックリスト

### Railway（バックエンド）
- [ ] PostgreSQLデータベースが作成されている
- [ ] Content Serviceがデプロイされている
- [ ] Auth Serviceがデプロイされている
- [ ] API Gatewayがデプロイされている
- [ ] 各サービスのパブリックドメインが生成されている
- [ ] 環境変数が正しく設定されている
- [ ] すべてのサービスが正常に起動している

### Vercel（フロントエンド）
- [ ] プロジェクトが作成されている
- [ ] Root Directoryが`frontend`に設定されている
- [ ] 環境変数が正しく設定されている
- [ ] デプロイが成功している
- [ ] フロントエンドURLが生成されている

### 連携
- [ ] CORS設定が正しく設定されている
- [ ] フロントエンドからAPI Gatewayに接続できる
- [ ] ログイン機能が動作する
- [ ] コンテンツ管理機能が動作する

---

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
2. Node.jsバージョンを確認
3. 依存関係の問題がないか確認

### データベース接続エラーが発生する場合

1. **Railwayの環境変数**でデータベース接続情報が正しく設定されているか確認
2. データベースサービスが起動しているか確認
3. 接続文字列の形式を確認

---

## 📚 参考リンク

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Spring Boot on Railway](https://docs.railway.app/guides/deploying-spring-boot)

---

## 🎉 デプロイ完了！

これで、フロントエンドがVercelに、バックエンドがRailwayにデプロイされました！

**次のステップ**:
1. 各サービスのログを確認
2. 機能テストを実行
3. パフォーマンスを監視
4. セキュリティ設定を確認


