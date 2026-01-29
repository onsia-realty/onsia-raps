import React from 'react';
import Head from 'next/head';
import { FileText, Construction, Calendar, Users, Trophy } from 'lucide-react';
import { MainLayout } from '../../components/Layout';
import { RegionSelector } from '../../components/RegionSelector';

export default function SubscriptionPage() {
  return (
    <MainLayout title="청약 정보">
      <Head>
        <title>청약 정보 - REPS Clone</title>
      </Head>

      {/* 검색 조건 */}
      <RegionSelector showDateRange={false} className="mb-6" />

      {/* 개발 중 안내 */}
      <div className="flex flex-col items-center justify-center rounded-lg bg-slate-50 py-16">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <Construction className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-slate-800">개발 진행 중</h3>
        <p className="text-sm text-slate-500">
          청약 정보 기능은 곧 출시될 예정입니다.
        </p>
        <p className="mt-2 text-xs text-slate-400">
          청약홈 분양정보 API 연동 예정
        </p>
      </div>

      {/* 예정 기능 안내 */}
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
            <Calendar className="h-5 w-5 text-green-600" />
          </div>
          <h4 className="font-medium text-slate-800">분양 일정</h4>
          <p className="mt-1 text-sm text-slate-500">
            아파트 분양 및 청약 일정 조회
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
            <Users className="h-5 w-5 text-green-600" />
          </div>
          <h4 className="font-medium text-slate-800">경쟁률</h4>
          <p className="mt-1 text-sm text-slate-500">
            청약 경쟁률 및 접수 현황
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
            <Trophy className="h-5 w-5 text-green-600" />
          </div>
          <h4 className="font-medium text-slate-800">당첨 정보</h4>
          <p className="mt-1 text-sm text-slate-500">
            당첨자 발표 및 커트라인
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
