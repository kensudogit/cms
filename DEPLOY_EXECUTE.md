# 🚀 デプロイ実行ガイド

このガイドに従って、実際にデプロイを実行してください。

## 📋 デプロイ前チェックリスト

### コードの準備
- [ ] すべての変更がGitHubにプッシュされている
- [ ] ビルドエラーがない
- [ ] テストが通っている（オプション）

### アカウントの準備
- [ ] Vercelアカウントを作成済み
- [ ] Railwayアカウントを作成済み
- [ ] GitHubリポジトリにアクセス権限がある

---

## 🎯 デプロイ実行手順

### パート1: Railway（バックエンド）のデプロイ

#### ステップ1: Railwayプロジェクトの作成

1. https://railway.app にアクセス
2. GitHubアカウントでログイン
3. **"New Project"** をクリック
4. **"Deploy from GitHub repo"** を選択
5. CMSリポジトリを選択

#### ステップ2: PostgreSQLデータベースの作成

1. **"New"** → **"Database"** → **"Add PostgreSQL"** を選択
2. サービス名: `cms-content-db`
3. データベースが作成されるまで待機（約1-2分）

#### ステップ3: Content Service のデプロイ

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
7. デプロイが完了するまで待機（約3-5分）

#### ステップ4: Auth Service のデプロイ

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
   JWT_SECRET=your-production-jwt-secret-key-min-32-characters-long-change-this-now
   JWT_EXPIRATION=86400000
   ```

   **重要**: `JWT_SECRET` は32文字以上の強力なランダム文字列に変更してください。

5. **Settings** → **Networking** → **"Generate Domain"** をクリック
   - 生成されたURLをメモ（例: `https://auth-service-production.up.railway.app`）

6. **Deploy** をクリック
7. デプロイが完了するまで待機（約3-5分）

#### ステップ5: API Gateway のデプロイ（重要）

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
   JWT_SECRET=your-production-jwt-secret-key-min-32-characters-long-change-this-now
   ALLOWED_ORIGINS=*
   ```

   **重要**: 
   - `[auth-service-url]`, `[content-service-url]` などは、ステップ3と4でメモした実際のURLに置き換えてください
   - `JWT_SECRET` はAuth Serviceと同じ値を使用してください
   - `ALLOWED_ORIGINS=*` は完全公開モードです（後でVercelのURLに更新可能）

5. **Settings** → **Networking** → **"Generate Domain"** をクリック
   - **このURLをメモしてください**（フロントエンドの環境変数で使用します）
   - 例: `https://api-gateway-production.up.railway.app`

6. **Deploy** をクリック
7. デプロイが完了するまで待機（約3-5分）

#### ステップ6: バックエンドの動作確認

1. API GatewayのURLにアクセス：
   ```
   https://[api-gateway-url].railway.app/api/content
   ```
2. レスポンスが返ってくることを確認（エラーでもOK、接続できていれば問題なし）

---

### パート2: Vercel（フロントエンド）のデプロイ

#### ステップ1: Vercelアカウントの作成

1. https://vercel.com にアクセス
2. GitHubアカウントでログイン
3. アカウントを作成

#### ステップ2: プロジェクトのインポート

1. Vercelダッシュボードで **"Add New..."** → **"Project"** をクリック
2. GitHubリポジトリを選択（CMSリポジトリ）
3. **"Configure Project"** で以下を設定：
   - **Framework Preset**: `Next.js`（自動検出）
   - **Root Directory**: `frontend`（**重要！**）
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
- **すべての環境**（Production, Preview, Development）で有効にしてください

#### ステップ4: デプロイ

1. **"Deploy"** ボタンをクリック
2. ビルドログを確認（約2-3分）
3. デプロイが成功することを確認
4. 生成されたURLをメモ（例: `https://cms-frontend.vercel.app`）

---

### パート3: CORS設定の更新

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

## ✅ デプロイ後の確認

### 1. バックエンドサービスの確認

各サービスのログを確認（Railwayダッシュボードの "Logs" タブ）：
- Content Service: エラーがないか確認
- Auth Service: エラーがないか確認
- API Gateway: エラーがないか確認

### 2. フロントエンドからの接続確認

1. ブラウザでVercelのURLにアクセス
2. ブラウザの開発者ツール（F12）を開く
3. **Console** タブでエラーがないか確認
4. **Network** タブでAPIリクエストが成功しているか確認

### 3. 機能テスト

1. **ログイン機能**: ユーザー登録・ログインをテスト
2. **コンテンツ管理**: コンテンツの作成・編集・削除をテスト
3. **支払い管理**: 支払い記録の作成・確認をテスト

---

## 🔧 トラブルシューティング

### ビルドエラーが発生する場合

**Railway**:
1. **Logs** タブでエラーメッセージを確認
2. Gradleビルドが失敗している場合、Java 21が使用されているか確認
3. 依存関係の問題がないか確認

**Vercel**:
1. **Deployments** タブでビルドログを確認
2. Node.jsバージョンを確認（`package.json` の `engines` を確認）
3. 依存関係の問題がないか確認

### CORSエラーが発生する場合

1. **RailwayのAPI Gateway**で `ALLOWED_ORIGINS` を確認
2. VercelのURLが正しく設定されているか確認
3. ブラウザのコンソールでエラーメッセージを確認

### API接続エラーが発生する場合

1. **Vercelの環境変数**で `NEXT_PUBLIC_API_BASE_URL` が正しく設定されているか確認
2. RailwayのAPI Gatewayが起動しているか確認
3. 各サービスのログを確認（Railwayダッシュボードの "Logs" タブ）

### データベース接続エラーが発生する場合

1. **Railwayの環境変数**でデータベース接続情報が正しく設定されているか確認
2. データベースサービスが起動しているか確認
3. 接続文字列の形式を確認

---

## 📝 デプロイ完了チェックリスト

### Railway（バックエンド）
- [ ] PostgreSQLデータベースが作成されている
- [ ] Content Serviceがデプロイされている
- [ ] Auth Serviceがデプロイされている
- [ ] API Gatewayがデプロイされている
- [ ] 各サービスのパブリックドメインが生成されている
- [ ] 環境変数が正しく設定されている
- [ ] すべてのサービスが正常に起動している（Logsタブで確認）

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

## 🎉 デプロイ完了！

これで、フロントエンドがVercelに、バックエンドがRailwayにデプロイされました！

**次のステップ**:
1. 各サービスのログを確認
2. 機能テストを実行
3. パフォーマンスを監視
4. セキュリティ設定を確認

---

## 📞 サポート

問題が発生した場合は、以下のドキュメントを参照してください：
- [DEPLOY_NOW.md](./DEPLOY_NOW.md) - 詳細なステップバイステップガイド
- [DEPLOYMENT_STEPS.md](./DEPLOYMENT_STEPS.md) - 実行版デプロイ手順
- [DEPLOYMENT_COMPLETE_GUIDE.md](./DEPLOYMENT_COMPLETE_GUIDE.md) - 完全デプロイメントガイド


