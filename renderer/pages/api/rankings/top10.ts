import type { NextApiRequest, NextApiResponse } from 'next';

export interface RankingItem {
  rank: number;
  name: string;
  subName?: string;
  value: number;
  change: number; // 변동률 (%)
  changeType: 'up' | 'down' | 'same';
}

export interface Top10Response {
  regions: RankingItem[];      // TOP 10 상승 지역
  apartments: RankingItem[];   // TOP 10 인기 아파트
  transactions: RankingItem[]; // TOP 10 거래량
  updatedAt: string;
}

// 샘플 데이터 (실제로는 공공데이터 API에서 계산)
const sampleData: Top10Response = {
  regions: [
    { rank: 1, name: '서울 마포구', value: 125000, change: 3.2, changeType: 'up' },
    { rank: 2, name: '서울 용산구', value: 189000, change: 2.8, changeType: 'up' },
    { rank: 3, name: '서울 성동구', value: 142000, change: 2.5, changeType: 'up' },
    { rank: 4, name: '서울 강남구', value: 245000, change: 2.1, changeType: 'up' },
    { rank: 5, name: '서울 서초구', value: 228000, change: 1.9, changeType: 'up' },
    { rank: 6, name: '경기 성남시', value: 156000, change: 1.7, changeType: 'up' },
    { rank: 7, name: '서울 송파구', value: 198000, change: 1.5, changeType: 'up' },
    { rank: 8, name: '경기 과천시', value: 178000, change: 1.3, changeType: 'up' },
    { rank: 9, name: '서울 영등포구', value: 118000, change: 1.1, changeType: 'up' },
    { rank: 10, name: '서울 동작구', value: 132000, change: 0.9, changeType: 'up' },
  ],
  apartments: [
    { rank: 1, name: '래미안 원베일리', subName: '서울 서초구', value: 425000, change: 4.5, changeType: 'up' },
    { rank: 2, name: '아크로리버파크', subName: '서울 서초구', value: 480000, change: 3.8, changeType: 'up' },
    { rank: 3, name: '반포자이', subName: '서울 서초구', value: 385000, change: 3.2, changeType: 'up' },
    { rank: 4, name: '래미안 퍼스티지', subName: '서울 서초구', value: 320000, change: 2.9, changeType: 'up' },
    { rank: 5, name: '잠실엘스', subName: '서울 송파구', value: 285000, change: 2.5, changeType: 'up' },
    { rank: 6, name: '잠실리센츠', subName: '서울 송파구', value: 265000, change: 2.2, changeType: 'up' },
    { rank: 7, name: '헬리오시티', subName: '서울 송파구', value: 198000, change: 1.8, changeType: 'up' },
    { rank: 8, name: '래미안 대치팰리스', subName: '서울 강남구', value: 358000, change: 1.5, changeType: 'up' },
    { rank: 9, name: '도곡렉슬', subName: '서울 강남구', value: 312000, change: 1.2, changeType: 'up' },
    { rank: 10, name: '마포래미안푸르지오', subName: '서울 마포구', value: 178000, change: 0.8, changeType: 'up' },
  ],
  transactions: [
    { rank: 1, name: '헬리오시티', subName: '서울 송파구', value: 156, change: 12.5, changeType: 'up' },
    { rank: 2, name: '잠실엘스', subName: '서울 송파구', value: 89, change: 8.2, changeType: 'up' },
    { rank: 3, name: '둔촌주공', subName: '서울 강동구', value: 78, change: 15.3, changeType: 'up' },
    { rank: 4, name: '래미안 원베일리', subName: '서울 서초구', value: 65, change: 5.1, changeType: 'up' },
    { rank: 5, name: '잠실리센츠', subName: '서울 송파구', value: 58, change: -2.3, changeType: 'down' },
    { rank: 6, name: '마포래미안푸르지오', subName: '서울 마포구', value: 52, change: 3.8, changeType: 'up' },
    { rank: 7, name: '반포자이', subName: '서울 서초구', value: 48, change: 0, changeType: 'same' },
    { rank: 8, name: '래미안 퍼스티지', subName: '서울 서초구', value: 45, change: -1.5, changeType: 'down' },
    { rank: 9, name: '아크로리버파크', subName: '서울 서초구', value: 42, change: 6.2, changeType: 'up' },
    { rank: 10, name: '도곡렉슬', subName: '서울 강남구', value: 38, change: 2.1, changeType: 'up' },
  ],
  updatedAt: new Date().toISOString(),
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Top10Response>
) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  // TODO: 실제 공공데이터 API 연동 시 계산 로직 추가
  // 현재는 샘플 데이터 반환
  res.status(200).json(sampleData);
}
