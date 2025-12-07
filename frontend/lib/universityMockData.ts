import { University, Content, ProcedureFlow, ProcedureStep, ProcedureProgress } from './types';

// 大学のモックデータ
export const mockUniversities: University[] = [
  {
    id: 1,
    code: 'TOKYO_UNIV',
    name: '東京大学',
    description: '日本の最高学府として、世界トップレベルの教育・研究を提供しています。',
    domain: 'u-tokyo.ac.jp',
    active: true,
    createdAt: new Date('2024-01-01T00:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-01T00:00:00Z').toISOString(),
  },
  {
    id: 2,
    code: 'KYOTO_UNIV',
    name: '京都大学',
    description: '自由の学風を掲げ、創造性豊かな人材を育成しています。',
    domain: 'kyoto-u.ac.jp',
    active: true,
    createdAt: new Date('2024-01-01T00:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-01T00:00:00Z').toISOString(),
  },
  {
    id: 3,
    code: 'OSAKA_UNIV',
    name: '大阪大学',
    description: '地域に根ざし、世界に開かれた大学として、多様な価値観を尊重します。',
    domain: 'osaka-u.ac.jp',
    active: true,
    createdAt: new Date('2024-01-01T00:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-01T00:00:00Z').toISOString(),
  },
  {
    id: 4,
    code: 'WASEDA_UNIV',
    name: '早稲田大学',
    description: '学問の独立、学問の活用、模範国民の造就を建学の精神としています。',
    domain: 'waseda.jp',
    active: true,
    createdAt: new Date('2024-01-01T00:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-01T00:00:00Z').toISOString(),
  },
  {
    id: 5,
    code: 'KEIO_UNIV',
    name: '慶應義塾大学',
    description: '実学の精神に基づき、社会に貢献する人材を育成しています。',
    domain: 'keio.ac.jp',
    active: true,
    createdAt: new Date('2024-01-01T00:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-01T00:00:00Z').toISOString(),
  },
];

// 東京大学のコンテンツ
export const tokyoUnivContents: Content[] = [
  {
    id: 101,
    title: '東京大学 入学手続きガイド',
    slug: 'tokyo-univ-admission-guide',
    body: '東京大学への入学を希望される皆様へ。\n\n## 入学手続きの流れ\n\n1. 入学許可書の受領\n2. 入学金・授業料の納付\n3. 学生証の交付申請\n4. オリエンテーションへの参加\n\n## 必要な書類\n\n- 入学許可書\n- 住民票\n- 健康診断書\n- 写真（3cm×4cm）\n\n詳細については、学生課までお問い合わせください。',
    status: 'PUBLISHED',
    authorId: 1,
    universityId: 1,
    contentType: '入学手続き',
    metaDescription: '東京大学の入学手続きに関する詳細なガイドです。',
    createdAt: new Date('2024-01-10T09:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-15T14:30:00Z').toISOString(),
    publishedAt: new Date('2024-01-15T14:30:00Z').toISOString(),
  },
  {
    id: 102,
    title: '東京大学 学生生活ガイド',
    slug: 'tokyo-univ-student-life',
    body: '東京大学での学生生活を充実させるための情報をまとめました。\n\n## キャンパスライフ\n\n- 図書館の利用方法\n- 食堂・カフェ情報\n- サークル活動\n- スポーツ施設\n\n## 学業サポート\n\n- 学習支援センター\n- キャリア支援\n- 留学プログラム\n\n充実した学生生活を送りましょう！',
    status: 'PUBLISHED',
    authorId: 1,
    universityId: 1,
    contentType: '学生生活',
    metaDescription: '東京大学での学生生活に関する情報です。',
    createdAt: new Date('2024-01-12T10:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-18T16:00:00Z').toISOString(),
    publishedAt: new Date('2024-01-18T16:00:00Z').toISOString(),
  },
  {
    id: 103,
    title: '東京大学 卒業手続きについて',
    slug: 'tokyo-univ-graduation',
    body: '卒業を控えた皆様へ、卒業手続きの詳細をお知らせします。\n\n## 卒業手続きの流れ\n\n1. 卒業要件の確認\n2. 卒業論文の提出\n3. 卒業式への参加\n4. 学位記の受領\n\n## 注意事項\n\n- 手続き期限を必ず確認してください\n- 必要な書類を事前に準備してください\n\nご不明な点がございましたら、教務課までお問い合わせください。',
    status: 'PUBLISHED',
    authorId: 1,
    universityId: 1,
    contentType: '卒業手続き',
    metaDescription: '東京大学の卒業手続きに関する情報です。',
    createdAt: new Date('2024-01-20T11:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-25T15:30:00Z').toISOString(),
    publishedAt: new Date('2024-01-25T15:30:00Z').toISOString(),
  },
];

