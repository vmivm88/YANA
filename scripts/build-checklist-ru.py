"""Build the Russian "AI Korean Trap Checklist" PDF.

Usage:  python3 scripts/build-checklist-ru.py
Output: public/free/ai-korean-trap-checklist-ru.pdf

Content lives in scripts/checklist_ru_data.py (mirrors build-checklist.py).
"""

import sys
from html import escape
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))
from checklist_ru_data import CHECKS, SECTIONS  # noqa: E402

OUT_PDF = ROOT / "public" / "free" / "ai-korean-trap-checklist-ru.pdf"
OUT_HTML = ROOT / "scripts" / "checklist-ru.html"


def row(sit, ai, fix, rom, why):
    ai_cls = "ai note" if ai.startswith("(") else "ai"
    fix_cls = "fix note" if fix.startswith("(") else "fix"
    return f"""
    <li class="row">
      <p class="sit">{escape(sit)}</p>
      <div class="pair">
        <p class="{ai_cls}" lang="ko"><s>{escape(ai)}</s></p>
        <div class="right">
          <p class="{fix_cls}" lang="ko">{escape(fix)}</p>
          {f'<p class="rom">{escape(rom)}</p>' if rom else ''}
        </div>
      </div>
      <p class="why">{escape(why)}</p>
    </li>"""


def section(title, lede, rows):
    return f"""
  <section class="group">
    <h2>{escape(title)}</h2>
    {f'<p class="lede">{escape(lede)}</p>' if lede else ''}
    <div class="colhead"><span>Что даёт ИИ</span><span>Что говорят корейцы</span></div>
    <ul>{''.join(row(*r) for r in rows)}</ul>
  </section>"""


checks_html = "".join(
    f'<li><span class="box" aria-hidden="true"></span><div><p class="q">{q}</p><p class="a">{a}</p></div></li>'
    for q, a in CHECKS
)

