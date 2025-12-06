# 404エラー（静的ファイル）完全修正ガイド

## 🔴 エラー
```
Failed to load resource: the server responded with a status of 404 (Not Found)
- /_next/static/chunks/main-app.js
- /_next/static/chunks/app/page.js
- /_next/static/chunks/app-pages-internals.js
- layout.css
```

## 原因
Next.jsの開発サーバーが正しく起動していない、またはビルドが完了していません。

## ✅ 解決方法

### ステップ1: 開発サーバーを完全に停止

1. 現在実行中の開発サーバーを停止
   - ターミナルで **Ctrl + C** を押す
   - または、プロセスを終了

2. ポート3002を使用しているプロセスを確認・終了：
   ```bash
   netstat -ano | findstr :3002
   taskkill /PID <PID> /F
   ```

### ステップ2: キャッシュを完全にクリア

```bash
cd C:\devlop\cms\frontend

# ビルドキャッシュを削除
rmdir /s /q .next

# Node.jsキャッシュを削除
rmdir /s /q node_modules\.cache
```

### ステップ3: 開発サーバーを起動

```bash
npm run dev
```

これでポート3002で開発サーバーが起動します。

### ステップ4: ビルドが完了するまで待つ

開発サーバーが起動すると、以下のメッセージが表示されます：
```
✓ Ready in X seconds
○ Compiling / ...
✓ Compiled / in X seconds
```

**重要**: ビルドが完了するまで待ってから、ブラウザでアクセスしてください。

### ステップ5: ブラウザで確認

1. **ブラウザのキャッシュをクリア**
   - Ctrl + Shift + Delete
   - 「キャッシュされた画像とファイル」にチェック
   - 「データを消去」をクリック

2. **シークレットモードでアクセス**
   - Ctrl + Shift + N（Chrome）
   - `http://localhost:3002` にアクセス

3. **開発者ツールで確認**
   - F12で開発者ツールを開く
   - Networkタブでリソースの読み込みを確認
   - 404エラーが表示されないことを確認

## 🆘 それでも解決しない場合

### 方法1: 完全なクリーンビルド

```bash
cd C:\devlop\cms\frontend

# すべてのキャッシュを削除
rmdir /s /q .next
rmdir /s /q node_modules\.cache

# 依存関係を再インストール
npm install

# 開発サーバーを起動
npm run dev
```

### 方法2: 別のポートで試す

```bash
npm run dev -- -p 3000
```

アクセス: `http://localhost:3000`

### 方法3: プロダクションビルドで確認

```bash
cd C:\devlop\cms\frontend

# プロダクションビルド
npm run build

# プロダクションサーバーを起動
npm start
```

## 📋 確認チェックリスト

- [ ] 開発サーバーが正常に起動している
- [ ] ビルドが完了している（"Ready" メッセージが表示されている）
- [ ] ポート3002でアクセスできる
- [ ] .nextディレクトリが生成されている
- [ ] .next/staticディレクトリが存在している
- [ ] ブラウザのキャッシュをクリアした
- [ ] シークレットモードでアクセスした
- [ ] 404エラーが表示されない

## 💡 ヒント

- 開発サーバーが起動してから、ビルドが完了するまで通常10-30秒かかります
- ビルドが完了する前にアクセスすると、404エラーが発生します
- ターミナルに "Ready" と表示されるまで待ってからアクセスしてください

## 🔍 トラブルシューティング

### ビルドエラーが発生する場合

1. **エラーメッセージを確認**
   - ターミナルに表示されるエラーメッセージを確認

2. **依存関係を再インストール**
   ```bash
   rmdir /s /q node_modules
   npm install
   ```

3. **Node.jsのバージョンを確認**
   ```bash
   node --version
   ```
   Next.js 14+ には Node.js 18.17以上が必要です。

### ポートが使用中の場合

```bash
# ポート3002を使用しているプロセスを確認
netstat -ano | findstr :3002

# プロセスを終了（PIDを確認してから）
taskkill /PID <PID> /F
```