// 京都大学のコンテンツ
export const kyotoUnivContents: Content[] = [
  {
    id: 201,
    title: '京都大学 入学案内',
    slug: 'kyoto-univ-admission',
    body: '京都大学への入学を希望される皆様へ。\n\n## 京都大学の特徴\n\n京都大学は「自由の学風」を掲げ、学生の自主性と創造性を大切にしています。\n\n## 入学手続き\n\n1. 入学許可書の確認\n2. 入学手続き書類の提出\n3. 学費の納付\n4. 学生証の交付\n\n## キャンパス案内\n\n- 吉田キャンパス\n- 宇治キャンパス\n- 桂キャンパス\n\n各キャンパスの特色を活かした教育・研究を行っています。',
    status: 'PUBLISHED',
    authorId: 1,
    universityId: 2,
    contentType: '入学手続き',
    metaDescription: '京都大学の入学に関する情報です。',
    createdAt: new Date('2024-01-10T09:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-16T13:00:00Z').toISOString(),
    publishedAt: new Date('2024-01-16T13:00:00Z').toISOString(),
  },
  {
    id: 202,
    title: '京都大学 研究活動について',
    slug: 'kyoto-univ-research',
    body: '京都大学における研究活動の概要をご紹介します。\n\n## 研究分野\n\n- 自然科学\n- 人文科学\n- 社会科学\n- 医学・薬学\n\n## 研究支援制度\n\n- 研究費の申請方法\n- 共同研究の進め方\n- 研究成果の発表\n\n世界トップレベルの研究を目指しています。',
    status: 'PUBLISHED',
    authorId: 1,
    universityId: 2,
    contentType: '研究活動',
    metaDescription: '京都大学の研究活動に関する情報です。',
    createdAt: new Date('2024-01-15T10:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-20T14:00:00Z').toISOString(),
    publishedAt: new Date('2024-01-20T14:00:00Z').toISOString(),
  },
  {
    id: 203,
    title: '京都大学 国際交流プログラム',
    slug: 'kyoto-univ-international',
    body: '京都大学では、様々な国際交流プログラムを提供しています。\n\n## 留学プログラム\n\n- 交換留学\n- 短期留学\n- 語学研修\n\n## 国際学生の受け入れ\n\n- 留学生のサポート体制\n- 日本語教育プログラム\n- 生活支援\n\nグローバルな視野を持った人材を育成します。',
    status: 'PUBLISHED',
    authorId: 1,
    universityId: 2,
    contentType: '国際交流',
    metaDescription: '京都大学の国際交流プログラムに関する情報です。',
    createdAt: new Date('2024-01-18T11:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-22T15:00:00Z').toISOString(),
    publishedAt: new Date('2024-01-22T15:00:00Z').toISOString(),
  },
];

