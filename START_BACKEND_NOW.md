# バックエンドサービス起動ガイド

## 問題
`ERR_CONNECTION_REFUSED` エラーが発生しています。これは、バックエンドサービス（API Gateway、Content Service）が起動していないことを示しています。

## 解決方法

### 方法1: 自動起動スクリプトを使用（推奨）

1. **データベースの起動**
```bash
cd C:\devlop\cms
docker-compose up -d
```

2. **バックエンドサービスの起動**
```bash
# 方法A: すべてのサービスを起動
start-backend.bat

# 方法B: シンプルな起動
SIMPLE_START.bat
```

### 方法2: 手動で起動

#### ステップ1: データベースの起動

```bash
cd C:\devlop\cms
docker-compose up -d
```

データベースが起動するまで約10秒待ちます。

#### ステップ2: Auth Serviceの起動（ポート8081）

新しいコマンドプロンプトを開いて：
```bash
cd C:\devlop\cms
gradlew.bat :services:auth-service:bootRun
```

#### ステップ3: Content Serviceの起動（ポート8082）

別のコマンドプロンプトを開いて：
```bash
cd C:\devlop\cms
gradlew.bat :services:content-service:bootRun
```

#### ステップ4: API Gatewayの起動（ポート8080）

別のコマンドプロンプトを開いて：
```bash
cd C:\devlop\cms
gradlew.bat :services:api-gateway:bootRun
```

### 起動確認

すべてのサービスが起動したら、以下のURLで確認できます：

- API Gateway: http://localhost:8080
- Auth Service: http://localhost:8081
- Content Service: http://localhost:8082

### サービス起動の確認方法

ブラウザまたはcurlで以下にアクセス：

```bash
# API Gateway経由でContent Serviceにアクセス
curl http://localhost:8080/api/content

# 直接Content Serviceにアクセス
curl http://localhost:8082/api/content
```

## トラブルシューティング

### ポートが既に使用されている

```bash
# ポート8080, 8081, 8082を使用しているプロセスを確認
netstat -ano | findstr :8080
netstat -ano | findstr :8081
netstat -ano | findstr :8082

# プロセスを終了する場合（PIDを確認してから）
taskkill /PID <PID> /F
```

### データベース接続エラー

1. PostgreSQLが起動しているか確認：
```bash
docker ps
```

2. データベースが作成されているか確認：
```bash
docker exec -it cms-auth-db psql -U postgres -l
docker exec -it cms-content-db psql -U postgres -l
```

### Javaがインストールされていない

Java 21以上が必要です。インストールされていない場合は：
- Oracle JDK 21
- OpenJDK 21
- Amazon Corretto 21

のいずれかをインストールしてください。

## 起動順序

1. **データベース** (docker-compose)
2. **Auth Service** (約30秒待機)
3. **Content Service** (約30秒待機)
4. **API Gateway** (約30秒待機)

合計で約2-3分かかります。

## 注意事項

- 各サービスは別々のコマンドプロンプトウィンドウで起動されます
- サービスを停止するには、各ウィンドウで `Ctrl+C` を押すか、`stop-backend.bat` を実行
- フロントエンドは、すべてのバックエンドサービスが起動してから使用してください


