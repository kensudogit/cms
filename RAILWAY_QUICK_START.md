# Railway クイックスタートガイド

## 5分でデプロイ

### ステップ1: Railwayアカウントの作成

1. https://railway.app にアクセス
2. "Start a New Project" をクリック
3. GitHubアカウントでログイン

### ステップ2: プロジェクトの作成

1. "New Project" をクリック
2. "Deploy from GitHub repo" を選択
3. CMSリポジトリを選択

### ステップ3: データベースの作成（4つ）

各サービス用にPostgreSQLデータベースを作成：

1. "New Service" → "Database" → "Add PostgreSQL"
2. サービス名を設定（例: `cms-auth-db`）
3. 同様に以下も作成：
   - `cms-content-db`
   - `cms-media-db`
   - `cms-user-db`

### ステップ4: Auth Serviceのデプロイ

1. "New Service" → "GitHub Repo" を選択
2. "Settings" → "Root Directory" を `services/auth-service` に設定
3. "Settings" → "Start Command" を `java -jar build/libs/auth-service.jar` に設定
4. "Variables" タブで以下を追加：
   ```
   SPRING_DATASOURCE_URL=${{cms-auth-db.DATABASE_URL}}
   JWT_SECRET=change-this-to-a-strong-secret-key-min-32-chars
   PORT=8081
   RAILWAY_ENVIRONMENT=production
   ```
5. "Settings" → "Networking" → "Generate Domain" をクリック
6. デプロイが完了するまで待つ

### ステップ5: Content Serviceのデプロイ

1. "New Service" → "GitHub Repo" を選択
2. "Settings" → "Root Directory" を `services/content-service` に設定
3. "Settings" → "Start Command" を `java -jar build/libs/content-service.jar` に設定
4. "Variables" タブで以下を追加：
   ```
   SPRING_DATASOURCE_URL=${{cms-content-db.DATABASE_URL}}
   PORT=8082
   RAILWAY_ENVIRONMENT=production
   ```
5. "Settings" → "Networking" → "Generate Domain" をクリック
6. デプロイが完了するまで待つ

### ステップ6: Media Serviceのデプロイ

1. "New Service" → "GitHub Repo" を選択
2. "Settings" → "Root Directory" を `services/media-service` に設定
3. "Settings" → "Start Command" を `java -jar build/libs/media-service.jar` に設定
4. "Variables" タブで以下を追加：
   ```
   SPRING_DATASOURCE_URL=${{cms-media-db.DATABASE_URL}}
   PORT=8083
   RAILWAY_ENVIRONMENT=production
   ```
5. "Settings" → "Networking" → "Generate Domain" をクリック
6. デプロイが完了するまで待つ

### ステップ7: User Serviceのデプロイ

1. "New Service" → "GitHub Repo" を選択
2. "Settings" → "Root Directory" を `services/user-service` に設定
3. "Settings" → "Start Command" を `java -jar build/libs/user-service.jar` に設定
4. "Variables" タブで以下を追加：
   ```
   SPRING_DATASOURCE_URL=${{cms-user-db.DATABASE_URL}}
   PORT=8084
   RAILWAY_ENVIRONMENT=production
   ```
5. "Settings" → "Networking" → "Generate Domain" をクリック
6. デプロイが完了するまで待つ

### ステップ8: API Gatewayのデプロイ（重要）

1. "New Service" → "GitHub Repo" を選択
2. "Settings" → "Root Directory" を `services/api-gateway` に設定
3. "Settings" → "Start Command" を `java -jar build/libs/api-gateway.jar` に設定
4. "Variables" タブで以下を追加（各サービスのURLを設定）：
   ```
   AUTH_SERVICE_URL=https://your-auth-service-url.railway.app
   CONTENT_SERVICE_URL=https://your-content-service-url.railway.app
   MEDIA_SERVICE_URL=https://your-media-service-url.railway.app
   USER_SERVICE_URL=https://your-user-service-url.railway.app
   JWT_SECRET=change-this-to-a-strong-secret-key-min-32-chars
   ALLOWED_ORIGINS=*
   PORT=8080
   RAILWAY_ENVIRONMENT=production
   ```
5. "Settings" → "Networking" → "Generate Domain" をクリック（**これがメインの公開URL**）
6. デプロイが完了するまで待つ

### ステップ9: フロントエンドのデプロイ

#### オプションA: Vercel（推奨）

1. https://vercel.com にアクセス
2. "New Project" をクリック
3. GitHubリポジトリを選択
4. "Root Directory" を `frontend` に設定
5. "Environment Variables" で以下を追加：
   ```
   NEXT_PUBLIC_API_BASE_URL=https://your-api-gateway-url.railway.app
   ```
6. "Deploy" をクリック

#### オプションB: Railway

1. "New Service" → "GitHub Repo" を選択
2. "Settings" → "Root Directory" を `frontend` に設定
3. "Settings" → "Build Command" を `npm install && npm run build` に設定
4. "Settings" → "Start Command" を `npm start` に設定
5. "Variables" タブで以下を追加：
   ```
   NEXT_PUBLIC_API_BASE_URL=https://your-api-gateway-url.railway.app
   NODE_ENV=production
   ```
6. "Settings" → "Networking" → "Generate Domain" をクリック
7. デプロイが完了するまで待つ

## デプロイ後の確認

### 1. API Gatewayのヘルスチェック

ブラウザで以下にアクセス：
```
https://your-api-gateway-url.railway.app/api/auth/health
```

"Auth service is running" と表示されれば成功です。

### 2. フロントエンドからの接続確認

1. フロントエンドURLにアクセス
2. ユーザー登録を試す
3. ログインを試す
4. コンテンツ作成を試す

## トラブルシューティング

### ビルドエラー

- Railwayダッシュボードの "Logs" タブでログを確認
- Java 17が使用されているか確認
- 依存関係が正しく解決されているか確認

### データベース接続エラー

- 環境変数 `SPRING_DATASOURCE_URL` が正しく設定されているか確認
- データベースサービスが起動しているか確認
- Railwayの変数参照構文 `${{service-name.DATABASE_URL}}` を使用しているか確認

### サービス間の接続エラー

- API Gatewayの環境変数で各サービスのURLが正しく設定されているか確認
- 各サービスがパブリックドメインを生成しているか確認
- URLが `https://` で始まっているか確認

## 次のステップ

- 本番環境用の強力なJWT秘密鍵を生成
- CORS設定を適切に制限（必要に応じて）
- モニタリングとロギングの設定
- バックアップ戦略の実装

詳細は `RAILWAY_DEPLOY.md` を参照してください。