// 大阪大学のコンテンツ
export const osakaUnivContents: Content[] = [
  {
    id: 301,
    title: '大阪大学 新入生向けガイド',
    slug: 'osaka-univ-new-student-guide',
    body: '大阪大学に入学された新入生の皆様、おめでとうございます！\n\n## 新入生オリエンテーション\n\n- 日程：4月1日～4月5日\n- 場所：各キャンパス\n- 内容：大学紹介、履修登録説明、キャンパスツアー\n\n## 履修登録について\n\n- 履修登録期間：4月6日～4月10日\n- 登録方法：オンラインシステム\n- 注意事項：必修科目を必ず登録してください\n\n## 学生生活のサポート\n\n- 学生相談室\n- 健康管理センター\n- キャリア支援センター\n\n充実した大学生活を送りましょう！',
    status: 'PUBLISHED',
    authorId: 1,
    universityId: 3,
    contentType: '新入生向け',
    metaDescription: '大阪大学の新入生向けガイドです。',
    createdAt: new Date('2024-01-10T09:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-17T12:00:00Z').toISOString(),
    publishedAt: new Date('2024-01-17T12:00:00Z').toISOString(),
  },
  {
    id: 302,
    title: '大阪大学 キャンパス案内',
    slug: 'osaka-univ-campus-guide',
    body: '大阪大学の3つのキャンパスをご紹介します。\n\n## 豊中キャンパス\n\n- 文学部、法学部、経済学部、理学部、工学部、基礎工学部\n- アクセス：阪急宝塚線「石橋駅」からバス\n\n## 吹田キャンパス\n\n- 医学部、歯学部、薬学部、工学部（一部）\n- アクセス：阪急千里線「関大前駅」から徒歩\n\n## 箕面キャンパス\n\n- 外国語学部\n- アクセス：阪急箕面線「箕面駅」から徒歩\n\n各キャンパスの特色を活かした教育を行っています。',
    status: 'PUBLISHED',
    authorId: 1,
    universityId: 3,
    contentType: 'キャンパス案内',
    metaDescription: '大阪大学のキャンパス案内です。',
    createdAt: new Date('2024-01-14T10:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-19T14:00:00Z').toISOString(),
    publishedAt: new Date('2024-01-19T14:00:00Z').toISOString(),
  },
  {
    id: 303,
    title: '大阪大学 就職支援について',
    slug: 'osaka-univ-career-support',
    body: '大阪大学では、学生の就職活動を全面的にサポートしています。\n\n## 就職支援サービス\n\n- キャリアカウンセリング\n- 企業説明会の開催\n- インターンシップ紹介\n- 就職活動セミナー\n\n## 就職実績\n\n- 大手企業への就職実績\n- 公務員試験対策\n- 大学院進学支援\n\n将来のキャリア形成をサポートします。',
    status: 'PUBLISHED',
    authorId: 1,
    universityId: 3,
    contentType: '就職支援',
    metaDescription: '大阪大学の就職支援に関する情報です。',
    createdAt: new Date('2024-01-16T11:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-21T15:00:00Z').toISOString(),
    publishedAt: new Date('2024-01-21T15:00:00Z').toISOString(),
  },
];

