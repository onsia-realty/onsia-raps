import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { Top10Response } from '../pages/api/rankings/top10';

export function useTop10Rankings() {
  return useQuery<Top10Response>({
    queryKey: ['rankings', 'top10'],
    queryFn: async () => {
      const { data } = await axios.get<Top10Response>('/api/rankings/top10');
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5분 캐시
    refetchInterval: 1000 * 60 * 10, // 10분마다 자동 갱신
  });
}
