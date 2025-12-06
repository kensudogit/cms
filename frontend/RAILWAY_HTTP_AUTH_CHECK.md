# Railway HTTP認証の確認方法

## HTTP認証とは

Railwayでは、サービスにHTTP認証（Basic認証）を設定することができます。これが有効になっていると、ブラウザでログインダイアログが表示されます。

## 確認方法

### 1. Railwayダッシュボードにアクセス

1. https://railway.app にアクセス
2. ログインしてダッシュボードを開く

### 2. プロジェクトを選択

1. 左側のメニューから「Projects」を選択
2. `cms`プロジェクトを選択

### 3. フロントエンドサービスを選択

1. プロジェクト内のサービス一覧から、フロントエンドサービスを選択
2. 通常は「frontend」または「cms-frontend」という名前

### 4. Settings（設定）を確認

1. サービスページの上部タブから「Settings」をクリック
2. 左側のメニューから以下を確認：

#### A. Networking（ネットワーク設定）

1. 「Networking」タブを開く
2. 「HTTP Authentication」または「Basic Authentication」のセクションを確認
3. 有効になっている場合は、以下のいずれかが表示されます：
   - 「Enable HTTP Authentication」がONになっている
   - ユーザー名とパスワードが設定されている
   - 「Protected」という表示がある

#### B. Security（セキュリティ設定）

1. 「Security」タブを開く
2. 「Authentication」セクションを確認
3. HTTP認証の設定があるか確認

#### C. Environment Variables（環境変数）

1. 「Variables」タブを開く
2. 以下の環境変数が設定されていないか確認：
   - `RAILWAY_HTTP_AUTH_USERNAME`
   - `RAILWAY_HTTP_AUTH_PASSWORD`
   - `HTTP_AUTH_ENABLED`
   - その他、認証関連の環境変数

### 5. HTTP認証を無効化する方法

HTTP認証が有効になっている場合：

#### 方法1: Networking設定から無効化

1. 「Settings」→「Networking」を開く
2. 「HTTP Authentication」セクションを探す
3. 「Enable HTTP Authentication」をOFFにする
4. 変更を保存

#### 方法2: 環境変数を削除

1. 「Settings」→「Variables」を開く
2. 認証関連の環境変数を削除：
   - `RAILWAY_HTTP_AUTH_USERNAME`
   - `RAILWAY_HTTP_AUTH_PASSWORD`
   - `HTTP_AUTH_ENABLED`
3. 変更を保存

#### 方法3: サービスを再デプロイ

環境変数を削除した後、サービスを再デプロイ：
1. 「Deployments」タブを開く
2. 「Redeploy」ボタンをクリック

## 確認のポイント

### HTTP認証が有効な場合の症状

- ブラウザでログインダイアログが表示される
- ユーザー名とパスワードの入力が求められる
- 認証情報を入力しないとアクセスできない

### HTTP認証が無効な場合

- ログインダイアログが表示されない
- 直接アプリケーションにアクセスできる
- 認証情報の入力が不要

## トラブルシューティング

### HTTP認証の設定が見つからない場合

Railwayのバージョンやプランによって、HTTP認証の設定場所が異なる場合があります：

1. **Settings → General** を確認
2. **Settings → Networking** を確認
3. **Settings → Security** を確認
4. **Environment Variables** を確認

### 設定を変更しても反映されない場合

1. サービスを再デプロイ
2. ブラウザのキャッシュをクリア
3. シークレットモードでアクセスして確認

## 参考情報

- Railway公式ドキュメント: https://docs.railway.app
- Railwayダッシュボード: https://railway.app/dashboard

