# 🔧 Railway Java 21エラー修正

## エラー内容

```
error: invalid source release: 21
```

NixpacksがJDK 17を使用していますが、プロジェクトはJava 21を要求しています。

## 実施した修正

### `nixpacks.toml`を修正

JDK 17からJDK 21に変更しました：

```toml
[phases.setup]
nixPkgs = ["jdk21", "gradle"]  # jdk17 → jdk21 に変更
```

## 次のステップ

### 1. 変更をコミットしてプッシュ

```bash
cd C:\devlop\cms

# 変更を追加
git add nixpacks.toml

# コミット
git commit -m "Fix Java version: Use JDK 21 instead of JDK 17 for Railway deployment"

# プッシュ
git push
```

### 2. Railwayで再デプロイ

1. Railwayのダッシュボードにアクセス
2. 各サービスを再デプロイ
3. ビルドログを確認して、JDK 21が使用されていることを確認

### 3. ビルドログの確認

正常にビルドされると、以下のようなログが表示されます：

```
[inf] ║ setup      │ jdk21, gradle                               ║
[inf] > Task :services:api-gateway:compileJava
[inf] BUILD SUCCESSFUL
```

## 確認事項

### ローカルで確認

```bash
# Java 21が使用されているか確認
java -version
# 出力: openjdk version "21.0.x"
```

### Railwayで確認

1. Railwayのデプロイログを確認
2. `jdk21`が使用されていることを確認
3. `BUILD SUCCESSFUL`が表示されることを確認

## トラブルシューティング

### まだエラーが発生する場合

#### オプション1: Railwayの環境変数を設定

Railwayのサービス設定で、環境変数を追加：
- `JAVA_VERSION`: `21`

#### オプション2: Dockerfileを使用

各サービスでDockerfileを使用するように設定（既に`eclipse-temurin:21-jdk-alpine`を使用）

#### オプション3: `build.gradle`でJavaバージョンを確認

すべての`build.gradle`ファイルで`sourceCompatibility = '21'`が設定されていることを確認

## 注意事項

- Nixpacksは`nixpacks.toml`の設定を優先します
- JDK 21はLTSバージョンなので、Railwayでサポートされています
- 変更をプッシュした後、Railwayで再デプロイが必要です

