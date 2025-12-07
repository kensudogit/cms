'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import apiClient from '@/lib/api';
import { University, ContentRequest } from '@/lib/types';

// サンプルコンテンツのテンプレート
const sampleContents = [
  {
    title: '入学手続きガイド',
    slug: 'admission-guide',
    contentType: '入学手続き',
    body: `# 入学手続きガイド

## はじめに

本学への入学を希望される皆様へ、入学手続きの流れをご案内いたします。

## 手続きの流れ

### 1. 入学願書の提出
入学願書を所定の期間内に提出してください。

### 2. 入学検定料の納付
入学検定料を指定の方法で納付してください。

### 3. 入学許可通知の受領
合格通知を受け取ったら、入学手続きを進めてください。

### 4. 入学金の納付
入学金を指定の期日までに納付してください。

## お問い合わせ

不明な点がございましたら、入学事務局までお問い合わせください。`,
    status: 'PUBLISHED' as const,
    metaDescription: '入学手続きの詳細なガイドです。手続きの流れや必要な書類についてご案内します。',
    metaKeywords: '入学手続き,ガイド,新入生',
  },
  {
    title: '新入生向けオリエンテーションについて',
    slug: 'orientation-information',
    contentType: 'お知らせ',
    body: `# 新入生向けオリエンテーションについて

## 開催日時

2024年4月1日（月）10:00～16:00

## 開催場所

本学 大講堂

## 内容

- 学長挨拶
- 学部紹介
- 学生生活について
- キャンパスツアー
- 各種手続き説明

## 持ち物

- 学生証
- 筆記用具
- ノート

## 注意事項

- 遅刻・欠席の場合は事前にご連絡ください
- 昼食は各自でご用意ください

皆様のご参加をお待ちしております。`,
    status: 'PUBLISHED' as const,
    metaDescription: '新入生向けオリエンテーションの詳細情報です。',
    metaKeywords: 'オリエンテーション,新入生,お知らせ',
  },
  {
    title: 'よくある質問（FAQ）',
    slug: 'faq',
    contentType: 'FAQ',
    body: `# よくある質問（FAQ）

## 入学手続きについて

### Q1: 入学金の納付期限はいつですか？
A: 入学金の納付期限は合格通知に記載されています。通常、合格通知受領後2週間以内です。

### Q2: 入学金の支払い方法を教えてください
A: 銀行振込またはクレジットカードでのお支払いが可能です。詳細は入学事務局までお問い合わせください。

### Q3: 入学手続きに必要な書類は何ですか？
A: 以下の書類が必要です：
- 入学許可証
- 入学金納付証明書
- 健康診断書
- 写真（3枚）

## 学生生活について

### Q4: 学生証はいつ発行されますか？
A: 入学手続き完了後、1週間程度で発行されます。

### Q5: 図書館の利用方法を教えてください
A: 学生証を提示することで図書館を利用できます。詳細は図書館事務室までお問い合わせください。

## お問い合わせ

その他のご質問は、入学事務局までお問い合わせください。`,
    status: 'PUBLISHED' as const,
    metaDescription: '入学手続きや学生生活に関するよくある質問と回答です。',
    metaKeywords: 'FAQ,よくある質問,入学手続き',
  },
  {
    title: '卒業手続きガイド',
    slug: 'graduation-guide',
    contentType: '卒業手続き',
    body: `# 卒業手続きガイド

## はじめに

卒業を控えた皆様へ、卒業手続きの流れをご案内いたします。

## 手続きの流れ

### 1. 卒業要件の確認
所定の単位を取得しているか確認してください。

### 2. 卒業論文の提出
卒業論文を指定の期日までに提出してください。

### 3. 卒業手続き書類の提出
卒業手続きに必要な書類を提出してください。

### 4. 卒業式への参加
卒業式に参加し、学位記を受け取ります。

## 必要な書類

- 卒業手続き申請書
- 成績証明書
- 卒業論文
- 写真（卒業アルバム用）

## お問い合わせ

不明な点がございましたら、教務事務局までお問い合わせください。`,
    status: 'PUBLISHED' as const,
    metaDescription: '卒業手続きの詳細なガイドです。',
    metaKeywords: '卒業手続き,ガイド,卒業生',
  },
  {
    title: '学費納付について',
    slug: 'tuition-payment',
    contentType: 'お知らせ',
    body: `# 学費納付について

## 納付期限

前期分：4月30日まで
後期分：10月31日まで

## 納付方法

### 銀行振込
指定の銀行口座へ振込をお願いします。

### クレジットカード
オンラインシステムからクレジットカードでのお支払いが可能です。

### 分割納付
経済的な理由により分割納付を希望される場合は、事前に事務局までご相談ください。

## 注意事項

- 納付期限を過ぎた場合は、延滞金が発生する場合があります
- 納付確認書は必ず保管してください
- 納付に関するお問い合わせは、学生事務局までご連絡ください

## お問い合わせ

学費納付に関するご質問は、学生事務局までお問い合わせください。`,
    status: 'PUBLISHED' as const,
    metaDescription: '学費納付の方法と期限についてご案内します。',
    metaKeywords: '学費,納付,お知らせ',
  },
];

