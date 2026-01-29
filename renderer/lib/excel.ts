import * as XLSX from 'xlsx';

// 엑셀 다운로드 유틸리티

interface ExcelColumn {
  header: string;
  key: string;
  width?: number;
}

interface ExcelOptions {
  fileName: string;
  sheetName?: string;
  columns: ExcelColumn[];
}

// 데이터를 엑셀 파일로 다운로드
export function downloadExcel<T extends Record<string, unknown>>(
  data: T[],
  options: ExcelOptions
): void {
  const { fileName, sheetName = 'Sheet1', columns } = options;

  // 데이터를 엑셀 형식으로 변환
  const excelData = data.map((item) => {
    const row: Record<string, unknown> = {};
    columns.forEach((col) => {
      row[col.header] = item[col.key];
    });
    return row;
  });

  // 워크시트 생성
  const worksheet = XLSX.utils.json_to_sheet(excelData);

  // 컬럼 너비 설정
  const colWidths = columns.map((col) => ({
    wch: col.width || 15,
  }));
  worksheet['!cols'] = colWidths;

  // 워크북 생성
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // 파일 다운로드
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}

// 아파트 실거래가 데이터 엑셀 컬럼 정의
export const apartmentTradeColumns: ExcelColumn[] = [
  { header: '아파트명', key: '아파트', width: 20 },
  { header: '법정동', key: '법정동', width: 15 },
  { header: '거래금액(만원)', key: '거래금액', width: 15 },
  { header: '전용면적(㎡)', key: '전용면적', width: 12 },
  { header: '층', key: '층', width: 5 },
  { header: '건축년도', key: '건축년도', width: 10 },
  { header: '거래년', key: '년', width: 8 },
  { header: '거래월', key: '월', width: 8 },
  { header: '거래일', key: '일', width: 8 },
  { header: '도로명', key: '도로명', width: 25 },
];

// 아파트 전월세 데이터 엑셀 컬럼 정의
export const apartmentRentColumns: ExcelColumn[] = [
  { header: '아파트명', key: '아파트', width: 20 },
  { header: '법정동', key: '법정동', width: 15 },
  { header: '계약구분', key: '계약구분', width: 10 },
  { header: '보증금(만원)', key: '보증금액', width: 15 },
  { header: '월세(만원)', key: '월세금액', width: 12 },
  { header: '전용면적(㎡)', key: '전용면적', width: 12 },
  { header: '층', key: '층', width: 5 },
  { header: '건축년도', key: '건축년도', width: 10 },
  { header: '계약년', key: '년', width: 8 },
  { header: '계약월', key: '월', width: 8 },
  { header: '계약일', key: '일', width: 8 },
];

// 날짜 포맷 (엑셀용)
export function formatDateForExcel(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}
