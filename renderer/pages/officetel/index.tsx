import React from 'react';
import Head from 'next/head';
import { Building, Construction } from 'lucide-react';
import { MainLayout } from '../../components/Layout';
import { RegionSelector } from '../../components/RegionSelector';

export default function OfficetelPage() {
  return (
    <MainLayout title="오피스텔 분석">
      <Head>
        <title>오피스텔 분석 - REPS Clone</title>
      </Head>

      {/* 검색 조건 */}
      <RegionSelector className="mb-6" />

      {/* 개발 중 안내 */}
      <div className="flex flex-col items-center justify-center rounded-lg bg-slate-50 py-16">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
          <Construction className="h-8 w-8 text-purple-600" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-slate-800">개발 진행 중</h3>
        <p className="text-sm text-slate-500">
          오피스텔 분석 기능은 곧 출시될 예정입니다.
        </p>
        <p className="mt-2 text-xs text-slate-400">
          국토교통부 오피스텔 실거래가 API 연동 예정
        </p>
      </div>

      {/* 예정 기능 안내 */}
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
            <Building className="h-5 w-5 text-purple-600" />
          </div>
          <h4 className="font-medium text-slate-800">매매 실거래가</h4>
          <p className="mt-1 text-sm text-slate-500">
            오피스텔 매매 거래 내역 조회
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
            <Building className="h-5 w-5 text-purple-600" />
          </div>
          <h4 className="font-medium text-slate-800">전월세 시세</h4>
          <p className="mt-1 text-sm text-slate-500">
            오피스텔 전월세 거래 내역 조회
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
            <Building className="h-5 w-5 text-purple-600" />
          </div>
          <h4 className="font-medium text-slate-800">시세 추이</h4>
          <p className="mt-1 text-sm text-slate-500">
            기간별 시세 변동 차트 분석
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
