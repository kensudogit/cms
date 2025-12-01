# 📊 サービス起動状況

## 現在の状況

バックエンドサービスを再起動しました。以下の3つのウィンドウが開いているはずです：

1. ✅ **CMS - Auth Service** (port 8081) - 起動中
2. ✅ **CMS - Content Service** (port 8082) - 起動中
3. ✅ **CMS - API Gateway** (port 8080) - 起動中

## 確認方法

### 1. ウィンドウを確認

3つのコマンドプロンプトウィンドウが開いていることを確認してください。

各ウィンドウで以下のようなログが表示されているはずです：

```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.2.0)
```

### 2. 起動完了の確認

各ウィンドウで以下のメッセージが表示されるまで待ってください（60-90秒）：

```
Started AuthServiceApplication in X.XXX seconds
Started ContentServiceApplication in X.XXX seconds
Started ApiGatewayApplication in X.XXX seconds
```

### 3. 動作確認

起動完了後、ブラウザで以下にアクセス：

- http://localhost:8080/api/auth/health
- http://localhost:8081/api/auth/health
- http://localhost:8082/api/content

正常に応答すれば成功です。

## フロントエンドの使用

すべてのサービスが起動したら：

1. ブラウザでフロントエンドページを開く
2. **完全にリロード（Ctrl+F5）**
3. ログイン/登録を試す

## トラブルシューティング

### サービスが起動しない

各ウィンドウのエラーメッセージを確認してください。

### ポートエラー

```bash
# ポートを確認
netstat -ano | findstr ":8080"
netstat -ano | findstr ":8081"
netstat -ano | findstr ":8082"
```

### データベースエラー

```bash
# PostgreSQLを確認
docker ps
```

### 再起動が必要な場合

```bash
restart-services.bat
```