// 早稲田大学のコンテンツ
export const wasedaUnivContents: Content[] = [
  {
    id: 401,
    title: '早稲田大学 入学手続きのご案内',
    slug: 'waseda-univ-admission-procedure',
    body: '早稲田大学への入学を許可された皆様、おめでとうございます！\n\n## 入学手続きの流れ\n\n1. **入学手続き書類の提出**\n   - 期限：3月15日まで\n   - 提出先：入学課\n\n2. **入学金・授業料の納付**\n   - 納付期限：3月20日まで\n   - 納付方法：銀行振込またはオンライン決済\n\n3. **学生証の交付**\n   - 交付日：4月1日\n   - 場所：各学部事務室\n\n## 新入生オリエンテーション\n\n- 日程：4月2日～4月6日\n- 内容：大学紹介、履修登録説明、キャンパスツアー\n\n早稲田での充実した学生生活を送りましょう！',
    status: 'PUBLISHED',
    authorId: 1,
    universityId: 4,
    contentType: '入学手続き',
    metaDescription: '早稲田大学の入学手続きに関する詳細な案内です。',
    createdAt: new Date('2024-01-10T09:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-18T13:00:00Z').toISOString(),
    publishedAt: new Date('2024-01-18T13:00:00Z').toISOString(),
  },
  {
    id: 402,
    title: '早稲田大学 学費・奨学金制度',
    slug: 'waseda-univ-tuition-scholarship',
    body: '早稲田大学の学費と奨学金制度についてご案内します。\n\n## 学費について\n\n### 初年度納入金\n- 入学金：200,000円\n- 授業料：1,200,000円/年\n- 施設設備費：300,000円/年\n\n### 2年次以降\n- 授業料：1,200,000円/年\n- 施設設備費：300,000円/年\n\n## 奨学金制度\n\n- 早稲田大学独自の奨学金\n- 日本学生支援機構の奨学金\n- 地方公共団体の奨学金\n\n経済的な理由で進学を諦めないでください。',
    status: 'PUBLISHED',
    authorId: 1,
    universityId: 4,
    contentType: '学費・奨学金',
    metaDescription: '早稲田大学の学費と奨学金制度に関する情報です。',
    createdAt: new Date('2024-01-12T10:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-19T14:00:00Z').toISOString(),
    publishedAt: new Date('2024-01-19T14:00:00Z').toISOString(),
  },
  {
    id: 403,
    title: '早稲田大学 サークル・部活動',
    slug: 'waseda-univ-clubs',
    body: '早稲田大学には、約500のサークル・部活動があります。\n\n## サークルの種類\n\n### 体育会系\n- 野球部、サッカー部、ラグビー部など\n- 全国大会出場実績多数\n\n### 文化系\n- 音楽サークル、演劇サークル、写真サークルなど\n- 多様な活動を展開\n\n### 学術系\n- ゼミナール、研究会など\n- 専門的な研究活動\n\n## サークル加入方法\n\n- 新歓期間（4月）に各サークルの説明会に参加\n- 興味のあるサークルに加入\n\n充実したキャンパスライフを送りましょう！',
    status: 'PUBLISHED',
    authorId: 1,
    universityId: 4,
    contentType: 'サークル・部活動',
    metaDescription: '早稲田大学のサークル・部活動に関する情報です。',
    createdAt: new Date('2024-01-15T11:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-20T15:00:00Z').toISOString(),
    publishedAt: new Date('2024-01-20T15:00:00Z').toISOString(),
  },
];

// 慶應義塾大学のコンテンツ
export const keioUnivContents: Content[] = [
  {
    id: 501,
    title: '慶應義塾大学 入学手続きガイド',
    slug: 'keio-univ-admission-guide',
    body: '慶應義塾大学への入学を許可された皆様、おめでとうございます！\n\n## 入学手続きの流れ\n\n1. **入学手続き書類の提出**\n   - 期限：3月10日まで\n   - 提出先：入学事務室\n\n2. **入学金・授業料の納付**\n   - 納付期限：3月15日まで\n   - 納付方法：銀行振込\n\n3. **学生証の交付**\n   - 交付日：4月1日\n   - 場所：各学部事務室\n\n## 新入生オリエンテーション\n\n- 日程：4月2日～4月5日\n- 内容：大学紹介、履修登録説明\n\n慶應義塾での充実した学生生活を送りましょう！',
    status: 'PUBLISHED',
    authorId: 1,
    universityId: 5,
    contentType: '入学手続き',
    metaDescription: '慶應義塾大学の入学手続きに関する詳細なガイドです。',
    createdAt: new Date('2024-01-10T09:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-17T12:00:00Z').toISOString(),
    publishedAt: new Date('2024-01-17T12:00:00Z').toISOString(),
  },
  {
    id: 502,
    title: '慶應義塾大学 三田キャンパス案内',
    slug: 'keio-univ-mita-campus',
    body: '慶應義塾大学のメインキャンパスである三田キャンパスをご紹介します。\n\n## キャンパスの特徴\n\n- 都心に位置する便利な立地\n- 歴史ある建物とモダンな施設の調和\n- 充実した図書館・学習施設\n\n## 主な施設\n\n- 図書館：蔵書数約200万冊\n- 体育館：各種スポーツ施設完備\n- 食堂：多様なメニューを提供\n\n## アクセス\n\n- JR山手線「田町駅」から徒歩10分\n- 都営三田線「三田駅」から徒歩5分\n\n充実した学習環境が整っています。',
    status: 'PUBLISHED',
    authorId: 1,
    universityId: 5,
    contentType: 'キャンパス案内',
    metaDescription: '慶應義塾大学三田キャンパスの案内です。',
    createdAt: new Date('2024-01-13T10:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-19T13:00:00Z').toISOString(),
    publishedAt: new Date('2024-01-19T13:00:00Z').toISOString(),
  },
  {
    id: 503,
    title: '慶應義塾大学 国際交流・留学プログラム',
    slug: 'keio-univ-international-exchange',
    body: '慶應義塾大学では、様々な国際交流・留学プログラムを提供しています。\n\n## 留学プログラム\n\n### 交換留学\n- 提携大学への1年間の留学\n- 単位認定制度あり\n\n### 短期留学\n- 夏季・冬季休暇を利用した短期プログラム\n- 語学研修を含む\n\n### 語学研修\n- 英語、中国語、韓国語などの語学研修\n- 現地での実践的な学習\n\n## 国際学生の受け入れ\n\n- 留学生のサポート体制\n- 日本語教育プログラム\n- 生活支援サービス\n\nグローバルな視野を持った人材を育成します。',
    status: 'PUBLISHED',
    authorId: 1,
    universityId: 5,
    contentType: '国際交流',
    metaDescription: '慶應義塾大学の国際交流・留学プログラムに関する情報です。',
    createdAt: new Date('2024-01-16T11:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-21T14:00:00Z').toISOString(),
    publishedAt: new Date('2024-01-21T14:00:00Z').toISOString(),
  },
];

