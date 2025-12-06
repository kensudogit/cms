# Railway完全公開デプロイ - チェックリスト

## 📋 デプロイ前の準備

- [ ] Railwayアカウントを作成（https://railway.app）
- [ ] GitHubリポジトリにコードをプッシュ
- [ ] 本番環境用のJWT秘密鍵を準備（32文字以上）

## 🗄️ データベースの作成（4つ）

- [ ] `cms-auth-db` - PostgreSQL
- [ ] `cms-content-db` - PostgreSQL
- [ ] `cms-media-db` - PostgreSQL
- [ ] `cms-user-db` - PostgreSQL

## 🔧 バックエンドサービスのデプロイ（5つ）

### Auth Service
- [ ] Root Directory: `services/auth-service`
- [ ] Start Command: `java -jar ../../services/auth-service/build/libs/auth-service.jar`
- [ ] 環境変数設定:
  - [ ] `SPRING_DATASOURCE_URL=${{cms-auth-db.DATABASE_URL}}`
  - [ ] `SPRING_DATASOURCE_USERNAME=${{cms-auth-db.PGUSER}}`
  - [ ] `SPRING_DATASOURCE_PASSWORD=${{cms-auth-db.PGPASSWORD}}`
  - [ ] `JWT_SECRET=your-production-jwt-secret-key`
  - [ ] `PORT=8081`
- [ ] パブリックドメインを生成
- [ ] デプロイ完了を確認

### Content Service
- [ ] Root Directory: `services/content-service`
- [ ] Start Command: `java -jar ../../services/content-service/build/libs/content-service.jar`
- [ ] 環境変数設定:
  - [ ] `SPRING_DATASOURCE_URL=${{cms-content-db.DATABASE_URL}}`
  - [ ] `SPRING_DATASOURCE_USERNAME=${{cms-content-db.PGUSER}}`
  - [ ] `SPRING_DATASOURCE_PASSWORD=${{cms-content-db.PGPASSWORD}}`
  - [ ] `PORT=8082`
- [ ] パブリックドメインを生成
- [ ] デプロイ完了を確認
- [ ] URLをコピー（API Gatewayの環境変数で使用）

### Media Service
- [ ] Root Directory: `services/media-service`
- [ ] Start Command: `java -jar ../../services/media-service/build/libs/media-service.jar`
- [ ] 環境変数設定:
  - [ ] `SPRING_DATASOURCE_URL=${{cms-media-db.DATABASE_URL}}`
  - [ ] `SPRING_DATASOURCE_USERNAME=${{cms-media-db.PGUSER}}`
  - [ ] `SPRING_DATASOURCE_PASSWORD=${{cms-media-db.PGPASSWORD}}`
  - [ ] `PORT=8083`
- [ ] パブリックドメインを生成
- [ ] デプロイ完了を確認
- [ ] URLをコピー（API Gatewayの環境変数で使用）

### User Service
- [ ] Root Directory: `services/user-service`
- [ ] Start Command: `java -jar ../../services/user-service/build/libs/user-service.jar`
- [ ] 環境変数設定:
  - [ ] `SPRING_DATASOURCE_URL=${{cms-user-db.DATABASE_URL}}`
  - [ ] `SPRING_DATASOURCE_USERNAME=${{cms-user-db.PGUSER}}`
  - [ ] `SPRING_DATASOURCE_PASSWORD=${{cms-user-db.PGPASSWORD}}`
  - [ ] `PORT=8084`
- [ ] パブリックドメインを生成
- [ ] デプロイ完了を確認
- [ ] URLをコピー（API Gatewayの環境変数で使用）

### API Gateway（重要）
- [ ] Root Directory: `services/api-gateway`
- [ ] Start Command: `java -jar ../../services/api-gateway/build/libs/api-gateway.jar`
- [ ] 環境変数設定:
  - [ ] `AUTH_SERVICE_URL=https://実際のauth-service-url.railway.app`
  - [ ] `CONTENT_SERVICE_URL=https://実際のcontent-service-url.railway.app`
  - [ ] `MEDIA_SERVICE_URL=https://実際のmedia-service-url.railway.app`
  - [ ] `USER_SERVICE_URL=https://実際のuser-service-url.railway.app`
  - [ ] `JWT_SECRET=your-production-jwt-secret-key`
  - [ ] `ALLOWED_ORIGINS=*`
  - [ ] `PORT=8080`
- [ ] パブリックドメインを生成（**メイン公開URL**）
- [ ] デプロイ完了を確認
- [ ] URLをコピー（フロントエンドの環境変数で使用）

## 🎨 フロントエンドのデプロイ

- [ ] Root Directory: `frontend`
- [ ] Build Command: `npm install && npm run build`
- [ ] Start Command: `npm start`
- [ ] 環境変数設定:
  - [ ] `NEXT_PUBLIC_API_BASE_URL=https://api-gateway-url.railway.app`
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=3000`
- [ ] パブリックドメインを生成（**フロントエンド公開URL**）
- [ ] デプロイ完了を確認

## ✅ デプロイ後の確認

### サービスヘルスチェック
- [ ] API Gateway: `curl https://api-gateway-url.railway.app/api/content`
- [ ] Auth Service: `curl https://auth-service-url.railway.app/api/auth/health`
- [ ] Content Service: `curl https://content-service-url.railway.app/api/content`

### フロントエンド確認
- [ ] ブラウザでフロントエンドURLにアクセス
- [ ] 開発者ツールのコンソールでエラーがないか確認
- [ ] ログイン機能をテスト
- [ ] コンテンツ作成機能をテスト
- [ ] コンテンツ編集機能をテスト
- [ ] コンテンツ削除機能をテスト

### データベース確認
- [ ] 各データベースのテーブルが作成されているか確認
- [ ] 初期データ（data.sql）が投入されているか確認

## 🔒 セキュリティ確認

- [ ] 本番環境用の強力なJWT秘密鍵を使用
- [ ] データベース接続情報が環境変数で管理されている
- [ ] CORS設定が適切（完全公開モード: `ALLOWED_ORIGINS=*`）
- [ ] HTTPSが使用されている（Railwayが自動提供）
- [ ] 環境変数に機密情報が含まれていないか確認

## 📝 メモ

### 生成されたURL（記録用）

- Auth Service: `https://____________________.railway.app`
- Content Service: `https://____________________.railway.app`
- Media Service: `https://____________________.railway.app`
- User Service: `https://____________________.railway.app`
- API Gateway: `https://____________________.railway.app`
- Frontend: `https://____________________.railway.app`

### JWT Secret
```
（ここに使用したJWT秘密鍵を記録）
```

## 🆘 トラブルシューティング

### ビルドエラー
- [ ] Java 21が使用されているか確認
- [ ] Gradleビルドログを確認
- [ ] 依存関係が正しく解決されているか確認

### データベース接続エラー
- [ ] 環境変数 `SPRING_DATASOURCE_URL` が正しく設定されているか確認
- [ ] Railwayのデータベースサービスが起動しているか確認

### CORSエラー
- [ ] `ALLOWED_ORIGINS` 環境変数を確認
- [ ] フロントエンドのURLが許可されているか確認

### サービス間通信エラー
- [ ] API Gatewayの環境変数で各サービスのURLが正しく設定されているか確認
- [ ] サービス名ではなく、実際のRailway URLを使用しているか確認

