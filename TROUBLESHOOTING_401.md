# 401エラー トラブルシューティング完全ガイド

## 現在の問題
- HTTP Basic認証ダイアログが表示される
- 401 Unauthorized エラーが発生
- アプリケーションのログインページにアクセスできない

## 原因の特定

### 原因1: RailwayのHTTP認証が有効（最も可能性が高い）

**症状:**
- ブラウザの標準的なHTTP Basic認証ダイアログが表示される
- アプリケーションのログインページが表示されない
- 401エラーが発生する

**解決方法:**
RailwayダッシュボードでHTTP認証を無効化（詳細は `RAILWAY_HTTP_AUTH_STEP_BY_STEP.md` を参照）

### 原因2: API GatewayのHTTP認証が有効

**症状:**
- フロントエンドは表示されるが、APIリクエストが401エラーになる

**解決方法:**
1. API Gatewayサービスを選択
2. Settings → HTTP Authentication を無効化
3. Variables → HTTP認証関連の環境変数を削除

### 原因3: 環境変数の設定ミス

**症状:**
- フロントエンドがAPI Gatewayに接続できない

**確認事項:**
- フロントエンドの `NEXT_PUBLIC_API_BASE_URL` が正しく設定されているか
- API GatewayのURLが正しいか

## 緊急対応（一時的な回避策）

### 方法1: HTTP認証を通過する

1. HTTP Basic認証ダイアログで認証情報を入力
2. Railwayダッシュボードで認証情報を確認：
   - Settings → HTTP Authentication セクション
   - または Variables → `RAILWAY_HTTP_AUTH_USERNAME` と `RAILWAY_HTTP_AUTH_PASSWORD`
3. 認証通過後、アプリケーションのログインページにアクセス

### 方法2: 直接ログインページにアクセス

1. HTTP認証を通過後、URLに `/login` を追加：
   ```
   https://cms-production-4a51.up.railway.app/login
   ```
2. アプリケーションのログインページが表示されるはずです

## 根本的な解決方法

### ステップ1: Railwayダッシュボードで確認

1. https://railway.app にアクセス
2. プロジェクトを選択
3. **すべてのサービス**を確認：
   - フロントエンドサービス
   - API Gatewayサービス
   - その他のバックエンドサービス

### ステップ2: HTTP認証を無効化

各サービスで：
1. Settings → HTTP Authentication を無効化
2. Variables → HTTP認証関連の環境変数を削除

### ステップ3: 再デプロイ

1. 各サービスを再デプロイ
2. または、GitHubにプッシュして自動デプロイをトリガー

### ステップ4: 確認

1. ブラウザのキャッシュをクリア
2. シークレットモードでアクセス
3. HTTP Basic認証ダイアログが表示されないことを確認
4. アプリケーションのログインページが表示されることを確認

## よくある質問

### Q: HTTP認証セクションが見つからない

**A:** 以下の可能性があります：
1. RailwayのプランによってはHTTP認証機能が利用できない
2. サービスが正しく選択されていない
3. Settingsページの別の場所にある

**対処法:**
- Variablesタブで `RAILWAY_HTTP_AUTH_*` で始まる環境変数を探す
- それらを削除する

### Q: 設定を変更しても反映されない

**A:** 以下の可能性があります：
1. サービスが再デプロイされていない
2. ブラウザのキャッシュが残っている
3. 他のサービスにもHTTP認証が有効になっている

**対処法:**
1. Deploymentsタブで再デプロイを確認
2. ブラウザのキャッシュをクリア
3. シークレットモードでアクセス
4. すべてのサービスを確認

### Q: どのサービスにHTTP認証が有効になっているか分からない

**A:** 以下の方法で確認：
1. 各サービスのSettingsタブを確認
2. Variablesタブで `RAILWAY_HTTP_AUTH_*` で始まる環境変数を検索
3. ログ（Logsタブ）で401エラーが発生しているサービスを確認

## 確認用コマンド（Railway CLI）

```bash
# すべての環境変数を確認
railway variables

# HTTP認証関連の環境変数を検索
railway variables | grep HTTP_AUTH

# 環境変数を削除
railway variables unset RAILWAY_HTTP_AUTH_USERNAME
railway variables unset RAILWAY_HTTP_AUTH_PASSWORD
railway variables unset HTTP_AUTH_ENABLED
```

## 最終確認

以下のすべてが ✅ になれば問題は解決しています：

- [ ] HTTP Basic認証ダイアログが表示されない
- [ ] アプリケーションのログインページが表示される
- [ ] 開発者ツール（F12）のConsoleに401エラーが表示されない
- [ ] Networkタブでリクエストが200 OKになっている
- [ ] ログインフォームに入力できる
- [ ] ログインが成功する

