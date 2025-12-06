# Railway Dockerビルドコンテキストの設定

## 🔴 発生しているエラー

```
chmod: cannot access 'gradlew': No such file or directory
```

## 🔍 原因

RailwayでDockerfileを使用する場合、**Root Directory**（ビルドコンテキスト）の設定が重要です。

現在のDockerfileは`../../gradlew`を参照していますが、Root Directoryが`services/user-service`に設定されている場合、`../../gradlew`は存在しない場所を指すことになります。

## ✅ 解決方法

### 方法1: RailwayのRoot Directoryをプロジェクトルートに設定（推奨）

Railwayダッシュボードで：

1. **user-service**サービスを選択
2. **Settings**タブを開く
3. **Root Directory**を確認・設定：
   - **Root Directory**: `/`（プロジェクトルート）または空欄
4. **Dockerfile Path**を確認：
   - **Dockerfile Path**: `services/user-service/Dockerfile`
5. 変更を保存

### 方法2: media-serviceも同様に設定

1. **media-service**サービスを選択
2. **Settings**タブを開く
3. **Root Directory**: `/`（プロジェクトルート）または空欄
4. **Dockerfile Path**: `services/media-service/Dockerfile`
5. 変更を保存

### 方法3: 他のサービスも確認

すべてのバックエンドサービスで同様の設定を確認：

- **api-gateway**
  - Root Directory: `/`
  - Dockerfile Path: `services/api-gateway/Dockerfile`

- **auth-service**
  - Root Directory: `/`
  - Dockerfile Path: `services/auth-service/Dockerfile`

- **content-service**
  - Root Directory: `/`
  - Dockerfile Path: `services/content-service/Dockerfile`

## 📋 Railway設定の確認手順

### ステップ1: サービス設定を開く

1. Railwayダッシュボードにアクセス
2. プロジェクトを選択
3. 各サービス（user-service、media-serviceなど）を選択
4. **Settings**タブを開く

### ステップ2: Root Directoryを確認

**Settings**タブで：

1. **Root Directory**セクションを探す
2. 現在の設定を確認
3. プロジェクトルート（`/`）または空欄に設定
4. 変更を保存

### ステップ3: Dockerfile Pathを確認

**Settings**タブで：

1. **Dockerfile Path**セクションを探す
2. 正しいパスが設定されているか確認：
   - `services/user-service/Dockerfile`
   - `services/media-service/Dockerfile`
   - など
3. 変更を保存

### ステップ4: 再デプロイ

1. **Deployments**タブを開く
2. **Redeploy**ボタンをクリック
3. ビルドログを確認
4. エラーが解消されたことを確認

## 🎯 正しい設定例

### user-service

```
Root Directory: /（プロジェクトルート）
Dockerfile Path: services/user-service/Dockerfile
```

### media-service

```
Root Directory: /（プロジェクトルート）
Dockerfile Path: services/media-service/Dockerfile
```

### api-gateway

```
Root Directory: /（プロジェクトルート）
Dockerfile Path: services/api-gateway/Dockerfile
```

## 🆘 トラブルシューティング

### Root Directoryが見つからない場合

1. **Settings**タブで下にスクロール
2. **Build & Deploy**セクションを確認
3. **Root Directory**フィールドを探す

### Dockerfile Pathが見つからない場合

1. Railwayが自動的にDockerfileを検出する場合があります
2. **Settings**タブで**Dockerfile Path**を明示的に設定
3. または、プロジェクトルートに`railway.json`を配置して設定

### ビルドがまだ失敗する場合

1. **ビルドログを詳細に確認**
   - エラーメッセージを確認
   - どのディレクトリからビルドが実行されているか確認

2. **Dockerfileのパスを確認**
   - Dockerfile内の`COPY`コマンドのパスが正しいか確認
   - Root Directoryが`/`の場合、`../../gradlew`は正しいパスです

3. **ファイルの存在を確認**
   - プロジェクトルートに`gradlew`が存在するか確認
   - GitHubリポジトリに`gradlew`が含まれているか確認

## 📝 確認チェックリスト

- [ ] user-serviceのRoot Directoryが`/`に設定されている
- [ ] user-serviceのDockerfile Pathが`services/user-service/Dockerfile`に設定されている
- [ ] media-serviceのRoot Directoryが`/`に設定されている
- [ ] media-serviceのDockerfile Pathが`services/media-service/Dockerfile`に設定されている
- [ ] 他のサービス（api-gateway、auth-service、content-service）も同様に設定されている
- [ ] サービスを再デプロイした
- [ ] ビルドログでエラーが解消されたことを確認した

## 🎯 まとめ

RailwayでDockerfileを使用する場合：

1. **Root Directory**をプロジェクトルート（`/`）に設定
2. **Dockerfile Path**をサービスごとのDockerfileのパスに設定
3. これにより、Dockerfile内の`../../gradlew`などの相対パスが正しく解決されます

これらの設定により、Dockerビルドエラーが解消されます。

