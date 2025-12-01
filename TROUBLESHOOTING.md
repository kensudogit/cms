# トラブルシューティングガイド

## 500 Internal Server Error

### 症状
- `GET http://localhost:3001/ 500 (Internal Server Error)`
- ブラウザコンソールにエラーが表示される

### 原因と解決方法

#### 1. バックエンドサービスが起動していない

**確認方法:**
```bash
# 各サービスのポートを確認
netstat -ano | findstr :8080  # API Gateway
netstat -ano | findstr :8081  # Auth Service
netstat -ano | findstr :8082  # Content Service
```

**解決方法:**
各サービスを起動してください：

```bash
# Auth Service
cd services/auth-service
./gradlew bootRun

# Content Service
cd services/content-service
./gradlew bootRun

# API Gateway
cd services/api-gateway
./gradlew bootRun
```

#### 2. データベース接続エラー

**確認方法:**
- PostgreSQLが起動しているか確認
- データベースが作成されているか確認

**解決方法:**
```bash
# Docker Composeを使用する場合
cd C:\devlop\cms
docker-compose up -d

# 手動でPostgreSQLを起動する場合
# PostgreSQLサービスを起動
```

**データベースの作成:**
```sql
CREATE DATABASE auth_db;
CREATE DATABASE content_db;
CREATE DATABASE media_db;
CREATE DATABASE user_db;
```

#### 3. ポートの競合

**確認方法:**
```bash
netstat -ano | findstr :8080
netstat -ano | findstr :8081
```

**解決方法:**
- 使用中のポートを変更する
- または、使用中のプロセスを終了する

#### 4. API Gatewayの設定エラー

**確認事項:**
- `application.yml`の各サービスURLが正しいか
- 環境変数が正しく設定されているか

**解決方法:**
`services/api-gateway/src/main/resources/application.yml`を確認：

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: auth-service
          uri: ${AUTH_SERVICE_URL:http://localhost:8081}
```

#### 5. CORSエラー

**症状:**
- ブラウザコンソールにCORSエラーが表示される

**解決方法:**
API Gatewayの`application.yml`でCORS設定を確認：

```yaml
spring:
  cloud:
    gateway:
      globalcors:
        corsConfigurations:
          '[/**]':
            allowedOrigins: ${ALLOWED_ORIGINS:*}
```

## データベース接続エラー

### 症状
- `Connection refused` エラー
- `Authentication failed` エラー

### 解決方法

1. **PostgreSQLが起動しているか確認**
   ```bash
   # Windows
   services.msc で PostgreSQL サービスを確認
   
   # Docker
   docker ps
   ```

2. **接続情報を確認**
   - `application.yml`のデータベースURL
   - ユーザー名とパスワード

3. **データベースが存在するか確認**
   ```sql
   \l  -- データベース一覧
   ```

## フロントエンドの接続エラー

### 症状
- APIリクエストが失敗する
- ネットワークエラーが表示される

### 解決方法

1. **APIベースURLを確認**
   `frontend/next.config.js`:
   ```javascript
   NEXT_PUBLIC_API_BASE_URL: 'http://localhost:8080'
   ```

2. **バックエンドが起動しているか確認**
   ```bash
   curl http://localhost:8080/api/auth/health
   ```

3. **CORS設定を確認**
   API GatewayでCORSが有効になっているか確認

## ログの確認方法

### バックエンドログ
各サービスのコンソール出力を確認：
```bash
# Auth Service
cd services/auth-service
./gradlew bootRun

# ログにエラーが表示される
```

### フロントエンドログ
ブラウザの開発者ツール（F12）で：
- Console タブ: JavaScriptエラー
- Network タブ: HTTPリクエスト/レスポンス

## よくある問題

### 1. JWT秘密鍵のエラー
**エラー:** `JWT signature does not match`
**解決:** `JWT_SECRET`環境変数を確認

### 2. ポートが既に使用されている
**エラー:** `Port 8080 is already in use`
**解決:** 使用中のプロセスを終了するか、ポートを変更

### 3. 依存関係のエラー
**エラー:** `ClassNotFoundException`
**解決:** 
```bash
./gradlew clean build
```

### 4. データベースマイグレーションエラー
**エラー:** `Table already exists`
**解決:** 
```yaml
spring:
  jpa:
    hibernate:
      ddl-auto: update  # または validate
```

## デバッグモードの有効化

### バックエンド
`application.yml`:
```yaml
logging:
  level:
    com.cms: DEBUG
    org.springframework: DEBUG
```

### フロントエンド
ブラウザの開発者ツールでネットワークリクエストを確認

## サポート

問題が解決しない場合：
1. ログファイルを確認
2. エラーメッセージの全文を確認
3. 環境変数を確認
4. ネットワーク接続を確認

