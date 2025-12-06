# Docker Compose エラー対応ガイド

## エラーの原因

### エラー1: Docker Desktopが起動していない
```
error during connect: Get "http://%2F%2F.%2Fpipe%2FdockerDesktopLinuxEngine/v1.51/...": 
open //./pipe/dockerDesktopLinuxEngine: The system cannot find the file specified.
```

**原因:** Docker Desktopが起動していないか、Dockerデーモンに接続できません。

### エラー2: version属性の警告
```
the attribute `version` is obsolete, it will be ignored
```

**原因:** Docker Composeの新しいバージョンでは`version`属性が不要になりました。

## 解決方法

### ステップ1: Docker Desktopを起動

1. **Windowsのスタートメニュー**から「Docker Desktop」を検索
2. **Docker Desktop**を起動
3. システムトレイ（タスクバーの右下）にDockerアイコンが表示されるまで待つ
4. Dockerアイコンが緑色になるまで待つ（起動完了）

**確認方法:**
```powershell
docker ps
```
このコマンドがエラーなく実行できれば、Docker Desktopが正常に起動しています。

### ステップ2: docker-compose.ymlの修正（完了済み）

`version: '3.8'`行を削除しました。これで警告は表示されなくなります。

### ステップ3: Docker Composeを再実行

Docker Desktopが起動したら、以下のコマンドを実行：

```powershell
cd C:\devlop\cms
docker-compose up -d --build
```

## Docker Desktopがインストールされていない場合

### インストール方法

1. https://www.docker.com/products/docker-desktop にアクセス
2. **"Download for Windows"** をクリック
3. インストーラーを実行
4. インストール後、Docker Desktopを起動
5. 再起動が必要な場合は、PCを再起動

## トラブルシューティング

### Docker Desktopが起動しない

1. **Windowsのサービスを確認**
   - Windowsキー + R → `services.msc` を入力
   - "Docker Desktop Service"が起動しているか確認

2. **WSL 2が有効になっているか確認**
   - PowerShell（管理者）で以下を実行：
   ```powershell
   wsl --status
   ```
   - WSL 2が有効になっていることを確認

3. **Docker Desktopを再起動**
   - システムトレイのDockerアイコンを右クリック
   - "Quit Docker Desktop"を選択
   - 再度Docker Desktopを起動

### ポートが既に使用されている

エラーメッセージに「port is already allocated」と表示される場合：

1. **使用中のポートを確認**
   ```powershell
   netstat -ano | findstr :5432
   netstat -ano | findstr :5433
   netstat -ano | findstr :5434
   netstat -ano | findstr :5435
   ```

2. **既存のコンテナを停止**
   ```powershell
   docker-compose down
   ```

3. **既存のコンテナを削除**
   ```powershell
   docker-compose down -v
   ```

### イメージのダウンロードに失敗する

1. **インターネット接続を確認**
2. **Docker Hubにアクセスできるか確認**
3. **プロキシ設定を確認**（企業ネットワークの場合）

## 確認コマンド

### Docker Desktopの状態確認
```powershell
docker --version
docker ps
docker-compose --version
```

### コンテナの状態確認
```powershell
docker-compose ps
docker ps -a
```

### ログの確認
```powershell
docker-compose logs
docker-compose logs postgres-auth
```

## 次のステップ

Docker Desktopが起動したら：

1. **データベースを起動**
   ```powershell
   cd C:\devlop\cms
   docker-compose up -d
   ```

2. **データベースの状態を確認**
   ```powershell
   docker-compose ps
   ```

3. **バックエンドサービスを起動**
   - Auth Service
   - Content Service
   - API Gateway

## 参考リンク

- [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

