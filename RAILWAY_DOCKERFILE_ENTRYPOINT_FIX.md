# Railway Dockerfile ENTRYPOINT使用の設定

## 🔴 現在のエラー

```
Container failed to start
The executable `./gradlew` could not be found.
```

**ビルドは成功していますが、コンテナの起動時にエラーが発生しています。**

## 🔍 原因

Railwayの設定で`Start Command`が`./gradlew`に設定されているため、Dockerfileの`ENTRYPOINT`が無視されています。

## ✅ 解決方法

### 方法1: RailwayダッシュボードでStart Commandを削除（必須）

**これはRailwayダッシュボードでの設定変更が必要です。**

1. https://railway.app にアクセス
2. プロジェクトを選択
3. **api-gateway**サービスを選択
4. **Settings**タブを開く
5. **Deploy**セクション（または**Build & Deploy**）を探す
6. **Start Command**フィールドを確認
7. **Start Command**を**完全に空欄にする**（すべて削除）
8. **Save**ボタンをクリック
9. **再デプロイ**

### 方法2: すべてのサービスで同様の設定

以下のサービスでも同様に設定：

- **auth-service**: Start Commandを空欄
- **content-service**: Start Commandを空欄
- **user-service**: Start Commandを空欄
- **media-service**: Start Commandを空欄

## 📋 DockerfileのENTRYPOINT

すべてのサービスのDockerfileで、`ENTRYPOINT`が正しく設定されています：

```dockerfile
ENTRYPOINT ["sh", "-c", "java -jar -Dserver.port=${PORT:-8080} app.jar --spring.profiles.active=railway"]
```

この`ENTRYPOINT`がコンテナの起動コマンドとして使用されるべきです。

## 🎯 railway.jsonの確認

現在の`railway.json`は正しく設定されています：

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

**重要**: `startCommand`フィールドは含まれていません。これが正しい設定です。

## ⚠️ Railwayの動作

Railwayは以下の優先順位で起動コマンドを決定します：

1. **RailwayダッシュボードのStart Command設定**（最優先）
2. `railway.json`の`deploy.startCommand`
3. Dockerfileの`ENTRYPOINT`または`CMD`

そのため、Railwayダッシュボードで`Start Command`が設定されている場合、Dockerfileの`ENTRYPOINT`が無視されます。

## ✅ 確認手順

### ステップ1: Railwayダッシュボードで確認

1. **api-gateway**サービスの**Settings**タブを開く
2. **Deploy**セクションを確認
3. **Start Command**が空欄になっていることを確認

### ステップ2: 再デプロイ

1. **Deployments**タブを開く
2. **Redeploy**ボタンをクリック
3. ビルドログを確認
4. コンテナが正常に起動することを確認

### ステップ3: ログで確認

コンテナが正常に起動すると、以下のようなメッセージが表示されます：

```
Started ApiGatewayApplication in X.XXX seconds
```

以下のエラーが表示されないことを確認：

- ❌ `Container failed to start`
- ❌ `The executable './gradlew' could not be found.`

## 🆘 トラブルシューティング

### Start Commandが見つからない場合

1. **Settings**タブで下にスクロール
2. **Deploy**セクションを探す
3. または、**Build & Deploy**セクションを確認
4. `Ctrl+F`で「Start Command」を検索

### まだエラーが発生する場合

1. **ブラウザのキャッシュをクリア**
   - Railwayダッシュボードを再読み込み

2. **設定が保存されているか確認**
   - **Save**ボタンをクリックした後、ページを再読み込み
   - **Start Command**が空欄のままか確認

3. **サービスを再作成**（最後の手段）
   - サービスを削除して再作成
   - 新しいサービスでDockerfileを使用

## 📝 確認チェックリスト

- [ ] Railwayダッシュボードにアクセスした
- [ ] api-gatewayサービスのSettingsタブを開いた
- [ ] Start Commandフィールドを見つけた
- [ ] Start Commandを空欄にした
- [ ] 変更を保存した
- [ ] 他のサービス（auth-service、content-service、user-service、media-service）も同様に設定した
- [ ] サービスを再デプロイした
- [ ] ビルドログでエラーが解消されたことを確認した
- [ ] コンテナが正常に起動することを確認した

## 🎯 まとめ

**重要なポイント**:

1. **RailwayダッシュボードでStart Commandを空欄にする** - これが最も重要です
2. **DockerfileのENTRYPOINTが使用される** - Start Commandが空欄の場合、DockerfileのENTRYPOINTが使用されます
3. **すべてのサービスで一貫した設定** - すべてのサービスでStart Commandを空欄にします

この設定により、コンテナ起動エラーが解消され、サービスが正常に起動するようになります。

**注意**: この設定変更はRailwayダッシュボードで行う必要があります。コード側では対応できません。

