/** @type {import('next').NextConfig} */
module.exports = {
  // 프로덕션 빌드 시에만 static export 사용
  // 개발 모드에서는 API Routes 사용 가능
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  distDir: process.env.NODE_ENV === 'production' ? '../app' : '.next',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    return config;
  },
};
