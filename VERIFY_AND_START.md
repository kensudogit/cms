# ✅ サービス起動確認と手順

## 現在の状況

- Javaプロセス: 実行中
- ポート8080/8081/8082: 未使用（サービスが起動していない可能性）

## 推奨される起動手順

### ステップ1: ビルドの確認

すべてのサービスが正常にビルドできるか確認：

```bash
cd C:\devlop\cms
gradlew.bat clean build -x test
```

ビルドが成功したら、次に進みます。

### ステップ2: サービスを1つずつ起動

#### ウィンドウ1: Auth Service

```bash
cd C:\devlop\cms
gradlew.bat :services:auth-service:bootRun
```

**確認事項:**
- エラーメッセージがないこと
- "Started AuthServiceApplication" が表示されること
- ポート8081が使用されていること

**確認コマンド:**
```bash
netstat -ano | findstr ":8081"
```

**動作確認:**
ブラウザで http://localhost:8081/api/auth/health にアクセス

#### ウィンドウ2: Content Service

Auth Serviceが起動したら、新しいウィンドウで：

```bash
cd C:\devlop\cms
gradlew.bat :services:content-service:bootRun
```

**確認事項:**
- エラーメッセージがないこと
- "Started ContentServiceApplication" が表示されること
- ポート8082が使用されていること

**動作確認:**
ブラウザで http://localhost:8082/api/content にアクセス

#### ウィンドウ3: API Gateway

Content Serviceが起動したら、新しいウィンドウで：

```bash
cd C:\devlop\cms
gradlew.bat :services:api-gateway:bootRun
```

**確認事項:**
- エラーメッセージがないこと
- "Started ApiGatewayApplication" が表示されること
- ポート8080が使用されていること

**動作確認:**
ブラウザで http://localhost:8080/api/auth/health にアクセス

### ステップ3: フロントエンドをリロード

すべてのサービスが起動したら：

1. ブラウザでフロントエンドページを開く
2. **完全にリロード（Ctrl+F5）**
3. ログイン/登録を試す

## トラブルシューティング

### ビルドエラー

```bash
cd C:\devlop\cms
gradlew.bat clean
gradlew.bat build -x test
```

### データベース接続エラー

```bash
docker ps
docker-compose up -d
```

### ポートが使用中

```bash
# ポートを確認
netstat -ano | findstr ":8080"

# プロセスを終了
taskkill /F /PID <プロセスID>
```

### サービスが起動しない

各サービスのウィンドウで、最後のエラーメッセージを確認してください。

よくあるエラー：
- `ClassNotFoundException` → クリーンビルドが必要
- `Port already in use` → ポートを解放
- `Connection refused` → データベースを確認

## 確認コマンド

```bash
# ポート確認
netstat -ano | findstr ":8080"
netstat -ano | findstr ":8081"
netstat -ano | findstr ":8082"

# サービステスト
test-api.bat
```

