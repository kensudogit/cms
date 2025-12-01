# 🚨 緊急対応: 接続拒否エラーの解決

## 現在の状況

バックエンドサービスが起動していないか、起動に失敗している可能性があります。

## 即座に実行すべき手順

### ステップ1: サービスの起動状況を確認

```bash
cd C:\devlop\cms
test-api.bat
```

または、手動で確認：

```bash
# ポートの確認
netstat -ano | findstr ":8080"
netstat -ano | findstr ":8081"
netstat -ano | findstr ":8082"

# Javaプロセスの確認
tasklist | findstr java
```

### ステップ2: サービスが起動していない場合

#### 方法A: 自動起動スクリプト

```bash
cd C:\devlop\cms
start-all-services.bat
```

#### 方法B: 手動起動（推奨 - エラーを確認できる）

**3つの新しいコマンドプロンプトを開いて、それぞれで実行：**

**ウィンドウ1: Auth Service**
```bash
cd C:\devlop\cms
gradlew.bat :services:auth-service:bootRun
```

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

### ステップ3: 起動エラーの確認

各ウィンドウでエラーメッセージを確認してください。

#### よくあるエラーと解決方法

**1. データベース接続エラー**
```
Connection refused
```
→ PostgreSQLが起動しているか確認：
```bash
docker ps
```

**2. ポートが使用中**
```
Port 8080 is already in use
```
→ 使用中のプロセスを終了：
```bash
netstat -ano | findstr ":8080"
taskkill /F /PID <プロセスID>
```

**3. ビルドエラー**
```
BUILD FAILED
```
→ クリーンビルドを実行：
```bash
cd C:\devlop\cms
gradlew.bat clean build -x test
```

### ステップ4: 起動確認

各サービスが起動したら（30-60秒後）、以下を確認：

```bash
# ブラウザで開く
http://localhost:8080/api/auth/health
http://localhost:8081/api/auth/health
http://localhost:8082/api/content
```

正常に応答したら成功です。

### ステップ5: フロントエンドをリロード

ブラウザでフロントエンドページを**完全にリロード（Ctrl+F5）**してください。

## サービスが起動しない場合の対処

### ログを確認

各サービスのウィンドウで、最後のエラーメッセージを確認してください。

### 最小構成で起動

まずAuth Serviceだけを起動して確認：

```bash
cd C:\devlop\cms
gradlew.bat :services:auth-service:bootRun
```

起動したら、以下にアクセス：
- http://localhost:8081/api/auth/health

これが動作すれば、他のサービスも同様に起動できるはずです。

## 緊急時の代替案

一時的に、フロントエンドを直接Auth Serviceに接続：

`frontend/next.config.js`を一時的に変更：
```javascript
NEXT_PUBLIC_API_BASE_URL: 'http://localhost:8081'
```

ただし、これは一時的な解決策です。API Gateway経由での接続を推奨します。



