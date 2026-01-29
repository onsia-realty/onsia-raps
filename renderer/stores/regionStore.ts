import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { RegionCode, SIDO_CODES, SEOUL_GUGUN_CODES } from '../lib/publicApi';

interface RegionState {
  // 선택된 지역
  selectedSido: RegionCode | null;
  selectedGugun: RegionCode | null;
  selectedDong: RegionCode | null;

  // 선택 기간
  startYear: number;
  startMonth: number;
  endYear: number;
  endMonth: number;

  // 구군 목록 (시도 선택 시 업데이트)
  gugunList: RegionCode[];
  dongList: RegionCode[];

  // 액션
  setSido: (sido: RegionCode | null) => void;
  setGugun: (gugun: RegionCode | null) => void;
  setDong: (dong: RegionCode | null) => void;
  setDateRange: (startYear: number, startMonth: number, endYear: number, endMonth: number) => void;
  setGugunList: (list: RegionCode[]) => void;
  setDongList: (list: RegionCode[]) => void;
  reset: () => void;
}

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;

const initialState = {
  selectedSido: null,
  selectedGugun: null,
  selectedDong: null,
  startYear: currentYear,
  startMonth: currentMonth,
  endYear: currentYear,
  endMonth: currentMonth,
  gugunList: [],
  dongList: [],
};

export const useRegionStore = create<RegionState>()(
  persist(
    (set) => ({
      ...initialState,

      setSido: (sido) => {
        set({
          selectedSido: sido,
          selectedGugun: null,
          selectedDong: null,
          dongList: [],
          // 서울시인 경우 구군 목록 설정 (임시 - 나중에 API로 대체)
          gugunList: sido?.code === '11' ? SEOUL_GUGUN_CODES : [],
        });
      },

      setGugun: (gugun) => {
        set({ selectedGugun: gugun, selectedDong: null, dongList: [] });
      },

      setDong: (dong) => {
        set({ selectedDong: dong });
      },

      setDateRange: (startYear, startMonth, endYear, endMonth) => {
        set({ startYear, startMonth, endYear, endMonth });
      },

      setGugunList: (list) => {
        set({ gugunList: list });
      },

      setDongList: (list) => {
        set({ dongList: list });
      },

      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'region-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        selectedSido: state.selectedSido,
        selectedGugun: state.selectedGugun,
        startYear: state.startYear,
        startMonth: state.startMonth,
        endYear: state.endYear,
        endMonth: state.endMonth,
      }),
    }
  )
);

// 시도 목록 가져오기
export const getSidoList = (): RegionCode[] => SIDO_CODES;
