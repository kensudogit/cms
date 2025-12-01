# ERR_CONNECTION_REFUSED エラー修正ガイド

## 問題

フロントエンドから`localhost:8080`に接続できないエラーが発生しています。

## 原因

バックエンドサービス（API Gateway、Auth Service、Content Service）が起動していません。

## 解決方法

### ステップ1: PostgreSQLデータベースの起動

```bash
cd C:\devlop\cms
docker-compose up -d
```

### ステップ2: バックエンドサービスの起動

#### オプションA: 自動起動スクリプト

```bash
start-backend.bat
```

#### オプションB: 手動起動（3つのターミナルが必要）

**ターミナル1: Auth Service**
```bash
cd C:\devlop\cms\services\auth-service
gradlew.bat bootRun
```
または、ルートから：
```bash
cd C:\devlop\cms
gradlew.bat :services:auth-service:bootRun
```

**ターミナル2: Content Service**
```bash
cd C:\devlop\cms\services\content-service
gradlew.bat bootRun
```
または、ルートから：
```bash
cd C:\devlop\cms
gradlew.bat :services:content-service:bootRun
```

**ターミナル3: API Gateway**
```bash
cd C:\devlop\cms\services\api-gateway
gradlew.bat bootRun
```
または、ルートから：
```bash
cd C:\devlop\cms
gradlew.bat :services:api-gateway:bootRun
```

### ステップ3: サービスの起動確認

各サービスが起動するまで30-60秒待ちます。

以下のURLにアクセスして確認：

- http://localhost:8080/api/auth/health (API Gateway)
- http://localhost:8081/api/auth/health (Auth Service)
- http://localhost:8082/api/content (Content Service)

### ステップ4: フロントエンドの再読み込み

ブラウザでフロントエンドページをリロードしてください。

## トラブルシューティング

### Gradleが見つからない

各サービスディレクトリに`gradlew.bat`がない場合、ルートディレクトリの`gradlew.bat`を使用してください。

### Javaが見つからない

```bash
java -version
```

Java 21がインストールされているか確認してください。

### ポートが既に使用されている

```bash
# 使用中のポートを確認
netstat -ano | findstr ":8080"
netstat -ano | findstr ":8081"
netstat -ano | findstr ":8082"

# プロセスを終了
taskkill /F /PID <プロセスID>
```

### データベース接続エラー

```bash
# PostgreSQLが起動しているか確認
docker ps

# 起動していない場合
docker-compose up -d
```

## 起動順序の重要性

1. **PostgreSQL** - 最初に起動
2. **Auth Service** - 次に起動
3. **Content Service** - 次に起動
4. **API Gateway** - 最後に起動（他のサービスが起動してから）

## 確認方法

`check-services.bat`を実行して、すべてのサービスが起動しているか確認できます。

