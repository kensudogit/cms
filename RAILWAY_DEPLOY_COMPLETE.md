# Railway完全公開デプロイガイド

## デプロイ構成

### サービス一覧

1. **PostgreSQL Databases** (4つ)
   - `cms-auth-db` - Auth Service用
   - `cms-content-db` - Content Service用
   - `cms-media-db` - Media Service用
   - `cms-user-db` - User Service用

2. **Backend Services** (5つ)
   - `auth-service` - 認証サービス (ポート8081)
   - `content-service` - コンテンツサービス (ポート8082)
   - `media-service` - メディアサービス (ポート8083)
   - `user-service` - ユーザーサービス (ポート8084)
   - `api-gateway` - APIゲートウェイ (ポート8080) **メイン公開URL**

3. **Frontend**
   - `frontend` - Next.jsアプリケーション

## デプロイ手順

### ステップ1: Railwayプロジェクトの作成

1. https://railway.app にアクセス
2. "Start a New Project" → "Deploy from GitHub repo" を選択
3. CMSリポジトリを選択

### ステップ2: PostgreSQLデータベースの作成

各サービス用にPostgreSQLデータベースを作成：

#### Auth Database
1. "New" → "Database" → "Add PostgreSQL"
2. サービス名: `cms-auth-db`
3. "Variables" タブで接続情報を確認

#### Content Database
1. "New" → "Database" → "Add PostgreSQL"
2. サービス名: `cms-content-db`

#### Media Database
1. "New" → "Database" → "Add PostgreSQL"
2. サービス名: `cms-media-db`

#### User Database
1. "New" → "Database" → "Add PostgreSQL"
2. サービス名: `cms-user-db`

### ステップ3: Auth Serviceのデプロイ

1. "New" → "GitHub Repo" → 同じリポジトリを選択
2. **Settings**:
   - **Root Directory**: `services/auth-service`
   - **Build Command**: (自動検出)
   - **Start Command**: `java -jar build/libs/auth-service.jar`
3. **Variables**:
   ```
   SPRING_DATASOURCE_URL=${{cms-auth-db.DATABASE_URL}}
   SPRING_DATASOURCE_USERNAME=${{cms-auth-db.PGUSER}}
   SPRING_DATASOURCE_PASSWORD=${{cms-auth-db.PGPASSWORD}}
   JWT_SECRET=your-production-jwt-secret-key-min-32-characters-long-change-this
   JWT_EXPIRATION=86400000
   JWT_REFRESH_EXPIRATION=604800000
   PORT=8081
   ```
4. **Networking**:
   - "Generate Domain" をクリック
   - パブリックURLを生成（例: `https://auth-service-production.up.railway.app`）
5. "Deploy" をクリック

### ステップ4: Content Serviceのデプロイ

1. "New" → "GitHub Repo" → 同じリポジトリを選択
2. **Settings**:
   - **Root Directory**: `services/content-service`
   - **Start Command**: `java -jar build/libs/content-service.jar`
3. **Variables**:
   ```
   SPRING_DATASOURCE_URL=${{cms-content-db.DATABASE_URL}}
   SPRING_DATASOURCE_USERNAME=${{cms-content-db.PGUSER}}
   SPRING_DATASOURCE_PASSWORD=${{cms-content-db.PGPASSWORD}}
   PORT=8082
   ```
4. **Networking**:
   - "Generate Domain" をクリック
5. "Deploy" をクリック

### ステップ5: Media Serviceのデプロイ

1. "New" → "GitHub Repo" → 同じリポジトリを選択
2. **Settings**:
   - **Root Directory**: `services/media-service`
   - **Start Command**: `java -jar build/libs/media-service.jar`
3. **Variables**:
   ```
   SPRING_DATASOURCE_URL=${{cms-media-db.DATABASE_URL}}
   SPRING_DATASOURCE_USERNAME=${{cms-media-db.PGUSER}}
   SPRING_DATASOURCE_PASSWORD=${{cms-media-db.PGPASSWORD}}
   PORT=8083
   ```
4. **Networking**:
   - "Generate Domain" をクリック
5. "Deploy" をクリック

### ステップ6: User Serviceのデプロイ

1. "New" → "GitHub Repo" → 同じリポジトリを選択
2. **Settings**:
   - **Root Directory**: `services/user-service`
   - **Start Command**: `java -jar build/libs/user-service.jar`
3. **Variables**:
   ```
   SPRING_DATASOURCE_URL=${{cms-user-db.DATABASE_URL}}
   SPRING_DATASOURCE_USERNAME=${{cms-user-db.PGUSER}}
   SPRING_DATASOURCE_PASSWORD=${{cms-user-db.PGPASSWORD}}
   PORT=8084
   ```
4. **Networking**:
   - "Generate Domain" をクリック
5. "Deploy" をクリック

### ステップ7: API Gatewayのデプロイ（重要）

1. "New" → "GitHub Repo" → 同じリポジトリを選択
2. **Settings**:
   - **Root Directory**: `services/api-gateway`
   - **Start Command**: `java -jar build/libs/api-gateway.jar`
