import { Content, User, University } from './types';

// ユーザー情報のモックデータ
export const mockUsers: User[] = [
  {
    id: 1,
    email: 'admin@example.com',
    name: '管理者',
    role: 'ADMIN',
  },
  {
    id: 2,
    email: 'editor@example.com',
    name: '編集者',
    role: 'EDITOR',
  },
  {
    id: 3,
    email: 'author@example.com',
    name: '執筆者',
    role: 'AUTHOR',
  },
];

// コンテンツ情報のモックデータ（タイトル別）
// 注意: 実際のデータはAPIから取得することを推奨します
// このモックデータは、APIが利用できない場合のフォールバックとして使用されます
export const mockContents: Content[] = [
  {
    id: 1,
    title: '入学手続きガイド',
    body: '入学手続きの詳細なガイドです。\n\n## 入学手続きの流れ\n\n1. 入学許可書の受領\n2. 入学金・授業料の納付\n3. 学生証の交付申請\n4. オリエンテーションへの参加\n\n## 必要な書類\n\n- 入学許可書\n- 住民票\n- 健康診断書\n- 写真（3cm×4cm）\n\n詳細については、学生課までお問い合わせください。',
    slug: 'admission-guide',
    status: 'PUBLISHED',
    authorId: 1,
    universityId: 1,
    contentType: '入学手続き',
    metaDescription: '入学手続きの詳細なガイドです。',
    createdAt: new Date('2024-01-01T00:00:00Z').toISOString(),
    updatedAt: new Date('2024-12-11T13:07:18Z').toISOString(),
    publishedAt: new Date('2024-01-01T00:00:00Z').toISOString(),
  },
  {
    id: 2,
    title: '新入生向けオリエンテーション',
    body: '新入生向けオリエンテーションの詳細情報です。\n\n## オリエンテーションの日程\n\n- 日時：4月1日（月）10:00-16:00\n- 場所：本学 大講義室\n- 対象：全学部新入生\n\n## プログラム\n\n1. 学長挨拶\n2. 大学紹介\n3. 履修登録説明\n4. キャンパスツアー\n5. サークル紹介\n\n## 持ち物\n\n- 学生証（交付後）\n- 筆記用具\n- ノート\n\n新入生の皆様、お待ちしております！',
    slug: 'orientation',
    status: 'PUBLISHED',
    authorId: 1,
    universityId: 1,
    contentType: 'お知らせ',
    metaDescription: '新入生向けオリエンテーションの詳細情報です。',
    createdAt: new Date('2024-01-01T00:00:00Z').toISOString(),
    updatedAt: new Date('2024-12-11T13:07:18Z').toISOString(),
    publishedAt: new Date('2024-01-01T00:00:00Z').toISOString(),
  },
  {
    id: 3,
    title: 'よくある質問（FAQ）',
    body: 'よくある質問と回答をまとめました。\n\n## 入学に関する質問\n\n**Q: 入学手続きの期限はいつですか？**\nA: 入学手続きの期限は3月31日までです。\n\n**Q: 入学金の納付方法を教えてください。**\nA: 銀行振込またはオンライン決済が可能です。\n\n## 履修に関する質問\n\n**Q: 履修登録はいつから始まりますか？**\nA: 4月6日から履修登録が開始されます。\n\n**Q: 必修科目を落とした場合はどうなりますか？**\nA: 再履修が必要です。教務課までご相談ください。\n\n## 学生生活に関する質問\n\n**Q: サークル活動はどのように始めますか？**\nA: 新歓期間（4月）に各サークルの説明会に参加してください。\n\nその他のご質問は、学生課までお問い合わせください。',
    slug: 'faq',
    status: 'PUBLISHED',
    authorId: 1,
    universityId: 2,
    contentType: 'FAQ',
    metaDescription: 'よくある質問と回答をまとめました。',
    createdAt: new Date('2024-01-01T00:00:00Z').toISOString(),
    updatedAt: new Date('2024-12-11T13:07:18Z').toISOString(),
    publishedAt: new Date('2024-01-01T00:00:00Z').toISOString(),
  },
  {
    id: 4,
    title: 'AI技術の最新動向セミナー',
    body: '人工知能技術の最新動向について、専門家が詳しく解説します。\n\n## 開催日時\n2024年3月15日（金）14:00-16:00\n\n## 会場\nオンライン（Zoom）\n\n## 講師\n田中太郎教授（情報科学部）\n\n## 内容\n- 機械学習の最新技術\n- 深層学習の応用例\n- AI倫理と社会への影響\n- 生成AIの可能性と課題\n\n## 参加方法\n事前登録が必要です。以下のフォームからお申し込みください。\n\n## 参加費\n無料（本学学生・教職員）\n\n多くの皆様のご参加をお待ちしております。',
    slug: 'ai-seminar-2024',
    status: 'PUBLISHED',
    authorId: 1,
    universityId: 1,
    contentType: 'セミナー',
    metaDescription: 'AI技術の最新動向について学べるセミナーです。',
    createdAt: new Date('2024-01-01T00:00:00Z').toISOString(),
    updatedAt: new Date('2024-12-11T13:07:18Z').toISOString(),
    publishedAt: new Date('2024-01-01T00:00:00Z').toISOString(),
  },
  {
    id: 5,
    title: '国際教育シンポジウム2024',
    body: 'グローバルな視点から教育の未来を考えるシンポジウムを開催します。\n\n## 開催日時\n2024年4月20日（土）10:00-17:00\n\n## 会場\n本学 大講義室A\n\n## テーマ\n「デジタル時代の教育変革」\n\n## プログラム\n- 基調講演：デジタル教育の可能性（10:00-11:30）\n- パネルディスカッション：教育現場での実践例（13:00-15:00）\n- ワークショップ：オンライン学習の効果的な活用方法（15:30-17:00）\n\n## 参加対象\n教育関係者、学生、一般の方\n\n## 参加費\n無料（要事前登録）\n\n## 申し込み方法\n本学ウェブサイトからお申し込みください。\n\n多くの皆様のご参加をお待ちしております。',
    slug: 'international-education-symposium-2024',
    status: 'PUBLISHED',
    authorId: 1,
    universityId: 1,
    contentType: 'シンポジウム',
    metaDescription: 'グローバルな視点から教育の未来を考えるシンポジウムです。',
    createdAt: new Date('2024-01-01T00:00:00Z').toISOString(),
    updatedAt: new Date('2024-12-11T13:07:18Z').toISOString(),
    publishedAt: new Date('2024-01-01T00:00:00Z').toISOString(),
  },
  {
    id: 6,
    title: '起業家育成セミナー',
    body: '起業を志す学生向けの実践的なセミナーです。\n\n## 開催日時\n2024年5月10日（金）18:00-20:00\n\n## 会場\n本学 イノベーションセンター\n\n## 講師\n山田花子氏（起業家・投資家）\n\n## 内容\n- ビジネスプランの作り方\n- 資金調達の方法\n- スタートアップの成功事例\n- 失敗から学ぶ教訓\n\n## 参加方法\n学内ポータルから事前登録が必要です。\n\n## 参加費\n無料（本学学生）\n\n起業を志す学生の皆様のご参加をお待ちしております。',
    slug: 'entrepreneurship-seminar-2024',
    status: 'PUBLISHED',
    authorId: 1,
    universityId: 2,
    contentType: 'セミナー',
    metaDescription: '起業を志す学生向けの実践的なセミナーです。',
    createdAt: new Date('2024-01-01T00:00:00Z').toISOString(),
    updatedAt: new Date('2024-12-11T13:07:18Z').toISOString(),
    publishedAt: new Date('2024-01-01T00:00:00Z').toISOString(),
  },
];

