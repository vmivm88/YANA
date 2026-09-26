import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 모든 페이지는 data/words/*.json 에서 빌드 시점에 정적 생성(SSG)됩니다.
};

export default nextConfig;
