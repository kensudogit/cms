-- ユーザーモックデータの投入
-- パスワードは全て "password" をBCryptでハッシュ化したもの
-- BCryptハッシュ: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy

-- 既存データを削除（オプション: 開発環境のみ）
-- DELETE FROM users;

-- ユーザーデータの投入
INSERT INTO users (id, email, password, name, role, active, created_at, updated_at)
VALUES 
  (1, 'admin@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '管理者', 'ADMIN', true, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
  (2, 'editor@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '編集者', 'EDITOR', true, '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
  (3, 'author@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '執筆者', 'USER', true, '2024-01-01 10:00:00', '2024-01-01 10:00:00')
ON CONFLICT (id) DO NOTHING;

-- シーケンスをリセット（IDが手動で設定されている場合）
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));



