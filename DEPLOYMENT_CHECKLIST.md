# Railway デプロイチェックリスト

## デプロイ前の確認事項

### 1. リポジトリの準備
- [ ] GitHubリポジトリにコードがプッシュされている
- [ ] すべての変更がコミットされている
- [ ] `.railwayignore` ファイルが正しく設定されている

### 2. Railwayアカウントの準備
- [ ] Railwayアカウントを作成済み
- [ ] GitHubアカウントと連携済み
- [ ] Railway CLIがインストールされている（オプション）

### 3. データベースの準備
- [ ] PostgreSQLデータベースサービスを4つ作成（auth, content, media, user）
- [ ] 各データベースの接続情報をメモ

### 4. 環境変数の準備
- [ ] 本番環境用のJWT秘密鍵を生成（32文字以上）
- [ ] 各サービスの環境変数リストを準備

## デプロイ手順

### ステップ1: データベースサービスの作成
1. Railwayダッシュボードで "New Service" → "Database" → "Add PostgreSQL"
2. 以下の4つのデータベースを作成：
   - `cms-auth-db`
   - `cms-content-db`
   - `cms-media-db`
   - `cms-user-db`

### ステップ2: Auth Serviceのデプロイ
- [ ] サービスを作成
- [ ] Root Directory: `services/auth-service`
- [ ] Start Command: `java -jar build/libs/auth-service.jar`
- [ ] 環境変数を設定
- [ ] パブリックドメインを生成
- [ ] デプロイを実行

### ステップ3: Content Serviceのデプロイ
- [ ] サービスを作成
- [ ] Root Directory: `services/content-service`
- [ ] Start Command: `java -jar build/libs/content-service.jar`
- [ ] 環境変数を設定
- [ ] パブリックドメインを生成
- [ ] デプロイを実行

### ステップ4: Media Serviceのデプロイ
- [ ] サービスを作成
- [ ] Root Directory: `services/media-service`
- [ ] Start Command: `java -jar build/libs/media-service.jar`
- [ ] 環境変数を設定
- [ ] パブリックドメインを生成
- [ ] デプロイを実行

### ステップ5: User Serviceのデプロイ
- [ ] サービスを作成
- [ ] Root Directory: `services/user-service`
- [ ] Start Command: `java -jar build/libs/user-service.jar`
- [ ] 環境変数を設定
- [ ] パブリックドメインを生成
- [ ] デプロイを実行

### ステップ6: API Gatewayのデプロイ
- [ ] サービスを作成
- [ ] Root Directory: `services/api-gateway`
- [ ] Start Command: `java -jar build/libs/api-gateway.jar`
- [ ] 環境変数を設定（各サービスのURLを含む）
- [ ] パブリックドメインを生成（**メインの公開URL**）
- [ ] デプロイを実行

### ステップ7: フロントエンドのデプロイ
- [ ] VercelまたはRailwayでフロントエンドをデプロイ
- [ ] 環境変数 `NEXT_PUBLIC_API_BASE_URL` を設定
- [ ] パブリックドメインを確認

## デプロイ後の確認

### ヘルスチェック
- [ ] Auth Service: `https://your-auth-url.railway.app/api/auth/health`
- [ ] Content Service: `https://your-content-url.railway.app/api/content`
- [ ] API Gateway: `https://your-api-gateway-url.railway.app/api/auth/health`

### 機能テスト
- [ ] ユーザー登録が動作する
- [ ] ログインが動作する
- [ ] コンテンツ作成が動作する
- [ ] コンテンツ一覧が表示される
- [ ] コンテンツ編集が動作する
- [ ] コンテンツ削除が動作する

### セキュリティ確認
- [ ] HTTPSが有効になっている
- [ ] CORS設定が適切
- [ ] JWT秘密鍵が本番環境用に変更されている
- [ ] データベース接続情報が環境変数で管理されている

## トラブルシューティング

### ビルドエラー
- [ ] ログを確認
- [ ] Java 17が使用されているか確認
- [ ] 依存関係が正しく解決されているか確認

### データベース接続エラー
- [ ] 環境変数 `SPRING_DATASOURCE_URL` が正しく設定されているか確認
- [ ] データベースサービスが起動しているか確認
- [ ] 接続文字列の形式を確認

### CORSエラー
- [ ] `ALLOWED_ORIGINS` 環境変数を確認
- [ ] フロントエンドのURLが許可されているか確認

### ポートエラー
- [ ] `PORT` 環境変数が設定されているか確認
- [ ] Railwayが自動的に割り当てたポートを使用しているか確認

## 環境変数一覧

### Auth Service
```
SPRING_DATASOURCE_URL=${{cms-auth-db.DATABASE_URL}}
SPRING_DATASOURCE_USERNAME=${{cms-auth-db.PGUSER}}
SPRING_DATASOURCE_PASSWORD=${{cms-auth-db.PGPASSWORD}}
JWT_SECRET=your-production-jwt-secret-key-change-this
JWT_EXPIRATION=86400000
JWT_REFRESH_EXPIRATION=604800000
PORT=8081
RAILWAY_ENVIRONMENT=production
```

### Content Service
```
SPRING_DATASOURCE_URL=${{cms-content-db.DATABASE_URL}}
SPRING_DATASOURCE_USERNAME=${{cms-content-db.PGUSER}}
SPRING_DATASOURCE_PASSWORD=${{cms-content-db.PGPASSWORD}}
PORT=8082
RAILWAY_ENVIRONMENT=production
```

### Media Service
```
SPRING_DATASOURCE_URL=${{cms-media-db.DATABASE_URL}}
SPRING_DATASOURCE_USERNAME=${{cms-media-db.PGUSER}}
SPRING_DATASOURCE_PASSWORD=${{cms-media-db.PGPASSWORD}}
AWS_S3_BUCKET=your-s3-bucket-name
AWS_REGION=ap-northeast-1
PORT=8083
RAILWAY_ENVIRONMENT=production
```

### User Service
```
SPRING_DATASOURCE_URL=${{cms-user-db.DATABASE_URL}}
SPRING_DATASOURCE_USERNAME=${{cms-user-db.PGUSER}}
SPRING_DATASOURCE_PASSWORD=${{cms-user-db.PGPASSWORD}}
PORT=8084
RAILWAY_ENVIRONMENT=production
```

### API Gateway
```
AUTH_SERVICE_URL=${{auth-service.RAILWAY_PUBLIC_DOMAIN}}
CONTENT_SERVICE_URL=${{content-service.RAILWAY_PUBLIC_DOMAIN}}
MEDIA_SERVICE_URL=${{media-service.RAILWAY_PUBLIC_DOMAIN}}
USER_SERVICE_URL=${{user-service.RAILWAY_PUBLIC_DOMAIN}}
JWT_SECRET=your-production-jwt-secret-key-change-this
ALLOWED_ORIGINS=*
PORT=8080
RAILWAY_ENVIRONMENT=production
```

### Frontend
```
NEXT_PUBLIC_API_BASE_URL=https://your-api-gateway-url.railway.app
NODE_ENV=production
```



