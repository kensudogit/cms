# モジュールエラー修正

## 問題

```
Error: Cannot find module './769.js'
```

このエラーは、Next.jsのビルドキャッシュ（`.next`ディレクトリ）が破損している場合に発生します。

## 対応内容

1. **Node.jsプロセスの停止**
   - 実行中のNode.jsプロセスをすべて停止

2. **.nextディレクトリの削除**
   - 破損したビルドキャッシュを削除

3. **再ビルド**
   - `npm run build`を実行してクリーンビルド

## 解決方法

### 手動で修正する場合

```bash
# 1. Node.jsプロセスを停止
taskkill /F /IM node.exe

# 2. .nextディレクトリを削除
rmdir /s /q .next

# 3. 再ビルド
npm run build

# 4. 開発サーバーを起動
npm run dev
```

### より徹底的なクリーンアップが必要な場合

```bash
# 1. Node.jsプロセスを停止
taskkill /F /IM node.exe

# 2. .nextディレクトリを削除
rmdir /s /q .next

# 3. node_modulesを削除（オプション）
rmdir /s /q node_modules

# 4. package-lock.jsonを削除（オプション）
del package-lock.json

# 5. 依存関係を再インストール
npm install

# 6. 再ビルド
npm run build

# 7. 開発サーバーを起動
npm run dev
```

## 予防策

1. **定期的なクリーンアップ**
   - 開発中に問題が発生した場合は、`.next`ディレクトリを削除して再ビルド

2. **Git管理**
   - `.next`ディレクトリは`.gitignore`に含まれていることを確認

3. **依存関係の更新**
   - 定期的に`npm update`を実行して依存関係を更新

## 注意事項

- `.next`ディレクトリは自動生成されるため、Gitにコミットしないでください
- ビルドエラーが発生した場合は、まず`.next`ディレクトリを削除して再試行してください

