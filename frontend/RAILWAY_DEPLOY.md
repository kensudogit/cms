# Railwayデプロイ手順

## 問題の修正

Railwayサーバでログイン画面しか表示されない問題を修正しました。

## 修正内容

1. **`app/page.tsx`**: ルートパス（/）でダッシュボードを直接表示
2. **`next.config.js`**: `output: 'standalone'`を追加してRailway対応
3. **`railway.json`**: Railway用の設定ファイルを作成
4. **`Dockerfile`**: Railway用のDockerfileを作成

## Railwayデプロイ手順

### 1. コードをコミット

```bash
cd C:\devlop\cms\frontend
git add .
git commit -m "fix: Railwayデプロイ対応、ルートパスでダッシュボード表示"
git push
```

### 2. Railwayでデプロイ

1. Railwayダッシュボードにアクセス
2. フロントエンドサービスを選択
3. 「Settings」→「Source」でGitHubリポジトリを接続
4. 「Settings」→「Service」で以下を設定：
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

### 3. 環境変数の設定

Railwayダッシュボードで以下の環境変数を設定：

- `NEXT_PUBLIC_API_BASE_URL`: バックエンドAPIのベースURL
  - 例: `https://cms-production-4115.up.railway.app`

### 4. デプロイ確認

デプロイ完了後、以下のURLにアクセス：

- **Railway**: https://cms-production-4115.up.railway.app

ルートパス（/）でダッシュボードが直接表示されることを確認してください。

## トラブルシューティング

### ログイン画面が表示される場合

1. ブラウザのキャッシュをクリア
2. シークレットモードでアクセス
3. Railwayのログを確認

### ビルドエラーが発生する場合

1. Railwayのビルドログを確認
2. `package.json`の依存関係を確認
3. Node.jsのバージョンを確認（20以上推奨）

### 404エラーが発生する場合

1. `next.config.js`の`output: 'standalone'`が設定されているか確認
2. Railwayのルーティング設定を確認
3. ビルドログでエラーがないか確認

