# バックエンドサービス起動手順

## エラー: ERR_CONNECTION_REFUSED

このエラーは、バックエンドサービスが起動していないことを示しています。

## 解決方法

### 方法1: 自動起動スクリプト（推奨）

#### ステップ1: PostgreSQLデータベースの起動

```bash
cd C:\devlop\cms
docker-compose up -d
```

#### ステップ2: バックエンドサービスの起動

**オプションA: 個別ウィンドウで起動（推奨）**

```bash
start-backend.bat
```

各サービスが別々のウィンドウで起動します。ログを確認できます。

**オプションB: バックグラウンドで起動**

```bash
start-backend-simple.bat
```

### 方法2: 手動起動

#### ステップ1: PostgreSQLデータベース

```bash
cd C:\devlop\cms
docker-compose up -d
```

#### ステップ2: Auth Service（新しいターミナル）

```bash
cd C:\devlop\cms\services\auth-service
gradlew.bat bootRun
```

#### ステップ3: Content Service（新しいターミナル）

```bash
cd C:\devlop\cms\services\content-service
gradlew.bat bootRun
```

#### ステップ4: API Gateway（新しいターミナル）

```bash
cd C:\devlop\cms\services\api-gateway
gradlew.bat bootRun
```

## サービスの確認

### サービスステータスの確認

```bash
check-services.bat
```

### 手動で確認

ブラウザまたはcurlで以下にアクセス：

- API Gateway: http://localhost:8080/api/auth/health
- Auth Service: http://localhost:8081/api/auth/health
- Content Service: http://localhost:8082/api/content

### ポートの確認

```bash
netstat -ano | findstr ":8080"
netstat -ano | findstr ":8081"
netstat -ano | findstr ":8082"
```

## サービスの停止

```bash
stop-backend.bat
```

または、各サービスのウィンドウで`Ctrl+C`を押して停止。

## トラブルシューティング

### ポートが既に使用されている

```bash
# ポート8080を使用しているプロセスを確認
netstat -ano | findstr ":8080"

# プロセスIDを確認後、終了
taskkill /F /PID <プロセスID>
```

### Javaが見つからない

```bash
java -version
```

Java 21がインストールされているか確認してください。

### データベース接続エラー

```bash
# PostgreSQLが起動しているか確認
docker ps

# 起動していない場合
docker-compose up -d
```

### Gradleが見つからない

各サービスディレクトリに`gradlew.bat`があるか確認してください。
ない場合は、ルートディレクトリから実行：

```bash
cd C:\devlop\cms
gradlew.bat :services:auth-service:bootRun
```

## 起動順序

1. PostgreSQLデータベース（docker-compose）
2. Auth Service（ポート8081）
3. Content Service（ポート8082）
4. API Gateway（ポート8080）

**重要**: API Gatewayは最後に起動してください。他のサービスが起動してから起動する必要があります。

## 起動時間

各サービスは起動に30-60秒かかります。すべてのサービスが起動するまで待ってからフロントエンドを使用してください。



