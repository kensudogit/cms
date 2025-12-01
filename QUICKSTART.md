# CMS クイックスタートガイド

## 前提条件

- Node.js 18以上
- Java 17以上
- PostgreSQL 14以上
- Docker (オプション)

## セットアップ手順

### 1. データベースのセットアップ

#### Docker Composeを使用する場合

```bash
cd C:\devlop\cms
docker-compose up -d
```

これで以下のデータベースが起動します：
- auth_db (ポート: 5432)
- content_db (ポート: 5433)
- media_db (ポート: 5434)
- user_db (ポート: 5435)

#### 手動でPostgreSQLをセットアップする場合

各サービス用のデータベースを作成してください：

```sql
CREATE DATABASE auth_db;
CREATE DATABASE content_db;
CREATE DATABASE media_db;
CREATE DATABASE user_db;
```

### 2. バックエンドサービスの起動

#### Auth Service

```bash
cd services/auth-service
./gradlew build
./gradlew bootRun
```

サービスは `http://localhost:8081` で起動します。

#### Content Service

```bash
cd services/content-service
./gradlew build
./gradlew bootRun
```

サービスは `http://localhost:8082` で起動します。

### 3. フロントエンドの起動

```bash
cd frontend
npm install
npm run dev
```

フロントエンドは `http://localhost:3000` で起動します。

## 使用方法

### 1. ユーザー登録

1. ブラウザで `http://localhost:3000` にアクセス
2. 「Don't have an account? Sign up」をクリック
3. 名前、メールアドレス、パスワードを入力して登録

### 2. ログイン

1. メールアドレスとパスワードを入力
2. 「Sign in」をクリック

### 3. コンテンツの作成

1. ダッシュボードで「Create New Content」をクリック
2. タイトル、スラッグ、本文、ステータスを入力
3. 「Create Content」をクリック

### 4. コンテンツの編集・削除

1. ダッシュボードでコンテンツをクリック
2. 「Edit」ボタンで編集、「Delete」ボタンで削除

## API エンドポイント

### Auth Service (ポート: 8081)

- `POST /api/auth/register` - ユーザー登録
- `POST /api/auth/login` - ログイン
- `GET /api/auth/health` - ヘルスチェック

### Content Service (ポート: 8082)

- `GET /api/content` - 全コンテンツ取得
- `GET /api/content/published` - 公開済みコンテンツ取得
- `GET /api/content/{id}` - コンテンツ詳細取得
- `GET /api/content/slug/{slug}` - スラッグでコンテンツ取得
- `POST /api/content` - コンテンツ作成
- `PUT /api/content/{id}` - コンテンツ更新
- `DELETE /api/content/{id}` - コンテンツ削除

## トラブルシューティング

### データベース接続エラー

- PostgreSQLが起動しているか確認
- `application.yml`の接続情報を確認
- データベースが作成されているか確認

### ポートが既に使用されている

- 別のポート番号に変更するか、使用中のプロセスを終了

### フロントエンドがバックエンドに接続できない

- バックエンドサービスが起動しているか確認
- `next.config.js`の`NEXT_PUBLIC_API_BASE_URL`を確認
- CORS設定を確認

## 次のステップ

- API Gatewayの設定
- 認証トークンの検証機能の追加
- メディアアップロード機能の実装
- AWS Lambda/Fargateへのデプロイ

