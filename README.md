# YANA — Context Korean

Korean expressions that AI translators get wrong, and what Koreans actually say instead.
An open-source, versioned collection (v0.1, v0.2 …) for intermediate/advanced English-speaking learners.

## 실행

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # 정적 생성 확인
```

Vercel에 이 저장소를 연결하면 push할 때마다 자동 배포됩니다. 환경변수:

| 변수 | 용도 |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | 배포 도메인 (sitemap, canonical, OG에 사용) |
| `NEXT_PUBLIC_FEEDBACK_URL` | Tally/Google Forms 제보 링크 |

## 폴더 구조

```
app/
  layout.tsx            공통 헤더·푸터, 사이트 기본 메타데이터
  page.tsx              메인: Hero + 버전 배지 + 카드 그리드 (+ JSON-LD ItemList)
  words/[slug]/page.tsx 상세: Before/After, 뉘앙스 해설 (+ FAQPage JSON-LD)
  sitemap.ts            data/words 기반 sitemap.xml 자동 생성
  robots.ts
components/
  WordGrid.tsx          검색 + 카테고리 필터 (클라이언트)
  WordCard.tsx
lib/
  words.ts              JSON 읽기 유틸 (getAllWords, getWordBySlug, getWordSlugs, getCategories)
  types.ts              데이터 스키마 타입
  site.ts               사이트 이름·URL·링크 설정
data/words/             ← 표현 하나당 JSON 파일 하나
```

## 표현 추가하기

1. `data/words/`에 기존 파일을 복사해 새 JSON을 만듭니다.
2. **파일명과 `slug`가 반드시 같아야 합니다** (다르면 빌드가 에러로 멈춥니다).
3. `category`는 `Workplace & Hierarchy` / `Daily Life` / `Emotion & Relationships` / `Food & Dining` / `Texting & Online` / `Email & Formal Writing` 중 하나.
4. `nuance`(상세 해설), `alternatives[].romanization`은 선택 항목입니다.
5. `npm run validate`로 검사 (빌드 전에도 자동 실행됩니다)
6. commit & push → 사이트와 sitemap에 자동 반영. 자세한 기준은 [CONTRIBUTING.md](CONTRIBUTING.md) 참고.
