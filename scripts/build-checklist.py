"""Build the "AI Korean Trap Checklist" lead-magnet PDF.

Usage:  python3 scripts/build-checklist.py
Output: public/free/ai-korean-trap-checklist.pdf

Content is hand-edited from data/words/*.json (shortened for print).
Rendering uses Playwright's Chromium and the system Noto CJK fonts.
"""

from html import escape
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT_PDF = ROOT / "public" / "free" / "ai-korean-trap-checklist.pdf"
OUT_HTML = ROOT / "scripts" / "checklist.html"

CHECKS = [
    ("Who will read this?",
     "Older, more senior, or a stranger? Then every sentence needs <b>요</b> or <b>-습니다</b>. Plain endings are for close friends and juniors."),
    ("Delete every 당신.",
     "Korean drops “you” or uses a name and title instead. 당신 to a coworker can sound like the start of an argument."),
    ("No 씨 for anyone above you.",
     "Use the job title with 님: 팀장님, 교수님, 부장님. 씨 is only for peers and juniors."),
    ("Saying sorry or “got it” upward?",
     "Use <b>죄송합니다</b> and <b>알겠습니다</b>, not 미안해요 or 알았어요."),
    ("Is an elder eating, sleeping or “being” somewhere?",
     "Swap the verb itself: 드시다, 주무시다, 계시다."),
    ("Did AI translate an English idiom word for word?",
     "“I hope this email finds you well”, “Bless you”, “Thank you for the meal”. Korean has its own fixed phrase, or says nothing."),
    ("Replying “네.” in a chat?",
     "A bare 네 with a period reads cold. Soften it: <b>넵!</b> or <b>네~</b>"),
]

