'use client';

import { useState, useEffect } from 'react';
import { ProcedureStepWithProgress } from '@/lib/types';

interface StepActionsProps {
  step: ProcedureStepWithProgress;
  onStart: () => void;
  onComplete: () => void;
  isStarting: boolean;
  isCompleting: boolean;
}

export function StepActions({ step, onStart, onComplete, isStarting, isCompleting }: StepActionsProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'credit' | 'bank' | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [localStatus, setLocalStatus] = useState<'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | null>(null);

  // ローカル状態とサーバー状態の統合
  const currentStatus = localStatus || step.progressStatus || 'NOT_STARTED';

  // ファイルアップロードが必要なステップかどうか
  const isFileUploadStep = step.name.includes('願書') || 
                           step.name.includes('提出') || 
                           step.name.includes('申請書');

  // 決済が必要なステップかどうか
  const isPaymentStep = step.name.includes('納付') || 
                       step.name.includes('支払い') || 
                       step.name.includes('検定料') || 
                       step.name.includes('入学金');

  // デバッグ用
  useEffect(() => {
    console.log('StepActions Render:', {
      stepName: step.name,
      progressStatus: step.progressStatus,
      currentStatus,
      canStart: step.canStart,
      isFileUploadStep,
      isPaymentStep,
      localStatus,
    });
  }, [step.name, step.progressStatus, currentStatus, step.canStart, isFileUploadStep, isPaymentStep, localStatus]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-excel', // .xls
        'application/pdf', // .pdf
      ];
      const allowedExtensions = ['.xlsx', '.xls', '.pdf'];
      const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));

      if (allowedTypes.includes(file.type) || allowedExtensions.includes(fileExtension)) {
        setUploadedFile(file);
        console.log('File selected:', file.name, file.type);
      } else {
        alert('Excel (.xlsx, .xls) または PDF (.pdf) 形式のファイルを選択してください。');
        e.target.value = '';
      }
    }
  };

  const handleStart = () => {
    console.log('Starting step:', step.name);
    try {
      // onStartを呼び出し
      onStart();
      // 即座にローカル状態を更新
      setLocalStatus('IN_PROGRESS');
    } catch (error) {
      console.error('Start step error:', error);
      // エラーが発生してもローカル状態を更新（デモ用）
      setLocalStatus('IN_PROGRESS');
    }
  };

  const handleFileUpload = async () => {
    if (!uploadedFile) {
      alert('ファイルを選択してください。');
      return;
    }

    console.log('Uploading file:', uploadedFile.name);
    setIsUploading(true);
    try {
      // ファイルアップロードの処理（実際の実装ではAPIを呼び出す）
      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('stepId', step.id.toString());
      
      // シミュレーション: アップロード成功
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('File upload completed');
      alert('ファイルのアップロードが完了しました。');
      setLocalStatus('COMPLETED');
      onComplete();
    } catch (error) {
      console.error('File upload error:', error);
      alert('ファイルのアップロードに失敗しました。');
    } finally {
      setIsUploading(false);
      setUploadedFile(null);
    }
  };

  const handlePayment = async () => {
    if (!paymentMethod) {
      alert('決済方法を選択してください。');
      return;
    }

    console.log('Processing payment:', paymentMethod);
    setIsProcessing(true);
    try {
      // 決済処理のシミュレーション
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Payment completed');
      alert(`${paymentMethod === 'credit' ? 'クレジットカード' : '銀行振込'}での決済が完了しました。`);
      setLocalStatus('COMPLETED');
      onComplete();
    } catch (error) {
      console.error('Payment error:', error);
      alert('決済処理に失敗しました。');
    } finally {
      setIsProcessing(false);
      setPaymentMethod(null);
    }
  };

  // 未開始状態の場合
  if (currentStatus === 'NOT_STARTED' || currentStatus === undefined || currentStatus === null) {
    // canStartがtrue、またはlocalStatusがnull（まだ開始していない）の場合
    if (step.canStart !== false || localStatus === null) {
      return (
        <button
          onClick={handleStart}
          disabled={isStarting}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
        >
          {isStarting ? '開始中...' : '開始'}
        </button>
      );
    }
  }

  // 進行中状態の場合
  if (currentStatus === 'IN_PROGRESS') {
    if (isFileUploadStep) {
      return (
        <div className="space-y-4 w-full">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              ファイルを選択（Excel または PDF）
            </label>
            <input
              type="file"
              accept=".xlsx,.xls,.pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,application/pdf"
              onChange={handleFileChange}
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            {uploadedFile && (
              <p className="text-sm text-slate-600 mt-2">
                選択されたファイル: {uploadedFile.name}
              </p>
            )}
          </div>
          <button
            onClick={handleFileUpload}
            disabled={!uploadedFile || isUploading}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
          >
            {isUploading ? 'アップロード中...' : 'ファイルをアップロードして完了'}
          </button>
        </div>
      );
    }

    if (isPaymentStep) {
      const amount = step.name.includes('検定料') ? 35000 : step.name.includes('入学金') ? 282000 : 0;
      
      return (
        <div className="space-y-4 w-full">
          <div>
            <p className="text-sm font-bold text-slate-700 mb-3">
              支払い金額: <span className="text-lg text-indigo-600">¥{amount.toLocaleString('ja-JP')}</span>
            </p>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              決済方法を選択
            </label>
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  console.log('Payment method selected: credit');
                  setPaymentMethod('credit');
                }}
                className={`flex-1 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                  paymentMethod === 'credit'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white border-2 border-slate-300 text-slate-700 hover:border-indigo-500'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span>クレジットカード</span>
                </div>
              </button>
              <button
                onClick={() => {
                  console.log('Payment method selected: bank');
                  setPaymentMethod('bank');
                }}
                className={`flex-1 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                  paymentMethod === 'bank'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white border-2 border-slate-300 text-slate-700 hover:border-indigo-500'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span>銀行振込</span>
                </div>
              </button>
            </div>
          </div>
          {paymentMethod && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
              {paymentMethod === 'credit' ? (
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-blue-800">クレジットカード決済</p>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="カード番号"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="有効期限 (MM/YY)"
                        className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-blue-800">銀行振込情報</p>
                  <div className="bg-white p-3 rounded border border-slate-200">
                    <p className="text-xs text-slate-600 mb-1">振込先銀行</p>
                    <p className="text-sm font-bold text-slate-800">サンプル銀行 本店</p>
                    <p className="text-xs text-slate-600 mt-2 mb-1">口座番号</p>
                    <p className="text-sm font-bold text-slate-800">1234567</p>
                    <p className="text-xs text-slate-600 mt-2 mb-1">口座名義</p>
                    <p className="text-sm font-bold text-slate-800">サンプル大学</p>
                  </div>
                  <p className="text-xs text-slate-500">
                    ※ 振込手数料はお客様負担となります。
                  </p>
                </div>
              )}
            </div>
          )}
          <button
            onClick={handlePayment}
            disabled={!paymentMethod || isProcessing}
            className="w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
          >
            {isProcessing ? '決済処理中...' : `${paymentMethod === 'credit' ? 'クレジットカードで' : '銀行振込で'}決済して完了`}
          </button>
        </div>
      );
    }

    // その他のステップ
    return (
      <button
        onClick={onComplete}
        disabled={isCompleting}
        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
      >
        完了
      </button>
    );
  }

  // 完了状態の場合
  if (currentStatus === 'COMPLETED') {
    return (
      <div className="flex items-center space-x-2">
        <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span className="text-sm text-emerald-600 font-semibold">完了済み</span>
      </div>
    );
  }

  return null;
}
