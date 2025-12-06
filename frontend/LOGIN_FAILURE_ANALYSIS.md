# ログイン失敗の原因分析

## 🔴 発見された問題

### 1. Auth Serviceが起動していない
- **状態**: ポート8081がLISTENING状態ではない
- **影響**: API GatewayがAuth Serviceにリクエストを転送できない
- **結果**: 500 Internal Server Error または Connection Refused

### 2. データベースにusersテーブルが存在しない
- **エラー**: `relation "users" does not exist`
- **原因**: JPAの自動テーブル作成が動作していない、または初期化が完了していない
- **影響**: ユーザーデータを取得できないため、ログインが失敗する

## 🔍 ログイン処理の流れ

1. **フロントエンド** → API Gateway (ポート8080)
   - POST `/api/auth/login`
   - リクエストボディ: `{ "email": "admin@example.com", "password": "password" }`

2. **API Gateway** → Auth Service (ポート8081)
   - リクエストを転送
   - **問題**: Auth Serviceが起動していない場合、ここで失敗

3. **Auth Service** → データベース (ポート5432)
   - ユーザーを検索: `SELECT * FROM users WHERE email = ?`
   - **問題**: usersテーブルが存在しない場合、ここで失敗

4. **パスワード検証**
   - BCryptでパスワードを検証
   - ハッシュ: `$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy`
   - 平文パスワード: `password`

5. **JWTトークン生成**
   - ログイン成功時にJWTトークンを生成
   - フロントエンドに返却

## ✅ 解決方法

### ステップ1: Auth Serviceを起動

```bash
cd C:\devlop\cms
gradlew.bat :services:auth-service:bootRun
```

または、`START_BACKEND_SERVICES.bat` を実行してください。

### ステップ2: データベーステーブルの確認と作成

Auth Serviceが起動すると、JPAが自動的にテーブルを作成します。

**確認方法:**
```bash
docker exec cms-postgres-auth psql -U postgres -d auth_db -c "\dt"
```

**テーブルが作成されない場合:**

1. `application.yml` の設定を確認:
   ```yaml
   spring:
     jpa:
       hibernate:
         ddl-auto: update  # または create
   ```

2. Auth Serviceを再起動

3. ログを確認してエラーがないかチェック

### ステップ3: 初期データの投入

`data.sql` が自動的に実行されるはずですが、実行されない場合は手動で実行:

```bash
docker exec -i cms-postgres-auth psql -U postgres -d auth_db < services/auth-service/src/main/resources/data.sql
```

または、Auth Serviceのログで以下を確認:
```
Executing SQL script from URL [file:.../data.sql]
```

### ステップ4: ユーザーデータの確認

```bash
docker exec cms-postgres-auth psql -U postgres -d auth_db -c "SELECT id, email, name, role, active FROM users;"
```

以下の3つのユーザーが存在することを確認:
- admin@example.com (ADMIN)
- editor@example.com (EDITOR)
- author@example.com (USER)

すべてのパスワードは `password` です。

## 🔍 トラブルシューティング

### 問題1: Auth Serviceが起動しない

**確認事項:**
1. ポート8081が使用されていないか確認
   ```bash
   netstat -ano | findstr :8081
   ```

2. データベース接続を確認
   ```bash
   docker ps | findstr cms-postgres-auth
   ```

3. ログを確認してエラーメッセージを確認

**解決方法:**
- ポートが使用中の場合は、プロセスを終了
- データベースが起動していない場合は、`docker-compose up -d` を実行
- ビルドエラーの場合は、`gradlew.bat clean build -x test` を実行

### 問題2: usersテーブルが作成されない

**確認事項:**
1. `ddl-auto` 設定が `update` または `create` になっているか
2. `defer-datasource-initialization: true` が設定されているか
3. Auth Serviceのログでエラーがないか確認

**解決方法:**
1. `application.yml` を確認
2. Auth Serviceを再起動
3. 手動でテーブルを作成（最後の手段）

### 問題3: パスワードが一致しない

**確認事項:**
1. データベースのパスワードハッシュを確認
   ```bash
   docker exec cms-postgres-auth psql -U postgres -d auth_db -c "SELECT email, password FROM users WHERE email = 'admin@example.com';"
   ```

2. BCryptハッシュが正しいか確認
   - 正しいハッシュ: `$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy`
   - 平文パスワード: `password`

**解決方法:**
- パスワードハッシュが正しくない場合は、`data.sql` を再実行
- または、新しいユーザーを登録してからログイン

### 問題4: JWTトークンが生成されない

**確認事項:**
1. `JWT_SECRET` が設定されているか
2. `JwtUtil` が正しく動作しているか
3. Auth Serviceのログでエラーがないか確認

**解決方法:**
- `application.yml` で `jwt.secret` を確認
- ログを確認してエラーメッセージを確認

## 📋 確認チェックリスト

- [ ] PostgreSQLデータベースが起動している
- [ ] Auth Serviceが起動している（ポート8081がLISTENING）
- [ ] usersテーブルが存在する
- [ ] 初期データ（3つのユーザー）が投入されている
- [ ] パスワードハッシュが正しい
- [ ] API Gatewayが起動している（ポート8080がLISTENING）
- [ ] フロントエンドが起動している（ポート3002がLISTENING）
- [ ] ブラウザでログインを試行
- [ ] エラーメッセージを確認
- [ ] ログインが成功する

## 💡 テスト用アカウント

以下のアカウントでログインを試してください:

1. **管理者**
   - メール: `admin@example.com`
   - パスワード: `password`
   - ロール: `ADMIN`

2. **編集者**
   - メール: `editor@example.com`
   - パスワード: `password`
   - ロール: `EDITOR`

3. **ユーザー**
   - メール: `author@example.com`
   - パスワード: `password`
   - ロール: `USER`

## 🔧 デバッグ方法

### 1. ログを確認

Auth Serviceのログで以下を確認:
- データベース接続の成功/失敗
- テーブル作成の成功/失敗
- データ投入の成功/失敗
- ログインリクエストの受信
- エラーメッセージ

### 2. データベースを直接確認

```bash
# テーブル一覧
docker exec cms-postgres-auth psql -U postgres -d auth_db -c "\dt"

# ユーザー一覧
docker exec cms-postgres-auth psql -U postgres -d auth_db -c "SELECT * FROM users;"

# 特定のユーザーを確認
docker exec cms-postgres-auth psql -U postgres -d auth_db -c "SELECT * FROM users WHERE email = 'admin@example.com';"
```

### 3. APIを直接テスト

```bash
# ヘルスチェック
curl http://localhost:8081/api/auth/health

# ログイン試行
curl -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"admin@example.com\",\"password\":\"password\"}"
```

## 📝 まとめ

ログイン失敗の主な原因は:

1. **Auth Serviceが起動していない** → サービスを起動
2. **usersテーブルが存在しない** → JPAが自動的に作成（サービス起動時）
3. **初期データが投入されていない** → `data.sql` が自動実行される（サービス起動時）
4. **パスワードが一致しない** → パスワードは `password` で統一されている

まず、`START_BACKEND_SERVICES.bat` を実行して、すべてのサービスを起動してください。

