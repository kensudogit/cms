# バックエンドサーバーの起動方法

## 現在の状況

フロントエンドはバックエンドAPIサーバー（`localhost:8080`）に接続しようとしますが、サーバーが起動していない場合は自動的にモックデータを使用します。

## バックエンドサーバーを起動する方法

### 方法1: バックエンドサービスを個別に起動

1. **API Gatewayを起動**
   ```bash
   cd C:\devlop\cms\services\api-gateway
   .\gradlew bootRun
   ```
   または
   ```bash
   cd C:\devlop\cms\services\api-gateway
   .\gradlew.bat bootRun
   ```

2. **認証サービスを起動**
   ```bash
   cd C:\devlop\cms\services\auth-service
   .\gradlew bootRun
   ```

3. **コンテンツサービスを起動**
   ```bash
   cd C:\devlop\cms\services\content-service
   .\gradlew bootRun
   ```

### 方法2: 一括起動スクリプトを使用

```bash
cd C:\devlop\cms
.\start-backend.bat
```

または

```bash
cd C:\devlop\cms
.\START_ALL.bat
```

### 方法3: Docker Composeを使用

```bash
cd C:\devlop\cms
docker-compose up
```

## 確認方法

バックエンドサーバーが正常に起動しているか確認：

1. **API Gateway**: http://localhost:8080/actuator/health
2. **認証サービス**: http://localhost:8081/actuator/health
3. **コンテンツサービス**: http://localhost:8082/actuator/health

## モックデータモード

バックエンドサーバーが起動していない場合、フロントエンドは自動的にモックデータを使用します：

- **ログイン**: モックユーザーで認証可能
  - `admin@example.com` / `password` (管理者)
  - `editor@example.com` / `password` (編集者)
  - `author@example.com` / `password` (ユーザー)

- **コンテンツ**: サンプルコンテンツが表示されます

## エラーメッセージの抑制

開発環境でバックエンドが起動していない場合、接続エラーのメッセージはコンソールに表示されません（モックデータを使用するため）。

エラーメッセージを表示したい場合は、環境変数を設定：

```bash
# Windows
set NEXT_PUBLIC_DEBUG_API=true

# または .env.local ファイルに追加
NEXT_PUBLIC_DEBUG_API=true
```

## トラブルシューティング

### ポートが既に使用されている場合

```bash
# Windowsでポート8080を使用しているプロセスを確認
netstat -ano | findstr :8080

# プロセスを終了
taskkill /PID <プロセスID> /F
```

### バックエンドが起動しない場合

1. Javaがインストールされているか確認
   ```bash
   java -version
   ```

2. Gradleがインストールされているか確認
   ```bash
   gradle -version
   ```

3. データベースが起動しているか確認（PostgreSQLなど）

## 注意事項

- バックエンドサーバーを起動しない場合でも、フロントエンドは正常に動作します（モックデータを使用）
- 本番環境では必ずバックエンドサーバーを起動してください
- 開発環境では、バックエンドを起動しなくても開発を続けることができます

