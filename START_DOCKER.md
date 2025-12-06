# Docker Desktop 起動手順

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

### 方法2: ファイルエクスプローラーから起動

1. **Windowsキー + E**でファイルエクスプローラーを開く
2. アドレスバーに以下を入力：
   ```
   shell:AppsFolder
   ```
3. Enterキーを押す
4. 「**Docker Desktop**」を検索
5. ダブルクリックして起動

### 方法3: コマンドラインから起動

PowerShellで以下を実行：

```powershell
# Docker Desktopのパスを確認
$dockerPath = "$env:ProgramFiles\Docker\Docker\Docker Desktop.exe"
if (Test-Path $dockerPath) {
    Start-Process $dockerPath
    Write-Host "Docker Desktopを起動しました。起動完了まで待ってください..."
} else {
    Write-Host "Docker Desktopが見つかりません。インストールが必要です。"
}
```

## 起動確認

Docker Desktopが起動したら、以下のコマンドで確認：

```powershell
# Dockerの状態確認
docker ps

# エラーが表示されなければ、正常に起動しています
```

## Docker Desktopがインストールされていない場合

### インストール手順

1. https://www.docker.com/products/docker-desktop にアクセス
2. **"Download for Windows"** をクリック
3. ダウンロードしたインストーラー（`Docker Desktop Installer.exe`）を実行
4. インストールウィザードに従ってインストール
5. インストール完了後、**Docker Desktopを起動**
6. 必要に応じてPCを再起動

### システム要件

- Windows 10 64-bit: Pro, Enterprise, or Education (Build 19041以上)
- Windows 11 64-bit: Home or Pro version 21H2以上
- WSL 2機能が有効になっていること
- 仮想化が有効になっていること（BIOS/UEFI設定）

## 起動に時間がかかる場合

Docker Desktopの初回起動は時間がかかることがあります：
- 初回起動: 1-3分
- 通常の起動: 30秒〜1分

システムトレイのDockerアイコンが緑色になれば起動完了です。

## トラブルシューティング

### Docker Desktopが起動しない

1. **タスクマネージャーで確認**
   - Ctrl + Shift + Esc でタスクマネージャーを開く
   - 「Docker Desktop」プロセスが実行中か確認

2. **Windowsのサービスを確認**
   ```powershell
   Get-Service -Name "*docker*"
   ```

3. **WSL 2が有効になっているか確認**
   ```powershell
   wsl --status
   ```
   WSL 2が有効でない場合：
   ```powershell
   wsl --set-default-version 2
   ```

4. **Docker Desktopを再インストール**
   - コントロールパネルからアンインストール
   - 再度インストール

### 起動はするが、コマンドが失敗する

1. **Docker Desktopを再起動**
   - システムトレイのDockerアイコンを右クリック
   - "Quit Docker Desktop"を選択
   - 再度起動

2. **管理者権限で実行**
   - PowerShellを管理者として実行
   - 再度コマンドを実行

## 起動後の確認

Docker Desktopが起動したら、以下を実行：

```powershell
cd C:\devlop\cms
docker-compose up -d --build
```

正常に実行できれば、データベースコンテナが起動します。

