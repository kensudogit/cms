# ログインページ無効化

## 実施した変更

ログインページへのリダイレクトを一時的に無効化しました。

### 変更内容

1. **`app/page.tsx`** (ホームページ)
   - ログインチェックを削除
   - 直接ダッシュボードにリダイレクト

2. **`app/dashboard/page.tsx`** (ダッシュボード)
   - ログインチェックをコメントアウト
   - ユーザー情報がない場合でも表示可能に
   - ログアウト後もダッシュボードに戻るように変更

### ログインページについて

`app/login/page.tsx`は削除していません。必要に応じて再度有効化できます。

## ログインページを再度有効化する場合

### 1. `app/page.tsx`を元に戻す

```typescript
useEffect(() => {
  if (token) {
    router.push('/dashboard');
  } else {
    router.push('/login');
  }
}, [router, token]);
```

### 2. `app/dashboard/page.tsx`を元に戻す

```typescript
useEffect(() => {
  if (!token) {
    router.push('/login');
  }
}, [router, token]);

if (!user) {
  return null;
}
```

### 3. ログアウト処理を元に戻す

```typescript
const handleLogout = () => {
  clearAuth();
  router.push('/login');
};
```

## 注意事項

- 現在、認証なしでダッシュボードにアクセスできます
- API呼び出しは認証が必要な場合、エラーが発生する可能性があります
- 本番環境では必ず認証を有効化してください