# (situation, AI version, say-instead, romanization, why)
SECTIONS = [
    ("Talking to someone above you",
     "Bosses, professors, clients, elders. This is where AI does the most damage.", [
        ("Leaving work before your boss",
         "수고하세요", "먼저 들어가 보겠습니다.", "meon-jeo deu-reo-ga bo-get-seum-ni-da",
         "“Keep working hard” directs someone’s labor. Said upward, it sounds condescending."),
        ("Your manager gives you a task",
         "알았어요", "네, 알겠습니다.", "ne, al-get-seum-ni-da",
         "알았어요 sounds like a reluctant “Fine, I heard you.”"),
        ("Emailing your team leader, Kim",
         "김 씨", "김 팀장님", "gim tim-jang-nim",
         "Surname + 씨 can sound like you’re talking down to them. Superiors get a title."),
        ("Handing in late work to a professor",
         "미안해요", "늦게 제출해서 정말 죄송합니다.", "neut-ge je-chul-hae-seo jeong-mal joe-song-ham-ni-da",
         "미안하다 is for equals. Upward, it sounds like you aren’t taking it seriously."),
        ("Inviting your grandmother to eat",
         "먹으세요", "맛있게 드세요.", "ma-sit-ge deu-se-yo",
         "A few verbs change completely for elders. 먹다 becomes 드시다."),
        ("Asking an older neighbor’s age",
         "몇 살이에요?", "연세가 어떻게 되세요?", "yeon-se-ga eo-tteo-ke doe-se-yo",
         "몇 살 is how you ask a child. Elders get 연세, adults get 나이."),
        ("Asking a coworker if they ate",
         "당신은 점심 먹었어요?", "점심 드셨어요?", "jeom-sim deu-syeo-sseo-yo",
         "Just drop “you”. Context does the work."),
    ]),
    ("Work chats and emails", "", [
        ("Your team leader messages you on KakaoTalk",
         "네.", "넵!", "nep",
         "In chat, a bare 네 with a period can read as flat or annoyed."),
        ("Opening a first email to a professor",
         "이 이메일이 잘 도착하길 바랍니다", "안녕하세요, ○○대학교 김소피입니다.", "an-nyeong-ha-se-yo, ○○ dae-hak-gyo gim-so-pi-im-ni-da",
         "There’s no Korean version of the English idiom. Greet, then say who you are."),
        ("Introducing yourself on day one",
         "만나서 반갑고 함께 일하기를 기대합니다", "앞으로 잘 부탁드립니다.", "ap-eu-ro jal bu-tak-deu-rim-ni-da",
         "The literal sentence sounds like a speech. Leaving out 잘 부탁드립니다 feels like something is missing."),
    ]),
    ("Phrases that don’t mean what AI says", "", [
        ("A clerk offers a bag and you want one",
         "괜찮아요", "네, 주세요.", "ne, ju-se-yo",
         "After an offer, 괜찮아요 means “No thanks.” Learners refuse things by accident."),
        ("A coworker asks 밥 먹었어요?",
         "(explaining your lunch)", "네, 먹었어요. 식사하셨어요?", "ne, meo-geo-sseo-yo. sik-sa-ha-syeo-sseo-yo",
         "It’s a greeting, closer to “How’s it going?” Answer briefly and ask back."),
        ("Someone says 언제 밥 한번 먹어요!",
         "(pulling out your calendar)", "네, 좋아요! 연락할게요.", "ne, jo-a-yo! yeol-lak-hal-ge-yo",
         "Usually a warm goodbye, not a plan. A real plan comes with a day and place."),
        ("A colleague thanks you",
         "천만에요", "아니에요.", "a-ni-e-yo",
         "Correct but theatrical. Koreans brush off thanks by saying it was nothing."),
    ]),
    ("People, meals and feelings", "", [
        ("A coworker sneezes",
         "축복해요", "(say nothing)", "",
         "Korean has no sneeze response. If they keep sneezing, ask 괜찮아요?"),
        ("Texting a female friend two years older (you’re a woman)",
         "지원아, 내일 시간 있어?", "언니, 내일 시간 있어요?", "eon-ni, nae-il si-gan i-sseo-yo",
         "Older friends get a title: 언니/오빠 from women, 누나/형 from men."),
        ("Calling over a woman at a small restaurant",
         "아줌마", "저기요, 주문할게요.", "jeo-gi-yo, ju-mun-hal-ge-yo",
         "아줌마 labels her age and many find it dismissive. 사장님 works for owners."),
        ("Telling a Korean about Korea",
         "저희 나라", "우리나라", "u-ri-na-ra",
         "You can’t humble a country the listener also belongs to."),
        ("Before eating a meal someone else paid for",
         "식사 감사합니다", "잘 먹겠습니다!", "jal meok-get-seum-ni-da",
         "Fixed phrases: 잘 먹겠습니다 before, 잘 먹었습니다 after."),
        ("A close friend left you out",
         "실망했어", "좀 서운하다.", "jom seo-un-ha-da",
         "실망했어 judges them. 서운하다 is the gentle word for feeling overlooked."),
    ]),
]


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
    <div class="colhead"><span>What AI gives you</span><span>What Koreans say</span></div>
    <ul>{''.join(row(*r) for r in rows)}</ul>
  </section>"""


checks_html = "".join(
    f'<li><span class="box" aria-hidden="true"></span><div><p class="q">{q}</p><p class="a">{a}</p></div></li>'
    for q, a in CHECKS
)

HTML = f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>The AI Korean Trap Checklist</title>
<style>
  @page {{ size: A4; margin: 16mm 17mm 16mm 17mm; }}
  :root {{
    --paper: #ffffff; --ink: #1c1917; --muted: #6f6862; --line: #e2dccf;
    --pen: #b4432f; --pen-soft: #f6e6e1;
  }}
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  html {{ background: var(--paper); }}
  body {{
    font-family: "Noto Sans CJK KR", "Noto Sans", sans-serif;
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
  .title h1 {{ font-size: 33pt; line-height: 1.08; letter-spacing: -0.02em; font-weight: 700; margin-top: 4mm; max-width: 150mm; }}
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
  .group {{ margin-bottom: 7mm; }}
  .group h2 {{ font-size: 15pt; letter-spacing: -0.01em; break-after: avoid; }}
  .group .lede {{ color: var(--muted); margin-top: 1mm; }}
  .colhead {{
    display: grid; grid-template-columns: 62mm 1fr; margin-top: 4mm; padding-bottom: 1.5mm;
    border-bottom: 1pt solid var(--ink); font-size: 8pt; color: var(--muted); break-after: avoid;
  }}
  .group ul {{ list-style: none; }}
  .row {{ padding: 2.4mm 0 2.6mm; border-bottom: 0.6pt solid var(--line); break-inside: avoid; }}
  .sit {{ font-size: 8.4pt; color: var(--muted); }}
  .pair {{ display: grid; grid-template-columns: 62mm 1fr; align-items: baseline; margin-top: 1mm; }}
  .ai {{ font-size: 12pt; color: var(--muted); padding-right: 4mm; }}
  .ai s {{ text-decoration-color: var(--pen); text-decoration-thickness: 1.6pt; }}
  .ai.note s {{ text-decoration: none; font-family: "Noto Sans CJK KR", sans-serif; font-size: 9pt; font-style: italic; }}
  .fix {{ font-size: 14pt; font-weight: 700; line-height: 1.3; }}
  .fix.note {{ font-family: "Noto Sans CJK KR", sans-serif; font-size: 11pt; font-style: italic; font-weight: 400; }}
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
    <h1>The AI Korean Trap Checklist</h1>
    <p class="sub">20 phrases AI translators get wrong, what Koreans say instead, and a 7-point check to run before you hit send.</p>
  </div>

  <section class="check">
    <h2>Before you send anything AI wrote</h2>
    <p class="lede">Run down this list. If you tick a box, look up the fix on the next pages.</p>
    <ul>{checks_html}</ul>
  </section>

  <footer><span>yanakorean.com</span><span>Free for learners. Share it with a friend.</span></footer>
</div>

{''.join(section(*s) for s in SECTIONS)}

<div class="back">
  <h2>Not sure about a sentence?</h2>
  <p>Every phrase here has a full page on our site, with more alternatives and the cultural reason behind it.</p>
  <p class="muted">We’re building a checker that reads what an AI wrote and tells you how it will sound to your boss, your partner’s parents, or a friend. Subscribers get to try it first.</p>
  <p class="url">yanakorean.com</p>
  <p class="muted">Seen a strange AI translation? Send it to us at hello@yanakorean.com and it may become the next entry.</p>
  <p class="fine">Context Korean is an open-source project curated by native speakers. Operated by Fine Pearls (파인펄스).</p>
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
