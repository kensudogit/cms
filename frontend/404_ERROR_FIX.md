# 404エラー対応ガイド

## エラーの説明

```
GET http://localhost:3002/_next/static/css/app/layout.css net::ERR_ABORTED 404 (Not Found)
GET http://localhost:3002/_next/static/chunks/main-app.js net::ERR_ABORTED 404 (Not Found)
```

Next.jsの静的ファイルが見つからないエラーです。

## 原因

1. **開発サーバーが正しく起動していない**
2. **ビルドが完了していない**
3. **.nextディレクトリが正しく生成されていない**
4. **ポート番号が間違っている**（3002を使用しているが、通常は3000）

## 解決方法

### ステップ1: 開発サーバーを停止

現在実行中の開発サーバーを停止：
- ターミナルで **Ctrl + C** を押す

### ステップ2: キャッシュを完全にクリア

```bash
cd C:\devlop\cms\frontend

# ビルドキャッシュを削除
rmdir /s /q .next

# Node.jsキャッシュを削除
rmdir /s /q node_modules\.cache

# package-lock.jsonを削除（オプション）
del package-lock.json
```

### ステップ3: 依存関係を再インストール

```bash
npm install
```

### ステップ4: 開発サーバーを起動

```bash
npm run dev
```

**注意**: デフォルトではポート3000で起動します。ポート3002を使用している場合は、環境変数で指定：

```bash
set PORT=3002 && npm run dev
```

または、`package.json`の`dev`スクリプトを変更：

```json
"dev": "next dev -p 3002"
```

### ステップ5: ブラウザで確認

1. **ブラウザのキャッシュをクリア**
   - Ctrl + Shift + Delete
   - 「キャッシュされた画像とファイル」にチェック
   - 「データを消去」をクリック

2. **シークレットモードでアクセス**
   - Ctrl + Shift + N（Chrome）
   - `http://localhost:3000` または `http://localhost:3002` にアクセス

3. **開発者ツールで確認**
   - F12で開発者ツールを開く
   - Consoleタブでエラーがないか確認
   - Networkタブでリソースの読み込みを確認

## ポート番号の確認

### デフォルトのポート（3000）を使用する場合

```bash
npm run dev
```

アクセス: `http://localhost:3000`

### カスタムポート（3002）を使用する場合

**方法1: 環境変数で指定**
```bash
set PORT=3002 && npm run dev
```

**方法2: package.jsonを変更**
```json
{
  "scripts": {
    "dev": "next dev -p 3002"
  }
}
```

**方法3: .env.localファイルを作成**
```
PORT=3002
```

## トラブルシューティング

### エラーが続く場合

1. **完全なクリーンビルド**
   ```bash
   cd C:\devlop\cms\frontend
   rmdir /s /q .next
   rmdir /s /q node_modules
   npm install
   npm run dev
   ```

2. **ポートが使用中の場合**
   ```bash
   # ポート3002を使用しているプロセスを確認
   netstat -ano | findstr :3002
   
   # プロセスを終了（PIDを確認してから）
   taskkill /PID <PID> /F
   ```

3. **Next.jsのバージョンを確認**
   ```bash
   npm list next
   ```

4. **Node.jsのバージョンを確認**
   ```bash
   node --version
   ```
   Next.js 14+ には Node.js 18.17以上が必要です。

## 確認チェックリスト

- [ ] 開発サーバーが起動している
- [ ] 正しいポート番号でアクセスしている
- [ ] .nextディレクトリが生成されている
- [ ] ブラウザのキャッシュをクリアした
- [ ] シークレットモードでアクセスした
- [ ] 開発者ツールでエラーがないか確認した

## 次のステップ

エラーが解消されたら：
1. アプリケーションが正常に表示されるか確認
2. ログインページが表示されるか確認
3. 機能をテスト

