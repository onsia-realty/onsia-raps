import React, { useEffect, useState } from 'react';
import { Map, MapMarker, CustomOverlayMap, useKakaoLoader } from 'react-kakao-maps-sdk';
import { cn } from '../../lib/cn';

export interface MapMarkerData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  price?: number;
  priceText?: string;
  dong?: string;
  info?: string;
}

interface KakaoMapProps {
  center?: { lat: number; lng: number };
  level?: number;
  markers?: MapMarkerData[];
  selectedMarkerId?: string;
  onMarkerClick?: (marker: MapMarkerData) => void;
  className?: string;
  showPriceOverlay?: boolean;
}

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

export function KakaoMap({
  center = { lat: 37.5665, lng: 126.978 }, // 서울 시청 기본값
  level = 5,
  markers = [],
  selectedMarkerId,
  onMarkerClick,
  className,
  showPriceOverlay = true,
}: KakaoMapProps) {
  const [loading, error] = useKakaoLoader({
    appkey: process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY || '',
  });

  const [mapCenter, setMapCenter] = useState(center);
  const [mapLevel, setMapLevel] = useState(level);

  useEffect(() => {
    setMapCenter(center);
  }, [center]);

  useEffect(() => {
    setMapLevel(level);
  }, [level]);

  if (loading) {
    return (
      <div className={cn('flex items-center justify-center bg-slate-100', className)}>
        <div className="text-slate-500">지도를 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn('flex items-center justify-center bg-slate-100', className)}>
        <div className="text-red-500">지도를 불러올 수 없습니다.</div>
      </div>
    );
  }

  return (
    <Map
      center={mapCenter}
      level={mapLevel}
      className={cn('w-full h-full', className)}
      onCenterChanged={(map) => {
        const latlng = map.getCenter();
        setMapCenter({ lat: latlng.getLat(), lng: latlng.getLng() });
      }}
      onZoomChanged={(map) => {
        setMapLevel(map.getLevel());
      }}
    >
      {markers.map((marker) => {
        const isSelected = marker.id === selectedMarkerId;

        return (
          <React.Fragment key={marker.id}>
            {/* 마커 */}
            <MapMarker
              position={{ lat: marker.lat, lng: marker.lng }}
              onClick={() => onMarkerClick?.(marker)}
              image={{
                src: isSelected
                  ? 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png'
                  : 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png',
                size: { width: isSelected ? 32 : 24, height: isSelected ? 40 : 35 },
              }}
            />

            {/* 가격 오버레이 */}
            {showPriceOverlay && marker.price && (
              <CustomOverlayMap
                position={{ lat: marker.lat, lng: marker.lng }}
                yAnchor={2.2}
              >
                <div
                  className={cn(
                    'px-2 py-1 rounded-lg text-xs font-bold shadow-lg cursor-pointer transition-all',
                    isSelected
                      ? 'bg-blue-600 text-white scale-110'
                      : 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-50'
                  )}
                  onClick={() => onMarkerClick?.(marker)}
                >
                  {marker.priceText || formatPrice(marker.price)}
                </div>
              </CustomOverlayMap>
            )}

            {/* 선택된 마커 정보창 */}
            {isSelected && (
              <CustomOverlayMap
                position={{ lat: marker.lat, lng: marker.lng }}
                yAnchor={1.4}
              >
                <div className="bg-white rounded-lg shadow-xl border border-slate-200 p-3 min-w-[200px]">
                  <div className="font-bold text-slate-800">{marker.name}</div>
                  {marker.dong && (
                    <div className="text-xs text-slate-500 mt-0.5">{marker.dong}</div>
                  )}
                  {marker.price && (
                    <div className="text-lg font-bold text-blue-600 mt-1">
                      {marker.priceText || formatPrice(marker.price)}
                    </div>
                  )}
                  {marker.info && (
                    <div className="text-xs text-slate-600 mt-1">{marker.info}</div>
                  )}
                </div>
              </CustomOverlayMap>
            )}
          </React.Fragment>
        );
      })}
    </Map>
  );
}