HTML = f"""<!doctype html>
<html lang="ru"><head><meta charset="utf-8">
<title>Ловушки ИИ в корейском: чек-лист</title>
<style>
  @page {{ size: A4; margin: 16mm 17mm 16mm 17mm; }}
  :root {{
    --paper: #ffffff; --ink: #1c1917; --muted: #6f6862; --line: #e2dccf;
    --pen: #b4432f; --pen-soft: #f6e6e1;
  }}
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  html {{ background: var(--paper); }}
  body {{
    font-family: "Liberation Sans", "Noto Sans CJK KR", sans-serif; hyphens: auto;
    color: var(--ink); font-size: 9.6pt; line-height: 1.5;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }}
  [lang="ko"], .serif {{ font-family: "Noto Serif CJK KR", serif; }}

  /* Cover */
  .cover {{ break-after: page; }}
  .brand {{ display: flex; align-items: baseline; gap: 6pt; font-size: 10pt; }}
  .brand .ko {{ font-family: "Noto Serif CJK KR", serif; font-weight: 700; color: var(--pen); font-size: 13pt; }}
  .brand .en {{ font-weight: 700; }}
  .title {{ margin-top: 12mm; }}
  .title .struck {{
    font-family: "Noto Serif CJK KR", serif; font-size: 22pt; color: var(--muted);
    text-decoration: line-through; text-decoration-color: var(--pen); text-decoration-thickness: 2.4pt;
  }}
  .title h1 {{ font-size: 30pt; line-height: 1.08; letter-spacing: -0.02em; font-weight: 700; margin-top: 4mm; max-width: 150mm; }}
  .title .sub {{ margin-top: 5mm; font-size: 12pt; color: var(--muted); max-width: 135mm; line-height: 1.45; }}

  .check {{ margin-top: 10mm; }}
  .check h2 {{ font-size: 15pt; letter-spacing: -0.01em; }}
  .check .lede {{ color: var(--muted); margin-top: 1.5mm; }}
  .check ul {{ list-style: none; margin-top: 5mm; border-top: 1pt solid var(--ink); }}
  .check li {{ display: flex; gap: 4mm; padding: 2.6mm 0; border-bottom: 0.6pt solid var(--line); }}
  .box {{ flex: none; width: 4.2mm; height: 4.2mm; border: 1.1pt solid var(--ink); border-radius: 1pt; margin-top: 0.8mm; }}
  .check .q {{ font-weight: 700; font-size: 10.5pt; }}
  .check .a {{ color: var(--muted); margin-top: 0.6mm; max-width: 150mm; }}
  .check .a b {{ color: var(--ink); font-family: "Noto Serif CJK KR", serif; }}
  .cover footer {{ margin-top: 7mm; font-size: 8.5pt; color: var(--muted); display: flex; justify-content: space-between; }}

  /* Groups */
  .group {{ margin-bottom: 5mm; }}
  .group h2 {{ font-size: 15pt; letter-spacing: -0.01em; break-after: avoid; }}
  .group .lede {{ color: var(--muted); margin-top: 1mm; }}
  .colhead {{
    display: grid; grid-template-columns: 62mm 1fr; margin-top: 4mm; padding-bottom: 1.5mm;
    border-bottom: 1pt solid var(--ink); font-size: 8pt; color: var(--muted); break-after: avoid;
  }}
  .group ul {{ list-style: none; }}
  .row {{ padding: 2.1mm 0 2.3mm; border-bottom: 0.6pt solid var(--line); break-inside: avoid; }}
  .sit {{ font-size: 8.4pt; color: var(--muted); }}
  .pair {{ display: grid; grid-template-columns: 62mm 1fr; align-items: baseline; margin-top: 1mm; }}
  .ai {{ font-size: 12pt; color: var(--muted); padding-right: 4mm; }}
  .ai s {{ text-decoration-color: var(--pen); text-decoration-thickness: 1.6pt; }}
  .ai.note s {{ text-decoration: none; font-family: "Liberation Sans", sans-serif; font-size: 9pt; font-style: italic; }}
  .fix {{ font-size: 14pt; font-weight: 700; line-height: 1.3; }}
  .fix.note {{ font-family: "Liberation Sans", sans-serif; font-size: 11pt; font-style: italic; font-weight: 400; }}
  .rom {{ font-size: 8pt; color: var(--muted); margin-top: 0.4mm; }}
  .why {{ margin-top: 1.4mm; margin-left: 62mm; font-size: 8.8pt; }}

  /* Back */
  .back {{ break-inside: avoid; margin-top: 6mm; padding-top: 6mm; border-top: 1pt solid var(--ink); }}
  .back > * {{ max-width: 150mm; }}
  .back h2 {{ font-size: 17pt; line-height: 1.15; letter-spacing: -0.02em; }}
  .back p {{ margin-top: 2.5mm; font-size: 10pt; line-height: 1.55; }}
  .back .muted {{ color: var(--muted); }}
  .back .url {{ margin-top: 4mm; font-size: 13pt; font-weight: 700; color: var(--pen); }}
  .back .fine {{ margin-top: 5mm; font-size: 8pt; color: var(--muted); }}
</style></head>
<body>

<div class="cover">
  <div class="brand"><span class="ko">맥락</span><span class="en">Context Korean</span></div>

  <div class="title">
    <p class="struck" lang="ko">수고하세요, 팀장님!</p>
    <h1>Ловушки ИИ в корейском</h1>
    <p class="sub">20 фраз, которые ИИ-переводчики передают неправильно, что вместо них говорят корейцы, и 7 вопросов, которые стоит задать себе перед отправкой.</p>
  </div>

  <section class="check">
    <h2>Прежде чем отправить текст от ИИ</h2>
    <p class="lede">Пройдитесь по списку. Если отметили пункт, найдите исправление на следующих страницах.</p>
    <ul>{checks_html}</ul>
  </section>

  <footer><span>yanakorean.com</span><span>Бесплатно для изучающих. Поделитесь с другом.</span></footer>
</div>

{''.join(section(*s) for s in SECTIONS)}

<div class="back">
  <h2>Сомневаетесь в предложении?</h2>
  <p>У каждой фразы есть отдельная страница на сайте — с другими вариантами и культурным объяснением. Сайт пока на английском.</p>
  <p class="muted">Мы делаем проверку, которая читает текст от ИИ и показывает, как он прозвучит для начальника, родителей вашего партнёра или друга. Подписчики попробуют её первыми.</p>
  <p class="url">yanakorean.com</p>
  <p class="muted">Встретили странный перевод от ИИ? Пришлите на hello@yanakorean.com — можно по-русски. Возможно, он станет следующей статьёй.</p>
  <p class="fine">Context Korean — открытый проект, который ведут носители языка. Оператор: Fine Pearls (파인펄스).</p>
</div>

</body></html>
"""


def main():
    OUT_HTML.write_text(HTML, encoding="utf-8")
    OUT_PDF.parent.mkdir(parents=True, exist_ok=True)
    from playwright.sync_api import sync_playwright

    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto(OUT_HTML.as_uri())
        page.wait_for_load_state("networkidle")
        page.pdf(path=str(OUT_PDF), format="A4", print_background=True, prefer_css_page_size=True)
        browser.close()
    print(f"wrote {OUT_PDF}")


if __name__ == "__main__":
    main()
