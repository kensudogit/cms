# PostgreSQL利用設定ガイド

## ✅ PostgreSQLデータベースの状態

PostgreSQLデータベースは正常に起動しています：

- ✅ **postgres-auth** (ポート5432) - 認証データベース
- ✅ **postgres-content** (ポート5433) - コンテンツデータベース
- ✅ **postgres-media** (ポート5434) - メディアデータベース
- ✅ **postgres-user** (ポート5435) - ユーザーデータベース

## 🔴 現在の問題

PostgreSQLは利用可能ですが、**バックエンドサービスが起動していない**ため、データベースに接続できていません：

- ❌ **Auth Service** (ポート8081) - 未起動
- ❌ **Content Service** (ポート8082) - 未起動
- ✅ **API Gateway** (ポート8080) - 起動中

## ✅ 解決方法

### ステップ1: バックエンドサービスを起動

**方法1: 自動起動スクリプトを使用（推奨）**

`C:\devlop\cms\START_BACKEND_SERVICES.bat` をダブルクリックしてください。

**方法2: 手動で起動**

新しいコマンドプロンプトウィンドウを2つ開いて、それぞれで以下を実行：

**ウィンドウ1 - Auth Service:**
```bash
cd C:\devlop\cms
gradlew.bat :services:auth-service:bootRun
```

**ウィンドウ2 - Content Service:**
```bash
cd C:\devlop\cms
gradlew.bat :services:content-service:bootRun
```

### ステップ2: サービスが起動するまで待つ

各サービスのログに以下のようなメッセージが表示されるまで待ちます（通常60-90秒）：

```
Started AuthServiceApplication in X.XXX seconds
Started ContentServiceApplication in X.XXX seconds
```

### ステップ3: データベース接続を確認

サービスが起動すると、自動的に以下が実行されます：

1. **JPAがテーブルを作成**
   - Auth Service: `users` テーブル
   - Content Service: `contents` テーブル

2. **初期データが投入される**
   - `data.sql` が自動実行される
   - ユーザーデータが投入される

### ステップ4: データベースの状態を確認

新しいターミナルで以下を実行：

```bash
# Auth Serviceのデータベースを確認
docker exec cms-postgres-auth psql -U postgres -d auth_db -c "\dt"
docker exec cms-postgres-auth psql -U postgres -d auth_db -c "SELECT * FROM users;"

# Content Serviceのデータベースを確認
docker exec cms-postgres-content psql -U postgres -d content_db -c "\dt"
docker exec cms-postgres-content psql -U postgres -d content_db -c "SELECT * FROM contents;"
```

### ステップ5: ブラウザで再試行

1. **ブラウザをリフレッシュ**（F5）
2. **ログインを試行**
   - メール: `admin@example.com`
   - パスワード: `password`
3. **コンテンツ一覧が表示されることを確認**

## 📋 サービス起動順序

1. **PostgreSQLデータベース**（既に起動中）✅
   - postgres-auth: ポート5432
   - postgres-content: ポート5433
   - postgres-media: ポート5434
   - postgres-user: ポート5435

2. **Auth Service**（ポート8081）⏳
   - 認証・認可を担当
   - PostgreSQL (auth_db) に接続
   - `users` テーブルを作成
   - 初期データを投入

3. **Content Service**（ポート8082）⏳
   - コンテンツ管理を担当
   - PostgreSQL (content_db) に接続
   - `contents` テーブルを作成

4. **API Gateway**（ポート8080）✅
   - すべてのリクエストのエントリーポイント
   - 各サービスにリクエストをルーティング

## 🔍 データベース接続設定

### Auth Service
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/auth_db
    username: postgres
    password: postgres
```

### Content Service
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5433/content_db
    username: postgres
    password: postgres
```

## 💡 PostgreSQLの利点

PostgreSQLを利用することで：

1. **データの永続化**
   - アプリケーションを再起動してもデータが保持される
   - データベースに直接アクセスしてデータを確認・編集できる

2. **本番環境に近い開発**
   - 実際のデータベースを使用して開発できる
   - 本番環境と同じ環境でテストできる

3. **データの整合性**
   - リレーショナルデータベースの機能を活用できる
   - トランザクション管理が可能

4. **スケーラビリティ**
   - 大量のデータを効率的に管理できる
   - インデックスやクエリ最適化が可能

## 🆘 トラブルシューティング

### サービスが起動しない場合

1. **ポートの競合を確認**
   ```bash
   netstat -ano | findstr ":8081 :8082"
   ```

2. **データベース接続を確認**
   ```bash
   docker ps | findstr "cms-postgres"
   ```

3. **ログを確認**
   - 各サービスのコマンドプロンプトウィンドウでエラーメッセージを確認

### データベースに接続できない場合

1. **Dockerコンテナが起動しているか確認**
   ```bash
   docker ps
   ```

2. **データベースを再起動**
   ```bash
   cd C:\devlop\cms
   docker-compose restart
   ```

3. **接続情報を確認**
   - `application.yml` のデータソース設定を確認

### テーブルが作成されない場合

1. **JPAの設定を確認**
   ```yaml
   spring:
     jpa:
       hibernate:
         ddl-auto: update  # または create
   ```

2. **サービスを再起動**
   - サービスを停止して再起動

## 📝 確認チェックリスト

- [ ] PostgreSQLデータベースが起動している
- [ ] Auth Serviceが起動している（ポート8081がLISTENING）
- [ ] Content Serviceが起動している（ポート8082がLISTENING）
- [ ] API Gatewayが起動している（ポート8080がLISTENING）
- [ ] usersテーブルが作成されている
- [ ] contentsテーブルが作成されている
- [ ] 初期データが投入されている
- [ ] ブラウザでログインできる
- [ ] コンテンツ一覧が表示される
- [ ] データベースからデータが取得できる

## 🎯 まとめ

PostgreSQLは利用可能です。バックエンドサービス（Auth Service、Content Service）を起動すれば、PostgreSQLデータベースに接続してデータを取得できるようになります。

`START_BACKEND_SERVICES.bat` を実行して、すべてのサービスを起動してください。

