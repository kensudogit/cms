# Railway設定確認ガイド

## Railwayダッシュボードへのアクセス

1. https://railway.app にアクセス
2. アカウントにログイン

## フロントエンドサービスの設定確認手順

### ステップ1: プロジェクトを選択

1. 左側のメニューから「Projects」をクリック
2. `cms`プロジェクトを選択

### ステップ2: フロントエンドサービスを選択

プロジェクト内のサービス一覧から、フロントエンドサービスを選択：
- サービス名: `frontend` または `cms-frontend` など

### ステップ3: Settings（設定）を開く

サービスページの上部タブから「Settings」をクリック

### ステップ4: HTTP認証の確認

#### 確認場所1: Networking

1. 左側メニューから「Networking」をクリック
2. 「HTTP Authentication」または「Basic Authentication」セクションを確認
3. 有効になっている場合は「Enable」または「ON」になっている

#### 確認場所2: Environment Variables

1. 左側メニューから「Variables」をクリック
2. 以下の環境変数が設定されていないか確認：
   ```
   RAILWAY_HTTP_AUTH_USERNAME
   RAILWAY_HTTP_AUTH_PASSWORD
   HTTP_AUTH_ENABLED
   ```

#### 確認場所3: General

1. 左側メニューから「General」をクリック
2. 「Authentication」や「Security」セクションを確認

## HTTP認証を無効化する手順

### 方法1: Networking設定から無効化

1. 「Settings」→「Networking」を開く
2. 「HTTP Authentication」セクションを探す
3. トグルスイッチをOFFにする、または「Disable」をクリック
4. 変更を保存

### 方法2: 環境変数を削除

1. 「Settings」→「Variables」を開く
2. 認証関連の環境変数を探す
3. 各環境変数の右側にある「×」ボタンをクリックして削除
4. 変更を保存

### 方法3: サービスを再デプロイ

1. 環境変数を削除した後
2. 「Deployments」タブを開く
3. 「Redeploy」ボタンをクリック

## 現在のデプロイ設定の確認

### Build & Deploy設定

1. 「Settings」→「General」を開く
2. 以下を確認：
   - **Root Directory**: `frontend` に設定されているか
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

### 環境変数の確認

1. 「Settings」→「Variables」を開く
2. 以下の環境変数が設定されているか確認：
   ```
   NEXT_PUBLIC_USE_MOCK_DATA=true
   NEXT_PUBLIC_API_BASE_URL=<バックエンドAPIのURL>
   ```

## デプロイ状態の確認

1. サービスページの「Deployments」タブを開く
2. 最新のデプロイの状態を確認：
   - ✅ **Success**: 正常にデプロイ完了
   - ⏳ **Building**: ビルド中
   - ❌ **Failed**: デプロイ失敗

## ログの確認

1. サービスページの「Logs」タブを開く
2. 最新のログを確認
3. エラーメッセージがないか確認

## よくある問題と解決方法

### 問題1: HTTP認証の設定が見つからない

**解決方法**: Railwayの無料プランでは、HTTP認証機能が利用できない場合があります。その場合は、環境変数で設定されている可能性があります。

### 問題2: 設定を変更しても反映されない

**解決方法**:
1. サービスを再デプロイ
2. ブラウザのキャッシュをクリア
3. シークレットモードでアクセス

### 問題3: ログイン画面が表示される

**解決方法**:
1. HTTP認証が無効になっているか確認
2. 環境変数に認証関連の設定がないか確認
3. コードが最新の状態でデプロイされているか確認

## 確認URL

- **Railwayダッシュボード**: https://railway.app/dashboard
- **プロジェクト**: https://railway.app/project/<project-id>
- **サービス**: https://railway.app/service/<service-id>

