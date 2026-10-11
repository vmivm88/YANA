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
- **Keep SEO text short:** `meta_title` 70 characters or fewer, `meta_description` 160 or fewer.

All entries are reviewed by a native speaker before release.

## Releases

Entries are grouped into versioned releases (v0.1, v0.2 …). Set `version` to the upcoming release number.