// 全大学のコンテンツを統合
export const allUniversityContents: Content[] = [
  ...tokyoUnivContents,
  ...kyotoUnivContents,
  ...osakaUnivContents,
  ...wasedaUnivContents,
  ...keioUnivContents,
];

// 手続きフローのモックデータ
export const mockProcedureFlows: ProcedureFlow[] = [
  {
    id: 1,
    universityId: 1,
    name: '東京大学 入学手続きフロー',
    description: '東京大学への入学手続きを順を追って進めます。',
    flowType: '入学',
    displayOrder: 1,
    active: true,
    steps: [],
    createdAt: new Date('2024-01-01T00:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-01T00:00:00Z').toISOString(),
  },
  {
    id: 2,
    universityId: 1,
    name: '東京大学 卒業手続きフロー',
    description: '東京大学の卒業手続きを順を追って進めます。',
    flowType: '卒業',
    displayOrder: 2,
    active: true,
    steps: [],
    createdAt: new Date('2024-01-01T00:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-01T00:00:00Z').toISOString(),
  },
  {
    id: 3,
    universityId: 2,
    name: '京都大学 入学手続きフロー',
    description: '京都大学への入学手続きを順を追って進めます。',
    flowType: '入学',
    displayOrder: 1,
    active: true,
    steps: [],
    createdAt: new Date('2024-01-01T00:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-01T00:00:00Z').toISOString(),
  },
  {
    id: 4,
    universityId: 3,
    name: '大阪大学 新入生手続きフロー',
    description: '大阪大学の新入生向け手続きを順を追って進めます。',
    flowType: '入学',
    displayOrder: 1,
    active: true,
    steps: [],
    createdAt: new Date('2024-01-01T00:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-01T00:00:00Z').toISOString(),
  },
  {
    id: 5,
    universityId: 4,
    name: '早稲田大学 入学手続きフロー',
    description: '早稲田大学への入学手続きを順を追って進めます。',
    flowType: '入学',
    displayOrder: 1,
    active: true,
    steps: [],
    createdAt: new Date('2024-01-01T00:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-01T00:00:00Z').toISOString(),
  },
  {
    id: 6,
    universityId: 5,
    name: '慶應義塾大学 入学手続きフロー',
    description: '慶應義塾大学への入学手続きを順を追って進めます。',
    flowType: '入学',
    displayOrder: 1,
    active: true,
    steps: [],
    createdAt: new Date('2024-01-01T00:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-01T00:00:00Z').toISOString(),
  },
];