export default function CreateSampleContentsPage() {
  const router = useRouter();
  const userId = useAuthStore((state) => state.userId);
  const [isCreating, setIsCreating] = useState(false);
  const [createdCount, setCreatedCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const { data: universities, isLoading } = useQuery<University[]>({
    queryKey: ['universities'],
    queryFn: async () => {
      const response = await apiClient.get<University[]>('/api/university/active');
      return response.data;
    },
  });

  const createSampleContents = async () => {
    if (!universities || universities.length === 0) {
      setError('大学が登録されていません。先に大学を登録してください。');
      return;
    }

    setIsCreating(true);
    setError(null);
    setCreatedCount(0);

    try {
      let totalCreated = 0;

      for (const university of universities) {
        for (const contentTemplate of sampleContents) {
          try {
            const contentData: ContentRequest = {
              title: `${university.name} - ${contentTemplate.title}`,
              slug: `${university.code}-${contentTemplate.slug}`,
              body: contentTemplate.body.replace(/本学/g, university.name),
              status: contentTemplate.status,
              universityId: university.id,
              contentType: contentTemplate.contentType,
              metaDescription: contentTemplate.metaDescription,
              metaKeywords: contentTemplate.metaKeywords,
            };

            await apiClient.post('/api/content', contentData, {
              headers: {
                'X-User-Id': userId?.toString() || '1',
              },
            });

            totalCreated++;
            setCreatedCount(totalCreated);
          } catch (err: any) {
            console.error(`コンテンツ作成エラー (${university.name} - ${contentTemplate.title}):`, err);
            // エラーが発生しても続行
          }
        }
      }

      // 成功メッセージを表示
      alert(`${totalCreated}件のサンプルコンテンツを作成しました！`);
      router.push('/dashboard');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || 'エラーが発生しました';
      setError(errorMessage);
      console.error('サンプルコンテンツ作成エラー:', err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <nav className="glass-effect border-b border-white/30 shadow-xl sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="group w-12 h-12 bg-gradient-to-br from-white to-slate-50 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-white/50"
              >
                <svg className="w-6 h-6 text-slate-600 group-hover:text-indigo-600 transform group-hover:-translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold gradient-text bg-clip-text">サンプルコンテンツ作成</h1>
                <p className="text-xs text-slate-500 font-medium">Create Sample Contents</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative max-w-4xl mx-auto py-8 sm:px-6 lg:px-8 animate-fade-in">
        <div className="px-4 py-6 sm:px-0">
          <div className="glass-card shadow-2xl rounded-3xl p-8 border border-white/50">
            {isLoading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600"></div>
                <p className="mt-6 text-slate-600 font-medium">読み込み中...</p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-slate-800 mb-4">サンプルコンテンツについて</h2>
                  <p className="text-slate-600 mb-4">
                    各大学に対して、以下のサンプルコンテンツを作成します：
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-slate-600 mb-6">
                    <li>入学手続きガイド</li>
                    <li>新入生向けオリエンテーションについて</li>
                    <li>よくある質問（FAQ）</li>
                    <li>卒業手続きガイド</li>
                    <li>学費納付について</li>
                  </ul>
                  {universities && universities.length > 0 ? (
                    <div className="bg-indigo-50 rounded-xl p-4 mb-6">
                      <p className="text-sm font-semibold text-indigo-800 mb-2">
                        対象大学: {universities.length}校
                      </p>
                      <p className="text-sm text-indigo-700">
                        合計 {universities.length * sampleContents.length}件のコンテンツを作成します
                      </p>
                    </div>
                  ) : (
                    <div className="bg-red-50 rounded-xl p-4 mb-6">
                      <p className="text-sm font-semibold text-red-800">
                        大学が登録されていません。先に大学を登録してください。
                      </p>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="mb-6 bg-gradient-to-r from-red-50 via-pink-50 to-rose-50 border-l-4 border-red-500 text-red-700 px-5 py-4 rounded-xl shadow-lg animate-slide-up backdrop-blur-sm">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="font-semibold">{error}</p>
                    </div>
                  </div>
                )}

                {isCreating && (
                  <div className="mb-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-l-4 border-blue-500 text-blue-700 px-5 py-4 rounded-xl shadow-lg animate-slide-up backdrop-blur-sm">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <svg className="animate-spin h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold">サンプルコンテンツを作成中...</p>
                        <p className="text-sm mt-1">{createdCount}件作成済み</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-4 pt-8 border-t border-slate-200/50">
                  <button
                    type="button"
                    onClick={() => router.push('/dashboard')}
                    disabled={isCreating}
                    className="group px-6 py-3 border-2 border-slate-300 rounded-xl shadow-md text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-400 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>キャンセル</span>
                  </button>
                  <button
                    type="button"
                    onClick={createSampleContents}
                    disabled={isCreating || !universities || universities.length === 0}
                    className="group relative px-8 py-3.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-xl text-sm font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2 overflow-hidden glow-effect"
                  >
                    <span className="relative z-10 flex items-center space-x-2">
                      {isCreating ? (
                        <>
                          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>作成中...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>サンプルコンテンツを作成</span>
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

