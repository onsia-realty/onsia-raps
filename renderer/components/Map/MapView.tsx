import React, { useState, useMemo } from 'react';
import { List, Map as MapIcon, Maximize2 } from 'lucide-react';
import { KakaoMap, MapMarkerData } from './KakaoMap';
import { MapModal } from './MapModal';
import { cn } from '../../lib/cn';

interface ComplexData {
  id: string;
  name: string;
  dong: string;
  tradePrice?: number;
  tradePriceText?: string;
  lat?: number;
  lng?: number;
}

interface MapViewProps {
  complexes: ComplexData[];
  regionName?: string;
  className?: string;
  onComplexSelect?: (complex: ComplexData) => void;
}

// 서울 주요 지역 좌표 (기본값용)
const REGION_CENTERS: Record<string, { lat: number; lng: number }> = {
  강남구: { lat: 37.5172, lng: 127.0473 },
  서초구: { lat: 37.4837, lng: 127.0324 },
  송파구: { lat: 37.5145, lng: 127.1059 },
  강동구: { lat: 37.5301, lng: 127.1238 },
  마포구: { lat: 37.5663, lng: 126.9014 },
  용산구: { lat: 37.5326, lng: 126.9909 },
  성동구: { lat: 37.5633, lng: 127.0371 },
  광진구: { lat: 37.5385, lng: 127.0823 },
  동작구: { lat: 37.5124, lng: 126.9393 },
  영등포구: { lat: 37.5264, lng: 126.8963 },
  default: { lat: 37.5665, lng: 126.978 }, // 서울 시청
};

// 금액 포맷팅
function formatPrice(price: number): string {
  if (price >= 10000) {
    const eok = Math.floor(price / 10000);
    const man = price % 10000;
    if (man === 0) return `${eok}억`;
    return `${eok}.${Math.floor(man / 1000)}억`;
  }
  return `${(price / 1000).toFixed(1)}천`;
}

// 단지명으로 가상 좌표 생성 (실제로는 주소 → 좌표 변환 API 필요)
function generateCoordinates(
  complex: ComplexData,
  index: number,
  baseCenter: { lat: number; lng: number }
): { lat: number; lng: number } {
  // 이미 좌표가 있으면 그대로 사용
  if (complex.lat && complex.lng) {
    return { lat: complex.lat, lng: complex.lng };
  }

  // 가상 좌표 생성 (실제 서비스에서는 Kakao 주소 → 좌표 API 사용)
  const offsetLat = (Math.random() - 0.5) * 0.02;
  const offsetLng = (Math.random() - 0.5) * 0.02;

  return {
    lat: baseCenter.lat + offsetLat,
    lng: baseCenter.lng + offsetLng,
  };
}

export function MapView({
  complexes,
  regionName = '',
  className,
  onComplexSelect,
}: MapViewProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'map' | 'list'>('split');

  // 지역 중심 좌표
  const regionCenter = useMemo(() => {
    for (const [key, value] of Object.entries(REGION_CENTERS)) {
      if (regionName.includes(key)) {
        return value;
      }
    }
    return REGION_CENTERS.default;
  }, [regionName]);

  // 마커 데이터 생성
  const markers: MapMarkerData[] = useMemo(() => {
    return complexes.map((complex, index) => {
      const coords = generateCoordinates(complex, index, regionCenter);
      return {
        id: complex.id,
        name: complex.name,
        lat: coords.lat,
        lng: coords.lng,
        price: complex.tradePrice,
        priceText: complex.tradePriceText || (complex.tradePrice ? formatPrice(complex.tradePrice) : undefined),
        dong: complex.dong,
        info: `${complex.dong}`,
      };
    });
  }, [complexes, regionCenter]);

  const handleMarkerClick = (marker: MapMarkerData) => {
    setSelectedId(marker.id);
    const complex = complexes.find((c) => c.id === marker.id);
    if (complex) {
      onComplexSelect?.(complex);
    }
  };

  const handleListItemClick = (complex: ComplexData) => {
    setSelectedId(complex.id);
    onComplexSelect?.(complex);
  };

  return (
    <div className={cn('rounded-lg border border-slate-200 bg-white overflow-hidden', className)}>
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center gap-2">
          <MapIcon size={18} className="text-blue-600" />
          <span className="font-medium text-slate-700">
            {regionName || '지역'} 지도
          </span>
          <span className="text-sm text-slate-500">
            ({complexes.length}개 단지)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* 뷰 모드 토글 */}
          <div className="flex items-center rounded-lg border border-slate-200 bg-white p-0.5">
            <button
              onClick={() => setViewMode('split')}
              className={cn(
                'px-2 py-1 rounded text-xs font-medium transition-colors',
                viewMode === 'split'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              )}
            >
              분할
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={cn(
                'px-2 py-1 rounded text-xs font-medium transition-colors',
                viewMode === 'map'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              )}
            >
              지도
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'px-2 py-1 rounded text-xs font-medium transition-colors',
                viewMode === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              )}
            >
              목록
            </button>
          </div>

          {/* 전체화면 버튼 */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            title="전체화면"
          >
            <Maximize2 size={16} className="text-slate-500" />
          </button>
        </div>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="flex h-[500px]">
        {/* 지도 */}
        {(viewMode === 'split' || viewMode === 'map') && (
          <div className={cn(
            'relative',
            viewMode === 'split' ? 'w-2/3' : 'w-full'
          )}>
            <KakaoMap
              center={regionCenter}
              level={5}
              markers={markers}
              selectedMarkerId={selectedId || undefined}
              onMarkerClick={handleMarkerClick}
              className="w-full h-full"
            />
          </div>
        )}

        {/* 목록 */}
        {(viewMode === 'split' || viewMode === 'list') && (
          <div className={cn(
            'border-l border-slate-200 overflow-y-auto',
            viewMode === 'split' ? 'w-1/3' : 'w-full'
          )}>
            <div className="divide-y divide-slate-100">
              {complexes.map((complex) => {
                const isSelected = complex.id === selectedId;
                return (
                  <div
                    key={complex.id}
                    className={cn(
                      'px-4 py-3 cursor-pointer transition-colors',
                      isSelected
                        ? 'bg-blue-50 border-l-2 border-blue-600'
                        : 'hover:bg-slate-50'
                    )}
                    onClick={() => handleListItemClick(complex)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className={cn(
                          'font-medium',
                          isSelected ? 'text-blue-600' : 'text-slate-800'
                        )}>
                          {complex.name}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {complex.dong}
                        </div>
                      </div>
                      {complex.tradePrice && (
                        <div className="text-sm font-bold text-blue-600">
                          {complex.tradePriceText || formatPrice(complex.tradePrice)}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {complexes.length === 0 && (
                <div className="px-4 py-8 text-center text-slate-400">
                  표시할 단지가 없습니다
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 전체화면 모달 */}
      <MapModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${regionName || '지역'} 아파트 지도`}
        center={regionCenter}
        level={4}
        markers={markers}
        selectedMarkerId={selectedId || undefined}
        onMarkerClick={handleMarkerClick}
      />
    </div>
  );
}
