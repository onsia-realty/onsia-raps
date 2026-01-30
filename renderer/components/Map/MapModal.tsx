import React, { useEffect } from 'react';
import { X, ZoomIn, ZoomOut, Navigation, Maximize2 } from 'lucide-react';
import { KakaoMap, MapMarkerData } from './KakaoMap';
import { cn } from '../../lib/cn';

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  center?: { lat: number; lng: number };
  level?: number;
  markers?: MapMarkerData[];
  selectedMarkerId?: string;
  onMarkerClick?: (marker: MapMarkerData) => void;
}

export function MapModal({
  isOpen,
  onClose,
  title = '지도',
  center,
  level = 4,
  markers = [],
  selectedMarkerId,
  onMarkerClick,
}: MapModalProps) {
  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 모달 컨테이너 */}
      <div className="relative z-10 w-full max-w-4xl h-[80vh] mx-4 bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <Navigation size={18} className="text-blue-600" />
            <h2 className="font-semibold text-slate-800">{title}</h2>
            {markers.length > 0 && (
              <span className="text-sm text-slate-500">
                ({markers.length}개 단지)
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* 지도 영역 */}
        <div className="flex-1 relative">
          <KakaoMap
            center={center}
            level={level}
            markers={markers}
            selectedMarkerId={selectedMarkerId}
            onMarkerClick={onMarkerClick}
            className="w-full h-full"
          />

          {/* 선택된 단지 정보 패널 */}
          {selectedMarkerId && markers.length > 0 && (
            <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg border border-slate-200 p-4">
              {(() => {
                const selected = markers.find((m) => m.id === selectedMarkerId);
                if (!selected) return null;
                return (
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-800">{selected.name}</div>
                      {selected.dong && (
                        <div className="text-sm text-slate-500">{selected.dong}</div>
                      )}
                    </div>
                    {selected.price && (
                      <div className="text-xl font-bold text-blue-600">
                        {selected.priceText}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* 범례/설명 */}
        <div className="px-4 py-2 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-blue-600" />
              <span>선택된 단지</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span>아파트 단지</span>
            </div>
            <div className="ml-auto text-slate-400">
              마커를 클릭하면 상세 정보를 볼 수 있습니다
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
