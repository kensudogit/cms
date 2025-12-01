# 🚀 今すぐバックエンドを起動する方法

## エラー: ERR_CONNECTION_REFUSED

バックエンドサービスが起動していません。以下の手順で起動してください。

## 最速の起動方法

### ステップ1: PostgreSQLを起動

```bash
cd C:\devlop\cms
docker-compose up -d
```

### ステップ2: バックエンドサービスを起動

**3つの新しいコマンドプロンプトを開いて、それぞれで以下を実行：**

#### ウィンドウ1: Auth Service
```bash
cd C:\devlop\cms\services\auth-service
gradlew.bat bootRun
```

#### ウィンドウ2: Content Service
```bash
cd C:\devlop\cms\services\content-service
gradlew.bat bootRun
```

#### ウィンドウ3: API Gateway
```bash
cd C:\devlop\cms\services\api-gateway
gradlew.bat bootRun
```

### ステップ3: 起動確認

各サービスが起動するまで30-60秒待ちます。

以下のURLをブラウザで開いて確認：

✅ http://localhost:8080/api/auth/health  
✅ http://localhost:8081/api/auth/health  
✅ http://localhost:8082/api/content  

### ステップ4: フロントエンドを使用

すべてのサービスが起動したら、フロントエンドページをリロードしてください。

## もしgradlew.batがない場合

ルートディレクトリから実行：

```bash
cd C:\devlop\cms

# Auth Service
gradlew.bat :services:auth-service:bootRun

# Content Service（別ウィンドウ）
gradlew.bat :services:content-service:bootRun

# API Gateway（別ウィンドウ）
gradlew.bat :services:api-gateway:bootRun
```

## サービスの停止

各ウィンドウで`Ctrl+C`を押すか、以下を実行：

```bash
stop-backend.bat
```

## トラブルシューティング

### Javaが見つからない
```bash
java -version
```
Java 21がインストールされているか確認してください。

### ポートが使用中
```bash
netstat -ano | findstr ":8080"
taskkill /F /PID <プロセスID>
```

### データベースエラー
```bash
docker ps
docker-compose up -d
```

詳細は `QUICK_FIX_CONNECTION_REFUSED.md` を参照してください。



