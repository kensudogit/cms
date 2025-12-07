# クイックデプロイガイド

## 🚀 5分でデプロイ

### フロントエンド（Vercel）

1. **Vercelにログイン**
   ```
   https://vercel.com
   ```

2. **プロジェクトをインポート**
   - 「Add New Project」をクリック
   - GitHubリポジトリを選択
   - 設定：
     - Root Directory: `frontend`
     - Framework: Next.js

3. **環境変数を設定**
   ```
   NEXT_PUBLIC_API_BASE_URL=https://your-api-gateway.railway.app
   ```

4. **デプロイ**
   - 「Deploy」をクリック
   - 完了を待つ（2-3分）

### バックエンド（Railway）

1. **Railwayにログイン**
   ```
   https://railway.app
   ```

2. **PostgreSQLデータベースを作成**
   - 「New」→「Database」→「Add PostgreSQL」

3. **API Gatewayをデプロイ**
   - 「New」→「GitHub Repo」
   - Root Directory: `services/api-gateway`
   - 環境変数：
     ```
     ALLOWED_ORIGINS=https://your-frontend.vercel.app
     JWT_SECRET=your-secret-key
     ```
   - 公開ドメインを生成

4. **Content Serviceをデプロイ**
   - 「New」→「GitHub Repo」
   - Root Directory: `services/content-service`
   - PostgreSQLデータベースを接続

5. **その他のサービスをデプロイ**
   - Auth Service
   - Media Service
   - User Service

6. **CORS設定を更新**
   - API Gatewayの `ALLOWED_ORIGINS` にVercelのURLを追加

## ✅ 確認

- [ ] フロントエンドがVercelでデプロイされている
- [ ] バックエンドがRailwayでデプロイされている
- [ ] API Gatewayが外部からアクセス可能
- [ ] CORS設定が正しい
- [ ] データベース接続が正常

## 🔗 リンク

- 詳細ガイド: `DEPLOYMENT_COMPLETE_GUIDE.md`
- Vercel設定: `VERCEL_DEPLOY.md`
- Railway設定: `RAILWAY_DEPLOY.md`