// 手続きステップのモックデータ（東京大学 入学手続きフロー）
export const mockProcedureSteps: ProcedureStep[] = [
  {
    id: 1,
    flowId: 1,
    contentId: 101,
    name: '入学許可書の受領',
    description: '入学許可書を受け取り、内容を確認してください。',
    stepOrder: 1,
    requiredRole: 'STUDENT',
    isRequired: true,
    active: true,
    createdAt: new Date('2024-01-01T00:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-01T00:00:00Z').toISOString(),
  },
  {
    id: 2,
    flowId: 1,
    contentId: 101,
    name: '入学金・授業料の納付',
    description: '入学金と授業料を指定の期日までに納付してください。',
    stepOrder: 2,
    requiredRole: 'STUDENT',
    isRequired: true,
    dependsOnStepIds: '1',
    active: true,
    createdAt: new Date('2024-01-01T00:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-01T00:00:00Z').toISOString(),
  },
  {
    id: 3,
    flowId: 1,
    contentId: 101,
    name: '学生証の交付申請',
    description: '学生証の交付申請を行ってください。',
    stepOrder: 3,
    requiredRole: 'STUDENT',
    isRequired: true,
    dependsOnStepIds: '2',
    active: true,
    createdAt: new Date('2024-01-01T00:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-01T00:00:00Z').toISOString(),
  },
  {
    id: 4,
    flowId: 1,
    contentId: 102,
    name: 'オリエンテーションへの参加',
    description: '新入生オリエンテーションに参加してください。',
    stepOrder: 4,
    requiredRole: 'STUDENT',
    isRequired: true,
    dependsOnStepIds: '3',
    active: true,
    createdAt: new Date('2024-01-01T00:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-01T00:00:00Z').toISOString(),
  },
];

// 手続き進行状況のモックデータ
export const mockProcedureProgress: ProcedureProgress[] = [
  {
    id: 1,
    userId: 1,
    stepId: 1,
    flowId: 1,
    universityId: 1,
    status: 'COMPLETED',
    startedAt: new Date('2024-01-10T09:00:00Z').toISOString(),
    completedAt: new Date('2024-01-10T10:00:00Z').toISOString(),
    notes: '入学許可書を無事に受領しました。',
    createdAt: new Date('2024-01-10T09:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-10T10:00:00Z').toISOString(),
  },
  {
    id: 2,
    userId: 1,
    stepId: 2,
    flowId: 1,
    universityId: 1,
    status: 'IN_PROGRESS',
    startedAt: new Date('2024-01-11T09:00:00Z').toISOString(),
    notes: '納付手続きを進めています。',
    createdAt: new Date('2024-01-11T09:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-11T09:00:00Z').toISOString(),
  },
  {
    id: 3,
    userId: 1,
    stepId: 3,
    flowId: 1,
    universityId: 1,
    status: 'NOT_STARTED',
    createdAt: new Date('2024-01-01T00:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-01T00:00:00Z').toISOString(),
  },
  {
    id: 4,
    userId: 1,
    stepId: 4,
    flowId: 1,
    universityId: 1,
    status: 'NOT_STARTED',
    createdAt: new Date('2024-01-01T00:00:00Z').toISOString(),
    updatedAt: new Date('2024-01-01T00:00:00Z').toISOString(),
  },
];

// ユーティリティ関数
export const getMockUniversities = (): University[] => {
  return mockUniversities;
};

export const getMockUniversityById = (id: number): University | undefined => {
  return mockUniversities.find((univ) => univ.id === id);
};

export const getMockContentsByUniversityId = (universityId: number): Content[] => {
  return allUniversityContents.filter((content) => content.universityId === universityId);
};

export const getMockProcedureFlowsByUniversityId = (universityId: number): ProcedureFlow[] => {
  return mockProcedureFlows.filter((flow) => flow.universityId === universityId);
};

export const getMockProcedureStepsByFlowId = (flowId: number): ProcedureStep[] => {
  return mockProcedureSteps.filter((step) => step.flowId === flowId);
};

export const getMockProcedureProgressByUserId = (userId: number): ProcedureProgress[] => {
  return mockProcedureProgress.filter((progress) => progress.userId === userId);
};


