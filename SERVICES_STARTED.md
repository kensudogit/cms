# ✅ バックエンドサービス起動中

## 起動状況

以下のサービスが起動中です：

1. ✅ **Auth Service** (port 8081) - 起動中
2. ✅ **Content Service** (port 8082) - 起動中  
3. ✅ **API Gateway** (port 8080) - 起動中

## 次のステップ

### 1. 起動を待つ（30-60秒）

各サービスのウィンドウで、以下のようなメッセージが表示されるまで待ってください：

```
Started AuthServiceApplication in X.XXX seconds
Started ContentServiceApplication in X.XXX seconds
Started ApiGatewayApplication in X.XXX seconds
```

### 2. 動作確認

ブラウザで以下にアクセスして確認：

- http://localhost:8080/api/auth/health
- http://localhost:8081/api/auth/health
- http://localhost:8082/api/content

すべてが正常に応答したら成功です。

### 3. フロントエンドをリロード

ブラウザでフロントエンドページを**リロード（F5）**してください。

接続エラーが解消され、ログイン/登録ができるようになります。

## サービスが起動しない場合

### ログを確認

各サービスのウィンドウでエラーメッセージを確認してください。

### よくある問題

1. **データベース接続エラー**
   - PostgreSQLが起動しているか確認
   - `docker ps`で確認

2. **ポートが使用中**
   - 別のプロセスがポートを使用している可能性
   - `netstat -ano | findstr ":8080"`で確認

3. **ビルドエラー**
   - 各サービスディレクトリで`gradlew.bat clean build`を実行

## サービスの停止

各ウィンドウで`Ctrl+C`を押すか、以下を実行：

```bash
stop-backend.bat
```



