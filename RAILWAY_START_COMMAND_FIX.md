# Railwayコンテナ起動エラーの修正

## 🔴 発生しているエラー

```
Container failed to start
The executable `./gradlew` could not be found.
```

## 🔍 原因

Dockerfileを使用している場合、コンテナの起動コマンドはDockerfileの`ENTRYPOINT`または`CMD`で定義されています。しかし、Railwayの設定で`startCommand`が`./gradlew`に設定されている場合、RailwayはDockerfileの`ENTRYPOINT`を無視して`startCommand`を実行しようとします。

実行ステージのDockerイメージには`gradlew`が含まれていないため（マルチステージビルドでJARファイルのみがコピーされている）、エラーが発生します。

## ✅ 解決方法

### 方法1: RailwayダッシュボードでstartCommandを削除（推奨）

1. Railwayダッシュボードにアクセス
2. **api-gateway**サービスを選択
3. **Settings**タブを開く
4. **Deploy**セクションを探す
5. **Start Command**フィールドを確認
6. **Start Command**を空欄にする、または削除
7. 変更を保存

### 方法2: すべてのサービスで同様の設定

以下のサービスでも同様に設定を確認：

- **auth-service**: Start Commandを空欄
- **content-service**: Start Commandを空欄
- **user-service**: Start Commandを空欄
- **media-service**: Start Commandを空欄

### 方法3: railway.jsonで明示的に設定（オプション）

`railway.json`で`startCommand`を明示的に削除または空にする必要はありませんが、念のため確認：

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "services/api-gateway/Dockerfile"
  },
  "deploy": {
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**重要**: `startCommand`フィールドを追加しないでください。Dockerfileの`ENTRYPOINT`が使用されます。

## 📋 Railway設定の確認手順

### ステップ1: サービス設定を開く

1. Railwayダッシュボードにアクセス
2. プロジェクトを選択
3. **api-gateway**サービスを選択
4. **Settings**タブを開く

### ステップ2: Deploy設定を確認

**Settings**タブで：

1. **Deploy**セクションを探す
2. **Start Command**フィールドを確認
3. 現在の設定を確認：
   - `./gradlew`が設定されている場合 → 空欄に変更
   - 他のコマンドが設定されている場合 → 空欄に変更
   - 既に空欄の場合 → 他の設定を確認

### ステップ3: 変更を保存

1. **Start Command**を空欄にする
2. **Save**ボタンをクリック
3. 変更が保存されたことを確認

### ステップ4: 再デプロイ

1. **Deployments**タブを開く
2. **Redeploy**ボタンをクリック
3. ビルドログを確認
4. コンテナが正常に起動することを確認

## 🎯 DockerfileのENTRYPOINT

すべてのサービスのDockerfileで、`ENTRYPOINT`が正しく設定されています：

```dockerfile
ENTRYPOINT ["sh", "-c", "java -jar -Dserver.port=${PORT:-8080} app.jar --spring.profiles.active=railway"]
```

この`ENTRYPOINT`がコンテナの起動コマンドとして使用されます。

## ✅ 確認方法

### コンテナ起動の確認

1. **Deployments**タブでデプロイが成功していることを確認
2. **Metrics**タブでサービスが起動していることを確認
3. ログで以下のメッセージが表示されることを確認：
   ```
   Started ApiGatewayApplication in X.XXX seconds
   ```

### エラーの確認

以下のエラーが表示されないことを確認：

- ❌ `Container failed to start`
- ❌ `The executable './gradlew' could not be found.`
- ❌ `startCommand not found`

## 🆘 トラブルシューティング

### Start Commandが見つからない場合

1. **Settings**タブで下にスクロール
2. **Deploy**セクションを探す
3. **Start Command**フィールドを探す
4. または、**Build & Deploy**セクションを確認

### まだエラーが発生する場合

1. **環境変数を確認**
   - `PORT`環境変数が設定されているか確認
   - Railwayは自動的に`PORT`環境変数を設定します

2. **DockerfileのENTRYPOINTを確認**
   - `ENTRYPOINT`が正しく設定されているか確認
   - `app.jar`が存在するか確認

3. **ログを詳細に確認**
   - エラーメッセージを確認
   - どのコマンドが実行されているか確認

### Railwayが古い設定をキャッシュしている場合

1. **サービスを削除して再作成**（最後の手段）
2. または、**Settings**で**Clear Cache**を実行（利用可能な場合）

## 📝 確認チェックリスト

- [ ] api-gatewayのStart Commandが空欄になっている
- [ ] auth-serviceのStart Commandが空欄になっている
- [ ] content-serviceのStart Commandが空欄になっている
- [ ] user-serviceのStart Commandが空欄になっている
- [ ] media-serviceのStart Commandが空欄になっている
- [ ] サービスを再デプロイした
- [ ] コンテナが正常に起動することを確認した
- [ ] ログでエラーが表示されないことを確認した

## 🎯 まとめ

Dockerfileを使用している場合：

1. **Start Commandを空欄にする** - Dockerfileの`ENTRYPOINT`が使用されます
2. **DockerfileのENTRYPOINTを確認** - 正しく設定されていることを確認
3. **サービスを再デプロイ** - 設定変更を反映

これらの設定により、コンテナ起動エラーが解消され、サービスが正常に起動するようになります。

