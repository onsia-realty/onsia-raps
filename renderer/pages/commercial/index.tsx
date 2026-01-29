import React from 'react';
import Head from 'next/head';
import { Store, Construction } from 'lucide-react';
import { MainLayout } from '../../components/Layout';
import { RegionSelector } from '../../components/RegionSelector';

export default function CommercialPage() {
  return (
    <MainLayout title="상가 분석">
      <Head>
        <title>상가 분석 - REPS Clone</title>
      </Head>

      {/* 검색 조건 */}
      <RegionSelector className="mb-6" />

      {/* 개발 중 안내 */}
      <div className="flex flex-col items-center justify-center rounded-lg bg-slate-50 py-16">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
          <Construction className="h-8 w-8 text-orange-600" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-slate-800">개발 진행 중</h3>
        <p className="text-sm text-slate-500">
          상가 분석 기능은 곧 출시될 예정입니다.
        </p>
        <p className="mt-2 text-xs text-slate-400">
          국토교통부 상업/업무용 실거래가 API 연동 예정
        </p>
      </div>

      {/* 예정 기능 안내 */}
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
            <Store className="h-5 w-5 text-orange-600" />
          </div>
          <h4 className="font-medium text-slate-800">상가 매매</h4>
          <p className="mt-1 text-sm text-slate-500">
            상가/근린시설 매매 거래 내역
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
            <Store className="h-5 w-5 text-orange-600" />
          </div>
          <h4 className="font-medium text-slate-800">상가 임대</h4>
          <p className="mt-1 text-sm text-slate-500">
            상가 임대 거래 내역 조회
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
            <Store className="h-5 w-5 text-orange-600" />
          </div>
          <h4 className="font-medium text-slate-800">수익률 분석</h4>
          <p className="mt-1 text-sm text-slate-500">
            임대 수익률 계산 및 분석
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
