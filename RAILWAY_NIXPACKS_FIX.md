# 🔧 Railway Nixpacks.toml エラー修正

## エラー内容

```
Error: Failed to read Nixpacks config file `nixpacks.toml`
Caused by: No such file or directory (os error 2)
```

Railwayが各サービスディレクトリからビルドしているため、各サービスディレクトリに`nixpacks.toml`が必要です。

## 実施した修正

### 1. 各サービスディレクトリに`nixpacks.toml`を作成

以下のファイルを作成しました：
- `services/api-gateway/nixpacks.toml`
- `services/auth-service/nixpacks.toml`
- `services/content-service/nixpacks.toml`

各ファイルは、ルートディレクトリの`gradlew`を使用してビルドするように設定されています。

### 2. `railway.json`のビルドコマンドを修正

各サービスの`railway.json`の`buildCommand`を修正して、ルートディレクトリからビルドするようにしました：

```json
"buildCommand": "chmod +x ../../gradlew && cd ../.. && ./gradlew :services:api-gateway:build -x test"
```

### 3. `railway.json`の起動コマンドを修正

各サービスの`railway.json`の`startCommand`を修正して、正しいJARファイルのパスを指定しました：

```json
"startCommand": "java -jar ../../build/libs/api-gateway.jar"
```

## 次のステップ

### 1. 変更をコミットしてプッシュ

```bash
cd C:\devlop\cms

# 変更を追加
git add services/*/nixpacks.toml services/*/railway.json

# コミット
git commit -m "Add nixpacks.toml to each service directory and fix build commands"

# プッシュ
git push
```

### 2. Railwayで再デプロイ

1. Railwayのダッシュボードにアクセス
2. 各サービスを再デプロイ
3. ビルドログを確認して、`nixpacks.toml`が読み込まれていることを確認

### 3. ビルドログの確認

正常にビルドされると、以下のようなログが表示されます：

```
[inf] Using Nixpacks
[inf] ║ setup      │ jdk21, gradle                               ║
[inf] ║ build      │ chmod +x ../../gradlew && cd ../.. && ./gradlew :services:api-gateway:build -x test ║
[inf] BUILD SUCCESSFUL
```

## 確認事項

### ローカルで確認

```bash
# 各サービスディレクトリにnixpacks.tomlが存在することを確認
ls services/*/nixpacks.toml

# railway.jsonの内容を確認
cat services/api-gateway/railway.json
```

### Railwayで確認

1. Railwayのデプロイログを確認
2. `nixpacks.toml`が読み込まれていることを確認
3. `BUILD SUCCESSFUL`が表示されることを確認

## トラブルシューティング

### まだエラーが発生する場合

#### オプション1: Railwayのルートディレクトリを確認

Railwayのサービス設定で、ルートディレクトリが正しく設定されていることを確認してください。

#### オプション2: `railway.json`の`root`を設定

各サービスの`railway.json`に`root`を追加：

```json
{
  "build": {
    "builder": "NIXPACKS",
    "root": "../..",
    "buildCommand": "chmod +x gradlew && ./gradlew :services:api-gateway:build -x test"
  }
}
```

#### オプション3: Dockerfileを使用

各サービスでDockerfileを使用するように設定（既に`Dockerfile`が存在）

## 注意事項

- Railwayは各サービスディレクトリからビルドするため、各ディレクトリに`nixpacks.toml`が必要です
- Gradleのマルチプロジェクト構造では、ルートディレクトリからビルドする必要があります
- `buildCommand`で`cd ../..`を使用してルートディレクトリに移動してからビルドします
- 変更をプッシュした後、Railwayで再デプロイが必要です



