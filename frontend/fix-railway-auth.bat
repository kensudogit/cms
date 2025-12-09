@echo off
echo ========================================
echo Railway HTTP認証無効化スクリプト
echo ========================================
echo.

echo Railway CLIがインストールされているか確認中...
railway --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Railway CLIがインストールされていません。
    echo インストール中...
    npm install -g @railway/cli
    if %errorlevel% neq 0 (
        echo エラー: Railway CLIのインストールに失敗しました。
        echo 手動でインストールしてください: npm install -g @railway/cli
        pause
        exit /b 1
    )
)

echo.
echo Railwayにログインしてください...
railway login
if %errorlevel% neq 0 (
    echo エラー: Railwayへのログインに失敗しました。
    pause
    exit /b 1
)

echo.
echo プロジェクトにリンク中...
cd /d "%~dp0"
railway link
if %errorlevel% neq 0 (
    echo エラー: プロジェクトのリンクに失敗しました。
    pause
    exit /b 1
)

echo.
echo フロントエンドサービスを選択してください...
railway service

echo.
echo HTTP認証関連の環境変数を削除中...
railway variables unset RAILWAY_HTTP_AUTH_USERNAME
railway variables unset RAILWAY_HTTP_AUTH_PASSWORD
railway variables unset HTTP_AUTH_ENABLED
railway variables unset RAILWAY_HTTP_AUTH_ENABLED

echo.
echo 公開設定を有効化中...
railway variables set RAILWAY_PUBLIC=true

echo.
echo ========================================
echo 完了しました！
echo ========================================
echo.
echo 次のステップ:
echo 1. Railwayダッシュボードで設定を確認してください
echo 2. サービスを再デプロイしてください
echo 3. ブラウザのキャッシュをクリアしてアクセスしてください
echo.
pause


