# クイックスタート - バックエンドサービス起動

## 現在の状況

✅ データベースは起動しています
❌ バックエンドサービスが起動していません

## 解決方法

### 最も簡単な方法

以下のコマンドを実行してください：

```bash
cd C:\devlop\cms
START_ALL.bat
```

このスクリプトが以下を自動的に実行します：
1. データベースの確認
2. Auth Serviceの起動（ポート8081）
3. Content Serviceの起動（ポート8082）
4. API Gatewayの起動（ポート8080）

### 手動で起動する場合

#### ステップ1: Auth Serviceを起動

新しいコマンドプロンプトを開いて：
```bash
cd C:\devlop\cms
gradlew.bat :services:auth-service:bootRun
```

#### ステップ2: Content Serviceを起動

別のコマンドプロンプトを開いて：
```bash
cd C:\devlop\cms
gradlew.bat :services:content-service:bootRun
```

#### ステップ3: API Gatewayを起動

別のコマンドプロンプトを開いて：
```bash
cd C:\devlop\cms
gradlew.bat :services:api-gateway:bootRun
```

## 起動確認

すべてのサービスが起動するまで約60-90秒かかります。

起動を確認するには：

```bash
# サービス状態を確認
check-services.bat

# または、ブラウザで以下にアクセス
# http://localhost:8080/api/content
```

## トラブルシューティング

### Javaが見つからない

```bash
java -version
```

Java 21以上が必要です。

### ポートが既に使用されている

```bash
# 使用中のポートを確認
netstat -ano | findstr ":8080"
netstat -ano | findstr ":8081"
netstat -ano | findstr ":8082"
```

### Gradleビルドエラー

```bash
# クリーンビルド
cd C:\devlop\cms
gradlew.bat clean build
```

## 次のステップ

すべてのサービスが起動したら：
1. ブラウザでフロントエンドをリロード
2. コンテンツの作成・編集・削除が動作することを確認


