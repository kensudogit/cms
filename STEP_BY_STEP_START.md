# 📋 ステップバイステップ起動ガイド

## 接続拒否エラーの解決手順

### ステップ1: 既存のJavaプロセスを停止

```bash
cd C:\devlop\cms
taskkill /F /IM java.exe
```

### ステップ2: PostgreSQLの確認

```bash
docker ps
```

PostgreSQLが起動していない場合：

```bash
docker-compose up -d
```

### ステップ3: サービスを1つずつ起動

#### 3-1. Auth Serviceを起動

**新しいコマンドプロンプトを開いて：**

```bash
cd C:\devlop\cms
gradlew.bat :services:auth-service:bootRun
```

**確認:**
- エラーメッセージがないこと
- "Started AuthServiceApplication" が表示されること（30-60秒後）
- ブラウザで http://localhost:8081/api/auth/health にアクセスして確認

#### 3-2. Content Serviceを起動

**別の新しいコマンドプロンプトを開いて：**

```bash
cd C:\devlop\cms
gradlew.bat :services:content-service:bootRun
```

**確認:**
- "Started ContentServiceApplication" が表示されること
- ブラウザで http://localhost:8082/api/content にアクセスして確認

#### 3-3. API Gatewayを起動

**別の新しいコマンドプロンプトを開いて：**

```bash
cd C:\devlop\cms
gradlew.bat :services:api-gateway:bootRun
```

**確認:**
- "Started ApiGatewayApplication" が表示されること
- ブラウザで http://localhost:8080/api/auth/health にアクセスして確認

### ステップ4: フロントエンドをリロード

すべてのサービスが起動したら：

1. ブラウザでフロントエンドページを開く
2. **Ctrl+F5** で完全にリロード
3. ログイン/登録を試す

## エラーが発生した場合

### エラーメッセージを確認

各サービスのウィンドウで、最後に表示されたエラーメッセージを確認してください。

### よくあるエラー

**1. データベース接続エラー**
```
Connection to localhost:5432 refused
```
→ `docker-compose up -d` を実行

**2. ポートが使用中**
```
Port 8081 is already in use
```
→ `netstat -ano | findstr ":8081"` で確認し、プロセスを終了

**3. ビルドエラー**
```
BUILD FAILED
```
→ `gradlew.bat clean build -x test` を実行

**4. クラスが見つからない**
```
ClassNotFoundException
```
→ `gradlew.bat clean build -x test` を実行

## 確認コマンド

```bash
# ポート確認
netstat -ano | findstr ":8080"
netstat -ano | findstr ":8081"
netstat -ano | findstr ":8082"

# Javaプロセス確認
tasklist | findstr java
```

## クイックリファレンス

### すべてのサービスを起動

```bash
cd C:\devlop\cms
SIMPLE_START.bat
```

### サービスを停止

各ウィンドウで `Ctrl+C` を押すか：

```bash
taskkill /F /IM java.exe
```

### 再起動

```bash
restart-services.bat
```

