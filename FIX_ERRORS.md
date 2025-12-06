# エラー修正ガイド

## 発生しているエラー

1. **404エラー**: Next.jsの静的ファイルが見つからない
2. **ERR_CONNECTION_REFUSED**: バックエンドAPI（ポート8080）に接続できない

## 解決方法

### ステップ1: 開発サーバーの再起動

現在実行中の開発サーバーを停止して、再起動してください：

```bash
cd C:\devlop\cms\frontend
npm run dev
```

### ステップ2: バックエンドサービスの起動

バックエンドサービスが起動していないため、以下を実行：

```bash
cd C:\devlop\cms
START_ALL.bat
```

または手動で：

1. **Auth Service** (ポート8081)
```bash
cd C:\devlop\cms
start "Auth Service" cmd /k "gradlew.bat :services:auth-service:bootRun"
```

2. **Content Service** (ポート8082)
```bash
cd C:\devlop\cms
start "Content Service" cmd /k "gradlew.bat :services:content-service:bootRun"
```

3. **API Gateway** (ポート8080)
```bash
cd C:\devlop\cms
start "API Gateway" cmd /k "gradlew.bat :services:api-gateway:bootRun"
```

### ステップ3: 起動確認

すべてのサービスが起動するまで60-90秒待ってから：

```bash
# サービス状態を確認
cd C:\devlop\cms
check-services.bat
```

### ステップ4: ブラウザのキャッシュクリア

ブラウザで以下を実行：
- **Ctrl + Shift + R** (ハードリロード)
- または開発者ツールでキャッシュをクリア

## 起動順序

1. データベース（既に起動中）
2. Auth Service
3. Content Service  
4. API Gateway
5. フロントエンド開発サーバー

## 確認方法

- API Gateway: http://localhost:8080/api/content
- フロントエンド: http://localhost:3000 (または3002)

