# Docker Desktop 起動手順（コマンドプロンプト版）

## 現在の状況
Docker Desktopが起動していないため、Docker Composeコマンドが失敗しています。

## 起動手順

### 方法1: スタートメニューから起動（推奨）

1. **Windowsキー**を押す
2. 「**Docker Desktop**」と入力
3. **Docker Desktop**アプリをクリック
4. Docker Desktopが起動するまで待つ（通常30秒〜1分）
5. システムトレイ（タスクバー右下）にDockerアイコンが表示されることを確認
6. アイコンが**緑色**になるまで待つ

### 方法2: コマンドプロンプトから起動

以下のコマンドを実行：

```cmd
start "" "%ProgramFiles%\Docker\Docker\Docker Desktop.exe"
```

または、PowerShellを使用する場合：

```powershell
Start-Process "$env:ProgramFiles\Docker\Docker\Docker Desktop.exe"
```

## 起動確認

Docker Desktopが起動したら、以下のコマンドで確認：

```cmd
docker ps
```

エラーが表示されなければ、正常に起動しています。

## Docker Desktopがインストールされていない場合

### インストール手順

1. https://www.docker.com/products/docker-desktop にアクセス
2. **"Download for Windows"** をクリック
3. ダウンロードしたインストーラー（`Docker Desktop Installer.exe`）を実行
4. インストールウィザードに従ってインストール
5. インストール完了後、**Docker Desktopを起動**
6. 必要に応じてPCを再起動

## 起動後の確認

Docker Desktopが起動したら（システムトレイのアイコンが緑色になったら）、以下を実行：

```cmd
cd C:\devlop\cms
docker-compose up -d --build
```

正常に実行できれば、データベースコンテナが起動します。

## トラブルシューティング

### Docker Desktopが起動しない

1. **タスクマネージャーで確認**
   - Ctrl + Shift + Esc でタスクマネージャーを開く
   - 「Docker Desktop」プロセスが実行中か確認

2. **WSL 2が有効になっているか確認**
   - PowerShell（管理者）で：
   ```powershell
   wsl --status
   ```
   WSL 2が有効でない場合：
   ```powershell
   wsl --set-default-version 2
   ```

3. **Docker Desktopを再起動**
   - システムトレイのDockerアイコンを右クリック
   - "Quit Docker Desktop"を選択
   - 再度起動

### 起動はするが、コマンドが失敗する

1. **Docker Desktopを再起動**
   - システムトレイのDockerアイコンを右クリック
   - "Quit Docker Desktop"を選択
   - 再度起動

2. **管理者権限で実行**
   - コマンドプロンプトを管理者として実行
   - 再度コマンドを実行

## 確認コマンド

```cmd
REM Dockerのバージョン確認
docker --version

REM コンテナの状態確認
docker ps

REM Docker Composeのバージョン確認
docker-compose --version
```

