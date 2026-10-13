"""Build static social/search preview images and the site icon.

Usage:  python3 scripts/build-og.py      (or: npm run og)
Output:
  public/og/default.png        home + topic pages (1200x630)
  public/og/<slug>.png         one per data/words/*.json (1200x630)
  app/icon.png, app/apple-icon.png   favicon (Next.js file convention)

Re-run after adding or editing an expression. Pages fall back to
default.png when a word image is missing, so forgetting is harmless.
"""

import json
from html import escape
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
WORDS = ROOT / "data" / "words"
OG_DIR = ROOT / "public" / "og"

# 표제어 자체가 '올바른 표현'인 항목은 취소선을 긋지 않습니다
NO_STRIKE = {"calling-older-friends-unni-oppa-hyung-nuna", "answering-negative-questions-eung-ani"}

BASE_CSS = """
* { margin: 0; padding: 0; box-sizing: border-box; }
body { width: 1200px; height: 630px; background: #faf8f4; color: #1c1917;
       font-family: "Noto Sans CJK KR", sans-serif; }
.ko { font-family: "Noto Serif CJK KR", serif; }
.frame { position: absolute; inset: 0; padding: 64px 72px; display: flex; flex-direction: column; }
.brand { display: flex; align-items: baseline; gap: 12px; font-size: 28px; font-weight: 700; }
.brand .ko { color: #b4432f; font-size: 34px; }
.struck { color: #8a827b; text-decoration: line-through; text-decoration-color: #b4432f;
          text-decoration-thickness: 6px; }
.foot { margin-top: auto; font-size: 26px; color: #6f6862; }
"""


def word_html(w):
    ai = w["korean"]
    fix = w["natural_solution"]["alternatives"][0]["phrase"]
    ai_size = 64 if len(ai) <= 12 else 46
    fix_size = 92 if len(fix) <= 10 else (72 if len(fix) <= 16 else 54)
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>{BASE_CSS}
.ai {{ margin-top: 70px; font-size: {ai_size}px; }}
.fix {{ margin-top: 18px; font-size: {fix_size}px; font-weight: 700; line-height: 1.15; }}
.sit {{ margin-top: 22px; font-size: 28px; color: #6f6862; max-width: 1000px; }}
</style></head><body><div class="frame">
<div class="brand"><span class="ko">맥락</span><span>Context Korean</span></div>
<p class="ai ko{'' if w['slug'] in NO_STRIKE else ' struck'}">{escape(ai)}</p>
<p class="fix ko">{escape(fix)}</p>
<p class="sit">{escape(w["ai_failure"]["situation"])}</p>
<p class="foot">Korean that AI gets wrong · yanakorean.com</p>
</div></body></html>"""


DEFAULT_HTML = f"""<!doctype html><html><head><meta charset="utf-8"><style>{BASE_CSS}
.struck {{ margin-top: 64px; font-size: 54px; }}
h1 {{ margin-top: 20px; font-size: 76px; line-height: 1.08; letter-spacing: -1.5px; max-width: 1000px; }}
</style></head><body><div class="frame">
<div class="brand"><span class="ko">맥락</span><span>Context Korean</span></div>
<p class="ko struck">수고하세요, 팀장님!</p>
<h1>Korean expressions AI translators get wrong</h1>
<p class="foot">What Koreans actually say instead · yanakorean.com</p>
</div></body></html>"""


def icon_html(size):
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>
* {{ margin: 0; }} html, body {{ background: transparent; }}
div {{ width: {size}px; height: {size}px; border-radius: {int(size * 0.22)}px; background: #b4432f;
       display: flex; align-items: center; justify-content: center; }}
span {{ font-family: "Noto Serif CJK KR", serif; font-weight: 700; color: #faf8f4;
        font-size: {int(size * 0.66)}px; line-height: 1; transform: translateY(-{int(size * 0.03)}px); }}
</style></head><body><div><span>맥</span></div></body></html>"""


def main():
    from playwright.sync_api import sync_playwright

    OG_DIR.mkdir(parents=True, exist_ok=True)
    words = [json.loads(p.read_text(encoding="utf-8")) for p in sorted(WORDS.glob("*.json"))]

    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1200, "height": 630})

        page.set_content(DEFAULT_HTML)
        page.screenshot(path=str(OG_DIR / "default.png"))
        for w in words:
            page.set_content(word_html(w))
            page.screenshot(path=str(OG_DIR / f"{w['slug']}.png"))

        for size, out in [(512, ROOT / "app" / "icon.png"), (180, ROOT / "app" / "apple-icon.png")]:
            ip = browser.new_page(viewport={"width": size, "height": size})
            ip.set_content(icon_html(size))
            ip.screenshot(path=str(out), omit_background=True)
            ip.close()

        browser.close()
    print(f"wrote {len(words) + 1} OG images and 2 icons")


if __name__ == "__main__":
    main()