3. **Variables**:
   ```
   AUTH_SERVICE_URL=https://auth-service-production.up.railway.app
   CONTENT_SERVICE_URL=https://content-service-production.up.railway.app
   MEDIA_SERVICE_URL=https://media-service-production.up.railway.app
   USER_SERVICE_URL=https://user-service-production.up.railway.app
   JWT_SECRET=your-production-jwt-secret-key-min-32-characters-long-change-this
   ALLOWED_ORIGINS=*
   PORT=8080
   ```
   **注意**: 上記のURLは実際のデプロイ後に生成されたURLに置き換えてください。
4. **Networking**:
   - "Generate Domain" をクリック
   - **これがメインの公開URLになります**（例: `https://cms-api-gateway-production.up.railway.app`）
5. "Deploy" をクリック

### ステップ8: Frontendのデプロイ

1. "New" → "GitHub Repo" → 同じリポジトリを選択
2. **Settings**:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
3. **Variables**:
   ```
   NEXT_PUBLIC_API_BASE_URL=https://your-api-gateway-url.railway.app
   NODE_ENV=production
   PORT=3000
   ```
   **注意**: `NEXT_PUBLIC_API_BASE_URL` はステップ7で生成されたAPI GatewayのURLに置き換えてください。
4. **Networking**:
   - "Generate Domain" をクリック
   - **これがフロントエンドの公開URLになります**（例: `https://cms-frontend-production.up.railway.app`）
5. "Deploy" をクリック

## 完全公開モードの設定

### 1. すべてのサービスでパブリックドメインを生成

各サービスの **Settings** → **Networking** で：
- "Generate Domain" をクリック
- パブリックURLが生成されます

### 2. CORS設定

API Gatewayの環境変数で：
```
ALLOWED_ORIGINS=*
```
これにより、すべてのオリジンからのアクセスが許可されます。

### 3. 環境変数の最終確認

すべてのサービスがデプロイされた後、API Gatewayの環境変数を更新：

```
AUTH_SERVICE_URL=https://実際のauth-service-url.railway.app
CONTENT_SERVICE_URL=https://実際のcontent-service-url.railway.app
MEDIA_SERVICE_URL=https://実際のmedia-service-url.railway.app
USER_SERVICE_URL=https://実際のuser-service-url.railway.app
ALLOWED_ORIGINS=https://実際のfrontend-url.railway.app,*
```

## デプロイ後の確認

### 1. サービスヘルスチェック

```bash
# API Gateway
curl https://your-api-gateway-url.railway.app/api/content

# Auth Service
curl https://your-auth-service-url.railway.app/api/auth/health

# Content Service
curl https://your-content-service-url.railway.app/api/content
```

### 2. フロントエンドからの接続確認

1. ブラウザでフロントエンドURLにアクセス
2. 開発者ツールのコンソールでエラーがないか確認
3. コンテンツ作成機能をテスト

### 3. データベースの確認

Railwayダッシュボードで各データベースサービスの "Data" タブから：
- テーブルが作成されているか確認
- 初期データ（data.sql）が投入されているか確認

## トラブルシューティング

### ビルドエラー

- **Java 21が必要**: `nixpacks.toml`でJava 21を指定
- **Gradleビルドログを確認**: Railwayダッシュボードの "Deployments" → "View Logs"

### データベース接続エラー

- 環境変数 `SPRING_DATASOURCE_URL` が正しく設定されているか確認
- Railwayのデータベースサービスが起動しているか確認
- 接続文字列の形式: `jdbc:postgresql://host:port/database`

### CORSエラー

- `ALLOWED_ORIGINS` 環境変数を確認
- フロントエンドのURLが許可されているか確認
- ワイルドカード `*` を使用している場合、すべてのオリジンが許可されます

### ポートエラー

- Railwayは自動的に `PORT` 環境変数を設定します
- `application.yml` で `server.port=${PORT:8080}` を使用

### サービス間通信エラー

- API Gatewayの環境変数で各サービスのURLが正しく設定されているか確認
- サービス名ではなく、実際のRailway URLを使用

## セキュリティチェックリスト

- [ ] 本番環境用の強力なJWT秘密鍵を使用（32文字以上）
- [ ] データベース接続情報を環境変数で管理
- [ ] CORS設定を適切に制限（必要に応じて）
- [ ] HTTPSを使用（Railwayが自動的に提供）
- [ ] 環境変数に機密情報が含まれていないか確認
- [ ] ログに機密情報が出力されていないか確認

## デプロイ後のメンテナンス

### ログの確認

Railwayダッシュボードの各サービスの "Logs" タブで：
- エラーログの確認
- パフォーマンスの監視

### データベースのバックアップ

Railwayは自動的にデータベースをバックアップしますが、手動バックアップも可能：
1. データベースサービスの "Data" タブ
2. "Backup" をクリック

### 環境変数の更新

1. サービスの "Variables" タブ
2. 環境変数を追加・編集
3. サービスが自動的に再デプロイされます

## 参考リンク

- [Railway Documentation](https://docs.railway.app)
- [Railway Environment Variables](https://docs.railway.app/develop/variables)
- [Railway Networking](https://docs.railway.app/develop/networking)

