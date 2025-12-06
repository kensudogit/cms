# データベース初期化ガイド

このドキュメントでは、モックサンプルデータをデータベースに格納する方法を説明します。

## 概要

モックサンプルデータは、アプリケーション起動時に自動的にデータベースに投入されます。

- **auth-service**: ユーザーデータ（3件）
- **content-service**: コンテンツデータ（10件）

## データの内容

### ユーザーデータ（auth-service）

| ID | Email | Name | Role | Password |
|----|-------|------|------|----------|
| 1 | admin@example.com | 管理者 | ADMIN | password |
| 2 | editor@example.com | 編集者 | EDITOR | password |
| 3 | author@example.com | 執筆者 | USER | password |

**注意**: すべてのユーザーのパスワードは `password` です（BCryptでハッシュ化済み）

### コンテンツデータ（content-service）

- 公開済み: 7件（ID: 1, 2, 4, 6, 7, 8, 10）
- 下書き: 3件（ID: 3, 5, 9）

## 自動投入の仕組み

Spring Bootは、`src/main/resources/data.sql` ファイルを自動的に実行します。

### 設定

`application.yml` に以下の設定が含まれています：

```yaml
spring:
  jpa:
    defer-datasource-initialization: true
  sql:
    init:
      mode: always
      data-locations: classpath:data.sql
```

### 動作

1. アプリケーション起動時
2. スキーマが作成/更新された後
3. `data.sql` が自動実行される
4. データが投入される（既存データがある場合はスキップ）

## 手動でデータを投入する場合

### PostgreSQLに直接接続

```bash
# auth-service用データベース
psql -h localhost -U postgres -d auth_db -f services/auth-service/src/main/resources/data.sql

# content-service用データベース
psql -h localhost -U postgres -d content_db -f services/content-service/src/main/resources/data.sql
```

### Docker Composeを使用している場合

```bash
# auth-service用データベース
docker exec -i cms-auth-db psql -U postgres -d auth_db < services/auth-service/src/main/resources/data.sql

# content-service用データベース
docker exec -i cms-content-db psql -U postgres -d content_db < services/content-service/src/main/resources/data.sql
```

## データのリセット

既存のデータを削除して再投入する場合は、`data.sql` の以下の行のコメントを外してください：

```sql
-- DELETE FROM users;  -- auth-service用
-- DELETE FROM contents;  -- content-service用
```

**注意**: 本番環境では、この行はコメントアウトしたままにしてください。

## トラブルシューティング

### データが投入されない

1. `application.yml` の設定を確認
2. `data.sql` ファイルが `src/main/resources/` に存在することを確認
3. ログでエラーがないか確認
4. データベース接続が正常か確認

### 重複エラー

`ON CONFLICT (id) DO NOTHING` により、既存のデータがある場合はスキップされます。これは正常な動作です。

### シーケンスエラー

IDを手動で設定している場合、シーケンスがリセットされます：

```sql
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('contents_id_seq', (SELECT MAX(id) FROM contents));
```

## 確認方法

### ユーザーデータの確認

```sql
SELECT id, email, name, role FROM users;
```

### コンテンツデータの確認

```sql
SELECT id, title, status, author_id FROM contents;
```

## 注意事項

- 本番環境では、`data.sql` の `DELETE` 文はコメントアウトしてください
- パスワードは開発環境用のものです。本番環境では必ず変更してください
- データベースのバックアップを定期的に取得してください



