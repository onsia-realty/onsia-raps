import React, { useState } from 'react';
import Head from 'next/head';
import { Key, Database, Info, Save } from 'lucide-react';
import { MainLayout } from '../components/Layout';
import { useUIStore } from '../stores/uiStore';

export default function SettingsPage() {
  const { showNotification } = useUIStore();
  const [apiKey, setApiKey] = useState('');

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      showNotification('warning', 'API 키를 입력해주세요.');
      return;
    }
    // 실제로는 환경변수나 안전한 저장소에 저장해야 함
    localStorage.setItem('PUBLIC_DATA_API_KEY', apiKey);
    showNotification('success', 'API 키가 저장되었습니다.');
  };

  return (
    <MainLayout title="설정">
      <Head>
        <title>설정 - REPS Clone</title>
      </Head>

      <div className="max-w-2xl space-y-6">
        {/* API 키 설정 */}
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <Key className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">공공데이터 API 키</h3>
              <p className="text-sm text-slate-500">
                data.go.kr에서 발급받은 API 키를 입력하세요
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="API 키 입력"
              className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              onClick={handleSaveApiKey}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Save size={16} />
              저장
            </button>
          </div>
          <div className="mt-4 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
            <Info size={14} className="mb-1 inline" /> API 키가 없어도 샘플 데이터로 테스트할 수 있습니다.
          </div>
        </div>

        {/* 데이터 관리 */}
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
              <Database className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">데이터 관리</h3>
              <p className="text-sm text-slate-500">캐시 및 저장된 데이터 관리</p>
            </div>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => {
                localStorage.clear();
                showNotification('success', '캐시가 삭제되었습니다.');
              }}
              className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              캐시 삭제
            </button>
          </div>
        </div>

        {/* 정보 */}
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
              <Info className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">애플리케이션 정보</h3>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-600">버전</span>
              <span className="text-slate-800">0.1.0</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-600">플랫폼</span>
              <span className="text-slate-800">Electron + Next.js</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-600">데이터 출처</span>
              <span className="text-slate-800">국토교통부 공공데이터</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-600">라이선스</span>
              <span className="text-slate-800">MIT</span>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
