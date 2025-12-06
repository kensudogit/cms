# API接続エラー修正ガイド

## 問題
`ERR_CONNECTION_REFUSED` エラーが発生しています。バックエンドAPI（ポート8080）に接続できません。

## 原因
バックエンドサービス（API Gateway、Content Service、Auth Service）が起動していません。

## 解決方法

### 最も簡単な方法

以下のコマンドを実行してください：

```bash
cd C:\devlop\cms
START_BACKEND_SERVICES.bat
```

または：

```bash
cd C:\devlop\cms
START_ALL.bat
```

### 手動で起動する場合

3つのコマンドプロンプトウィンドウを開いて、それぞれで以下を実行：

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

## 起動確認

すべてのサービスが起動するまで約60-90秒かかります。

起動を確認するには：

```bash
cd C:\devlop\cms
check-services.bat
```

または、ブラウザで以下にアクセス：
- http://localhost:8080/api/content

## 注意事項

- 各サービスは別々のウィンドウで起動されます
- サービスを停止するには、各ウィンドウで `Ctrl+C` を押してください
- フロントエンドは、すべてのバックエンドサービスが起動してから使用してください

## 現在の動作

バックエンドサービスが起動していない場合、フロントエンドは自動的にモックデータを使用します。これは正常な動作です。

バックエンドサービスを起動すると、実際のAPIが使用され、データベースに保存・更新・削除が反映されます。

