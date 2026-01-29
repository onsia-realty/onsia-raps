/**
 * 전국 시도/시군구 코드
 * 국토교통부 실거래가 API용 법정동코드 (5자리)
 */

export interface RegionCode {
  code: string;
  name: string;
  parentCode?: string;
}

// 시도 코드 목록
export const SIDO_CODES: RegionCode[] = [
  { code: '11', name: '서울특별시' },
  { code: '26', name: '부산광역시' },
  { code: '27', name: '대구광역시' },
  { code: '28', name: '인천광역시' },
  { code: '29', name: '광주광역시' },
  { code: '30', name: '대전광역시' },
  { code: '31', name: '울산광역시' },
  { code: '36', name: '세종특별자치시' },
  { code: '41', name: '경기도' },
  { code: '43', name: '충청북도' },
  { code: '44', name: '충청남도' },
  { code: '46', name: '전라남도' },
  { code: '47', name: '경상북도' },
  { code: '48', name: '경상남도' },
  { code: '50', name: '제주특별자치도' },
  { code: '51', name: '강원특별자치도' },
  { code: '52', name: '전북특별자치도' },
];

// 시군구 코드 목록 (시도별)
export const GUGUN_CODES: Record<string, RegionCode[]> = {
  // 서울특별시
  '11': [
    { code: '11110', name: '종로구', parentCode: '11' },
    { code: '11140', name: '중구', parentCode: '11' },
    { code: '11170', name: '용산구', parentCode: '11' },
    { code: '11200', name: '성동구', parentCode: '11' },
    { code: '11215', name: '광진구', parentCode: '11' },
    { code: '11230', name: '동대문구', parentCode: '11' },
    { code: '11260', name: '중랑구', parentCode: '11' },
    { code: '11290', name: '성북구', parentCode: '11' },
    { code: '11305', name: '강북구', parentCode: '11' },
    { code: '11320', name: '도봉구', parentCode: '11' },
    { code: '11350', name: '노원구', parentCode: '11' },
    { code: '11380', name: '은평구', parentCode: '11' },
    { code: '11410', name: '서대문구', parentCode: '11' },
    { code: '11440', name: '마포구', parentCode: '11' },
    { code: '11470', name: '양천구', parentCode: '11' },
    { code: '11500', name: '강서구', parentCode: '11' },
    { code: '11530', name: '구로구', parentCode: '11' },
    { code: '11545', name: '금천구', parentCode: '11' },
    { code: '11560', name: '영등포구', parentCode: '11' },
    { code: '11590', name: '동작구', parentCode: '11' },
    { code: '11620', name: '관악구', parentCode: '11' },
    { code: '11650', name: '서초구', parentCode: '11' },
    { code: '11680', name: '강남구', parentCode: '11' },
    { code: '11710', name: '송파구', parentCode: '11' },
    { code: '11740', name: '강동구', parentCode: '11' },
  ],

  // 부산광역시
  '26': [
    { code: '26110', name: '중구', parentCode: '26' },
    { code: '26140', name: '서구', parentCode: '26' },
    { code: '26170', name: '동구', parentCode: '26' },
    { code: '26200', name: '영도구', parentCode: '26' },
    { code: '26230', name: '부산진구', parentCode: '26' },
    { code: '26260', name: '동래구', parentCode: '26' },
    { code: '26290', name: '남구', parentCode: '26' },
    { code: '26320', name: '북구', parentCode: '26' },
    { code: '26350', name: '해운대구', parentCode: '26' },
    { code: '26380', name: '사하구', parentCode: '26' },
    { code: '26410', name: '금정구', parentCode: '26' },
    { code: '26440', name: '강서구', parentCode: '26' },
    { code: '26470', name: '연제구', parentCode: '26' },
    { code: '26500', name: '수영구', parentCode: '26' },
    { code: '26530', name: '사상구', parentCode: '26' },
    { code: '26710', name: '기장군', parentCode: '26' },
  ],

  // 대구광역시
  '27': [
    { code: '27110', name: '중구', parentCode: '27' },
    { code: '27140', name: '동구', parentCode: '27' },
    { code: '27170', name: '서구', parentCode: '27' },
    { code: '27200', name: '남구', parentCode: '27' },
    { code: '27230', name: '북구', parentCode: '27' },
    { code: '27260', name: '수성구', parentCode: '27' },
    { code: '27290', name: '달서구', parentCode: '27' },
    { code: '27710', name: '달성군', parentCode: '27' },
    { code: '27720', name: '군위군', parentCode: '27' },
  ],

  // 인천광역시
  '28': [
    { code: '28110', name: '중구', parentCode: '28' },
    { code: '28140', name: '동구', parentCode: '28' },
    { code: '28177', name: '미추홀구', parentCode: '28' },
    { code: '28185', name: '연수구', parentCode: '28' },
    { code: '28200', name: '남동구', parentCode: '28' },
    { code: '28237', name: '부평구', parentCode: '28' },
    { code: '28245', name: '계양구', parentCode: '28' },
    { code: '28260', name: '서구', parentCode: '28' },
    { code: '28710', name: '강화군', parentCode: '28' },
    { code: '28720', name: '옹진군', parentCode: '28' },
  ],

  // 광주광역시
  '29': [
    { code: '29110', name: '동구', parentCode: '29' },
    { code: '29140', name: '서구', parentCode: '29' },
    { code: '29155', name: '남구', parentCode: '29' },
    { code: '29170', name: '북구', parentCode: '29' },
    { code: '29200', name: '광산구', parentCode: '29' },
  ],

  // 대전광역시
  '30': [
    { code: '30110', name: '동구', parentCode: '30' },
    { code: '30140', name: '중구', parentCode: '30' },
    { code: '30170', name: '서구', parentCode: '30' },
    { code: '30200', name: '유성구', parentCode: '30' },
    { code: '30230', name: '대덕구', parentCode: '30' },
  ],

  // 울산광역시
  '31': [
    { code: '31110', name: '중구', parentCode: '31' },
    { code: '31140', name: '남구', parentCode: '31' },
    { code: '31170', name: '동구', parentCode: '31' },
    { code: '31200', name: '북구', parentCode: '31' },
    { code: '31710', name: '울주군', parentCode: '31' },
  ],

  // 세종특별자치시
  '36': [
    { code: '36110', name: '세종시', parentCode: '36' },
  ],

  // 경기도
  '41': [
    { code: '41111', name: '수원시 장안구', parentCode: '41' },
    { code: '41113', name: '수원시 권선구', parentCode: '41' },
    { code: '41115', name: '수원시 팔달구', parentCode: '41' },
    { code: '41117', name: '수원시 영통구', parentCode: '41' },
    { code: '41131', name: '성남시 수정구', parentCode: '41' },
    { code: '41133', name: '성남시 중원구', parentCode: '41' },
    { code: '41135', name: '성남시 분당구', parentCode: '41' },
    { code: '41150', name: '의정부시', parentCode: '41' },
    { code: '41171', name: '안양시 만안구', parentCode: '41' },
    { code: '41173', name: '안양시 동안구', parentCode: '41' },
    { code: '41190', name: '부천시', parentCode: '41' },
    { code: '41210', name: '광명시', parentCode: '41' },
    { code: '41220', name: '평택시', parentCode: '41' },
    { code: '41250', name: '동두천시', parentCode: '41' },
    { code: '41271', name: '안산시 상록구', parentCode: '41' },
    { code: '41273', name: '안산시 단원구', parentCode: '41' },
    { code: '41281', name: '고양시 덕양구', parentCode: '41' },
    { code: '41285', name: '고양시 일산동구', parentCode: '41' },
    { code: '41287', name: '고양시 일산서구', parentCode: '41' },
    { code: '41290', name: '과천시', parentCode: '41' },
    { code: '41310', name: '구리시', parentCode: '41' },
    { code: '41360', name: '남양주시', parentCode: '41' },
    { code: '41370', name: '오산시', parentCode: '41' },
    { code: '41390', name: '시흥시', parentCode: '41' },
    { code: '41410', name: '군포시', parentCode: '41' },
    { code: '41430', name: '의왕시', parentCode: '41' },
    { code: '41450', name: '하남시', parentCode: '41' },
    { code: '41461', name: '용인시 처인구', parentCode: '41' },
    { code: '41463', name: '용인시 기흥구', parentCode: '41' },
    { code: '41465', name: '용인시 수지구', parentCode: '41' },
    { code: '41480', name: '파주시', parentCode: '41' },
    { code: '41500', name: '이천시', parentCode: '41' },
    { code: '41550', name: '안성시', parentCode: '41' },
    { code: '41570', name: '김포시', parentCode: '41' },
    { code: '41590', name: '화성시', parentCode: '41' },
    { code: '41610', name: '광주시', parentCode: '41' },
    { code: '41630', name: '양주시', parentCode: '41' },
    { code: '41650', name: '포천시', parentCode: '41' },
    { code: '41670', name: '여주시', parentCode: '41' },
    { code: '41800', name: '연천군', parentCode: '41' },
    { code: '41820', name: '가평군', parentCode: '41' },
    { code: '41830', name: '양평군', parentCode: '41' },
  ],

  // 충청북도
  '43': [
    { code: '43111', name: '청주시 상당구', parentCode: '43' },
    { code: '43112', name: '청주시 서원구', parentCode: '43' },
    { code: '43113', name: '청주시 흥덕구', parentCode: '43' },
    { code: '43114', name: '청주시 청원구', parentCode: '43' },
    { code: '43130', name: '충주시', parentCode: '43' },
    { code: '43150', name: '제천시', parentCode: '43' },
    { code: '43720', name: '보은군', parentCode: '43' },
    { code: '43730', name: '옥천군', parentCode: '43' },
    { code: '43740', name: '영동군', parentCode: '43' },
    { code: '43745', name: '증평군', parentCode: '43' },
    { code: '43750', name: '진천군', parentCode: '43' },
    { code: '43760', name: '괴산군', parentCode: '43' },
    { code: '43770', name: '음성군', parentCode: '43' },
    { code: '43800', name: '단양군', parentCode: '43' },
  ],

  // 충청남도
  '44': [
    { code: '44131', name: '천안시 동남구', parentCode: '44' },
    { code: '44133', name: '천안시 서북구', parentCode: '44' },
    { code: '44150', name: '공주시', parentCode: '44' },
    { code: '44180', name: '보령시', parentCode: '44' },
    { code: '44200', name: '아산시', parentCode: '44' },
    { code: '44210', name: '서산시', parentCode: '44' },
    { code: '44230', name: '논산시', parentCode: '44' },
    { code: '44250', name: '계룡시', parentCode: '44' },
    { code: '44270', name: '당진시', parentCode: '44' },
    { code: '44710', name: '금산군', parentCode: '44' },
    { code: '44760', name: '부여군', parentCode: '44' },
    { code: '44770', name: '서천군', parentCode: '44' },
    { code: '44790', name: '청양군', parentCode: '44' },
    { code: '44800', name: '홍성군', parentCode: '44' },
    { code: '44810', name: '예산군', parentCode: '44' },
    { code: '44825', name: '태안군', parentCode: '44' },
  ],

  // 전라남도
  '46': [
    { code: '46110', name: '목포시', parentCode: '46' },
    { code: '46130', name: '여수시', parentCode: '46' },
    { code: '46150', name: '순천시', parentCode: '46' },
    { code: '46170', name: '나주시', parentCode: '46' },
    { code: '46230', name: '광양시', parentCode: '46' },
    { code: '46710', name: '담양군', parentCode: '46' },
    { code: '46720', name: '곡성군', parentCode: '46' },
    { code: '46730', name: '구례군', parentCode: '46' },
    { code: '46770', name: '고흥군', parentCode: '46' },
    { code: '46780', name: '보성군', parentCode: '46' },
    { code: '46790', name: '화순군', parentCode: '46' },
    { code: '46800', name: '장흥군', parentCode: '46' },
    { code: '46810', name: '강진군', parentCode: '46' },
    { code: '46820', name: '해남군', parentCode: '46' },
    { code: '46830', name: '영암군', parentCode: '46' },
    { code: '46840', name: '무안군', parentCode: '46' },
    { code: '46860', name: '함평군', parentCode: '46' },
    { code: '46870', name: '영광군', parentCode: '46' },
    { code: '46880', name: '장성군', parentCode: '46' },
    { code: '46890', name: '완도군', parentCode: '46' },
    { code: '46900', name: '진도군', parentCode: '46' },
    { code: '46910', name: '신안군', parentCode: '46' },
  ],

  // 경상북도
  '47': [
    { code: '47111', name: '포항시 남구', parentCode: '47' },
    { code: '47113', name: '포항시 북구', parentCode: '47' },
    { code: '47130', name: '경주시', parentCode: '47' },
    { code: '47150', name: '김천시', parentCode: '47' },
    { code: '47170', name: '안동시', parentCode: '47' },
    { code: '47190', name: '구미시', parentCode: '47' },
    { code: '47210', name: '영주시', parentCode: '47' },
    { code: '47230', name: '영천시', parentCode: '47' },
    { code: '47250', name: '상주시', parentCode: '47' },
    { code: '47280', name: '문경시', parentCode: '47' },
    { code: '47290', name: '경산시', parentCode: '47' },
    { code: '47730', name: '의성군', parentCode: '47' },
    { code: '47750', name: '청송군', parentCode: '47' },
    { code: '47760', name: '영양군', parentCode: '47' },
    { code: '47770', name: '영덕군', parentCode: '47' },
    { code: '47820', name: '청도군', parentCode: '47' },
    { code: '47830', name: '고령군', parentCode: '47' },
    { code: '47840', name: '성주군', parentCode: '47' },
    { code: '47850', name: '칠곡군', parentCode: '47' },
    { code: '47900', name: '예천군', parentCode: '47' },
    { code: '47920', name: '봉화군', parentCode: '47' },
    { code: '47930', name: '울진군', parentCode: '47' },
    { code: '47940', name: '울릉군', parentCode: '47' },
  ],

  // 경상남도
  '48': [
    { code: '48121', name: '창원시 의창구', parentCode: '48' },
    { code: '48123', name: '창원시 성산구', parentCode: '48' },
    { code: '48125', name: '창원시 마산합포구', parentCode: '48' },
    { code: '48127', name: '창원시 마산회원구', parentCode: '48' },
    { code: '48129', name: '창원시 진해구', parentCode: '48' },
    { code: '48170', name: '진주시', parentCode: '48' },
    { code: '48220', name: '통영시', parentCode: '48' },
    { code: '48240', name: '사천시', parentCode: '48' },
    { code: '48250', name: '김해시', parentCode: '48' },
    { code: '48270', name: '밀양시', parentCode: '48' },
    { code: '48310', name: '거제시', parentCode: '48' },
    { code: '48330', name: '양산시', parentCode: '48' },
    { code: '48720', name: '의령군', parentCode: '48' },
    { code: '48730', name: '함안군', parentCode: '48' },
    { code: '48740', name: '창녕군', parentCode: '48' },
    { code: '48820', name: '고성군', parentCode: '48' },
    { code: '48840', name: '남해군', parentCode: '48' },
    { code: '48850', name: '하동군', parentCode: '48' },
    { code: '48860', name: '산청군', parentCode: '48' },
    { code: '48870', name: '함양군', parentCode: '48' },
    { code: '48880', name: '거창군', parentCode: '48' },
    { code: '48890', name: '합천군', parentCode: '48' },
  ],

  // 제주특별자치도
  '50': [
    { code: '50110', name: '제주시', parentCode: '50' },
    { code: '50130', name: '서귀포시', parentCode: '50' },
  ],

  // 강원특별자치도
  '51': [
    { code: '51110', name: '춘천시', parentCode: '51' },
    { code: '51130', name: '원주시', parentCode: '51' },
    { code: '51150', name: '강릉시', parentCode: '51' },
    { code: '51170', name: '동해시', parentCode: '51' },
    { code: '51190', name: '태백시', parentCode: '51' },
    { code: '51210', name: '속초시', parentCode: '51' },
    { code: '51230', name: '삼척시', parentCode: '51' },
    { code: '51720', name: '홍천군', parentCode: '51' },
    { code: '51730', name: '횡성군', parentCode: '51' },
    { code: '51750', name: '영월군', parentCode: '51' },
    { code: '51760', name: '평창군', parentCode: '51' },
    { code: '51770', name: '정선군', parentCode: '51' },
    { code: '51780', name: '철원군', parentCode: '51' },
    { code: '51790', name: '화천군', parentCode: '51' },
    { code: '51800', name: '양구군', parentCode: '51' },
    { code: '51810', name: '인제군', parentCode: '51' },
    { code: '51820', name: '고성군', parentCode: '51' },
    { code: '51830', name: '양양군', parentCode: '51' },
  ],

  // 전북특별자치도
  '52': [
    { code: '52111', name: '전주시 완산구', parentCode: '52' },
    { code: '52113', name: '전주시 덕진구', parentCode: '52' },
    { code: '52130', name: '군산시', parentCode: '52' },
    { code: '52140', name: '익산시', parentCode: '52' },
    { code: '52180', name: '정읍시', parentCode: '52' },
    { code: '52190', name: '남원시', parentCode: '52' },
    { code: '52210', name: '김제시', parentCode: '52' },
    { code: '52710', name: '완주군', parentCode: '52' },
    { code: '52720', name: '진안군', parentCode: '52' },
    { code: '52730', name: '무주군', parentCode: '52' },
    { code: '52740', name: '장수군', parentCode: '52' },
    { code: '52750', name: '임실군', parentCode: '52' },
    { code: '52770', name: '순창군', parentCode: '52' },
    { code: '52790', name: '고창군', parentCode: '52' },
    { code: '52800', name: '부안군', parentCode: '52' },
  ],
};

/**
 * 시도 코드로 시군구 목록 가져오기
 */
export function getGugunBySido(sidoCode: string): RegionCode[] {
  return GUGUN_CODES[sidoCode] || [];
}

/**
 * 시군구 코드로 시도 코드 찾기
 */
export function getSidoByGugun(gugunCode: string): string | undefined {
  const sidoCode = gugunCode.substring(0, 2);
  if (GUGUN_CODES[sidoCode]) {
    return sidoCode;
  }
  return undefined;
}
