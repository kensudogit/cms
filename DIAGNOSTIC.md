# 🔍 診断ガイド

## 現在の状況

- Javaプロセス: 12個実行中
- ポート8080: 未使用
- ポート8081: 未使用
- ポート8082: 未使用

## 問題の可能性

サービスが起動に失敗している可能性があります。

## 診断手順

### ステップ1: 個別にサービスを起動してエラーを確認

#### Auth Serviceのみ起動

```bash
cd C:\devlop\cms
start-auth-only.bat
```

または

```bash
cd C:\devlop\cms
gradlew.bat :services:auth-service:bootRun
```

ウィンドウでエラーメッセージを確認してください。

### ステップ2: よくあるエラーと解決方法

#### エラー1: データベース接続エラー

```
Connection to localhost:5432 refused
```

**解決方法:**
```bash
docker ps
docker-compose up -d
```

#### エラー2: ポートが使用中

```
Port 8081 is already in use
```

**解決方法:**
```bash
netstat -ano | findstr ":8081"
taskkill /F /PID <プロセスID>
```

#### エラー3: ビルドエラー

```
BUILD FAILED
```

**解決方法:**
```bash
cd C:\devlop\cms
gradlew.bat clean build -x test
```

#### エラー4: クラスが見つからない

```
ClassNotFoundException
```

**解決方法:**
```bash
cd C:\devlop\cms
gradlew.bat clean build -x test
```

### ステップ3: ログの確認

各サービスのウィンドウで、最後のエラーメッセージを確認してください。

## 推奨される起動手順

### 方法1: 1つずつ起動（推奨）

**ウィンドウ1: Auth Service**
```bash
cd C:\devlop\cms
gradlew.bat :services:auth-service:bootRun
```

起動が成功したら（"Started AuthServiceApplication"が表示されたら）、次に進みます。

**ウィンドウ2: Content Service**
```bash
cd C:\devlop\cms
gradlew.bat :services:content-service:bootRun
```

**ウィンドウ3: API Gateway**
```bash
cd C:\devlop\cms
gradlew.bat :services:api-gateway:bootRun
```

### 方法2: 自動起動スクリプト

```bash
cd C:\devlop\cms
SIMPLE_START.bat
```

## 起動確認

各サービスが起動したら、以下を確認：

- http://localhost:8081/api/auth/health (Auth Service)
- http://localhost:8082/api/content (Content Service)
- http://localhost:8080/api/auth/health (API Gateway)

## 次のステップ

1. 各サービスを個別に起動
2. エラーメッセージを確認
3. エラーがあれば修正
4. すべてのサービスが起動したら、フロントエンドをリロード

