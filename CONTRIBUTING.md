# Contributing to Context Korean

Thanks for helping! This project collects Korean expressions that AI translators get wrong, and the natural alternatives Koreans actually use.

## Two ways to contribute

**1. Submit a case (no coding).** Found a strange AI translation? Use the "Submit a case" button on the site. Include the English you typed, what the AI produced, and the situation.

**2. Add an entry directly (pull request).**

1. Copy any file in `data/words/` and rename it to a descriptive English slug, e.g. `why-not-to-say-dangsin-for-you.json`. Use lowercase letters, numbers and hyphens only.
2. Set `slug` to exactly the same name as the file (without `.json`).
3. Fill in every field. `category` must be one of:
   - `Workplace & Hierarchy`
   - `Daily Life`
   - `Emotion & Relationships`
   - `Food & Dining`
   - `Texting & Online`
   - `Email & Formal Writing`
   - `K-pop & Fandom`

   Some topic pages are built from tags instead of categories, so an entry can appear in both. Add the tag `double-verbs` to any compound or helper verb (빼먹다, 먹어 보다…) and it will also show up on the Double Verbs page.
4. Run the checker:
   ```bash
   npm run validate
   ```
5. Open a pull request. Briefly describe where you saw the AI mistake.

## What makes a good entry

- **A real AI failure.** The mistake should be something translators or chatbots actually produce, not a hypothetical.
- **A concrete situation.** Who is speaking to whom matters more than the word itself.
- **At least one natural alternative** with the context where it fits.
- **Explain the why** in `nuance`: the relationship, hierarchy or cultural logic behind it.
- **Credit the song.** If the word comes from a song title or lyrics, add `source` (artist, song, English title, year) and the `song` tag. Explain the word only — don't quote lyrics or interpret the song.
  ```json
  "source": { "artist": "BTS", "song": "쩔어", "english_title": "Dope", "year": 2015 }
  ```
- **Keep SEO text short:** `meta_title` 70 characters or fewer, `meta_description` 160 or fewer.

All entries are reviewed by a native speaker before release.

## Releases

Entries are grouped into versioned releases (v0.1, v0.2 …). Set `version` to the upcoming release number.

## 미리보기 이미지 (검색·SNS 공유용)

표현을 추가하거나 고친 뒤에는 미리보기 이미지를 다시 만들어 주세요.

```bash
npm run og        # public/og/<slug>.png 와 app/icon.png 생성 (Python + Playwright 필요)
```

이미지가 없어도 기본 이미지(`public/og/default.png`)로 대체되므로 사이트가 깨지지는 않습니다.

## 기여자 크레딧 (운영자용)

제보나 검수가 실리면 기여자 이름을 항목에 올립니다.

1. `data/contributors.json`에 한 줄 추가합니다.
   ```json
   { "id": "ana-lima", "name": "Ana Lima", "title": "UX designer", "country": "Brazil",
     "url": "https://www.linkedin.com/in/...", "joined": "2026-10-20", "founding": true }
   ```
   - `title`, `country`, `url`은 선택입니다. 본인이 원한 것만 넣으세요.
   - **첫 50명은 `"founding": true`** (Founding Contributor). 검증 스크립트가 50명을 넘지 않게 막아 줍니다.
2. 해당 항목 JSON에 `contributors`를 추가합니다. role은 `submitted`(제보) / `written`(작성) / `reviewed`(원어민 검수).
   ```json
   "contributors": [{ "id": "ana-lima", "role": "submitted" }]
   ```
3. `npm run validate` → `npm run og` (미리보기 카드에 이름이 들어갑니다) → 커밋.
4. 기여자에게 항목 링크를 보내 주세요. 공유 버튼으로 바로 자랑할 수 있습니다.