// モックデータを取得する関数
export const getMockContents = (): Content[] => {
  return mockContents;
};

// IDでコンテンツを取得（文字列IDにも対応）
export const getMockContentById = (id: number | string): Content | undefined => {
  const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
  if (isNaN(numericId)) {
    return undefined;
  }
  return mockContents.find((content) => content.id === numericId);
};

// タイトルでコンテンツを取得
export const getMockContentByTitle = (title: string): Content | undefined => {
  return mockContents.find((content) => content.title === title);
};

// タイトルでコンテンツを検索（部分一致）
export const searchMockContentsByTitle = (title: string): Content[] => {
  const lowerTitle = title.toLowerCase();
  return mockContents.filter((content) => 
    content.title.toLowerCase().includes(lowerTitle)
  );
};

// ユーザー情報を取得
export const getMockUserById = (id: number): User | undefined => {
  return mockUsers.find((user) => user.id === id);
};

// すべてのユーザーを取得
export const getMockUsers = (): User[] => {
  return mockUsers;
};

// 大学情報のモックデータ
export const mockUniversities: University[] = [
  {
    id: 1,
    code: 'UT',
    name: '東京大学',
    description: '日本の国立大学',
    domain: 'u-tokyo.ac.jp',
    active: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    code: 'KU',
    name: '京都大学',
    description: '日本の国立大学',
    domain: 'kyoto-u.ac.jp',
    active: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 3,
    code: 'OSU',
    name: '大阪大学',
    description: '日本の国立大学',
    domain: 'osaka-u.ac.jp',
    active: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 4,
    code: 'TIT',
    name: '東京工業大学',
    description: '日本の国立大学',
    domain: 'titech.ac.jp',
    active: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 5,
    code: 'WU',
    name: '早稲田大学',
    description: '日本の私立大学',
    domain: 'waseda.jp',
    active: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 6,
    code: 'KUW',
    name: '慶應義塾大学',
    description: '日本の私立大学',
    domain: 'keio.ac.jp',
    active: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

// すべての大学を取得
export const getMockUniversities = (): University[] => {
  return mockUniversities;
};

